import { getSheetsClient } from '../utils/google-auth.js';
import logger from '../utils/logger.js';

/**
 * Utility: Convert column letter to index (A->0, B->1)
 */
const columnToIndex = (colStr) => {
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  return col - 1;
};

/**
 * Utility: Convert index to column letter (0->A, 1->B)
 */
const indexToColumn = (index) => {
  let colLetter = '';
  let tempIdx = index;
  while (tempIdx >= 0) {
    colLetter = String.fromCharCode(65 + (tempIdx % 26)) + colLetter;
    tempIdx = Math.floor(tempIdx / 26) - 1;
  }
  return colLetter;
};

/**
 * Utility: Properly quote sheet names with spaces
 */
const quoteSheet = (name) => {
  if (!name) return "";
  if (name.includes(' ') || name.includes('-') || name.includes('.')) {
    return `'${name}'`;
  }
  return name;
};

/**
 * 1. Metadata Service: Get all tabs and their headers
 */
export const getSheetMetadata = async (spreadsheetId) => {
  const sheets = await getSheetsClient();
  const response = await sheets.spreadsheets.get({ spreadsheetId });
  
  const tabs = response.data.sheets.map(s => ({
    title: s.properties.title,
    sheetId: s.properties.sheetId
  }));

  const meta = await Promise.all(tabs.map(async (tab) => {
    try {
      const headerResp = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${quoteSheet(tab.title)}!1:1`
      });
      return { ...tab, headers: headerResp.data.values?.[0] || [] };
    } catch (e) {
      return { ...tab, headers: [] };
    }
  }));

  return meta;
};

/**
 * 2. Fetch Data Service: Multiple sheets + Header Rows + Merged Fields
 */
export const fetchSheetData = async ({ spreadsheetId, config }) => {
  const { tabs = [], mergedFields = [] } = config;
  const sheets = await getSheetsClient();
  const allRows = [];

  for (const tab of tabs) {
    const { sheetName, range, headerRow = 1 } = tab;
    const finalRange = range || `${quoteSheet(sheetName)}!A:ZZ`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: finalRange,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) continue;

    const headerIdx = Math.max(0, headerRow - 1);
    const headers = rows[headerIdx].map(h => String(h || '').trim());
    const dataRows = rows.slice(headerIdx + 1);

    const sheetData = dataRows.map(row => {
      const rowObj = {};
      headers.forEach((header, index) => {
        if (header) rowObj[header] = row[index];
      });

      mergedFields.forEach(mf => {
        const sources = Array.isArray(mf.sources) ? mf.sources : [mf.sources];
        const vals = sources.map(f => rowObj[f]).filter(v => v);
        if (vals.length > 0) rowObj[mf.key] = vals.join(mf.delimiter || ' ');
      });

      rowObj['_tab'] = sheetName;
      return rowObj;
    });

    allRows.push(...sheetData);
  }

  return allRows;
};

/**
 * 3. Sync Service: Update or Append (with Upsert control)
 */
export const syncSheetData = async ({ spreadsheetId, tabName, syncData = [], headerRow = 1, upsert = false }) => {
  if (!tabName || syncData.length === 0) throw new Error("tabName and syncData are required");

  const sheets = await getSheetsClient();
  const quotedName = quoteSheet(tabName);

  // A. Fetch current sheet
  const fullSheet = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${quotedName}!A:ZZ`
  });

  const rows = fullSheet.data.values || [];
  if (rows.length === 0) throw new Error("Sheet is empty or not found");

  const headerIdx = Math.max(0, headerRow - 1);
  const headers = rows[headerIdx].map(h => String(h || '').trim());
  const headerToColMap = {};
  headers.forEach((h, i) => headerToColMap[h] = indexToColumn(i));

  // Determine match fields
  const matchFields = Array.from(new Set(syncData.flatMap(d => Object.keys(d.match))));
  const matchColIndices = matchFields.map(field => {
    const idx = headers.indexOf(field);
    if (idx === -1) throw new Error(`Match field '${field}' not found in sheet headers`);
    return { field, idx };
  });

  const getLookupKey = (data, fields) => {
    let hasValue = false;
    const key = fields.map(f => {
      const val = (typeof data === 'object' && !Array.isArray(data)) ? data[f.field] : data[f.idx];
      const cleanVal = String(val || '').trim().toLowerCase();
      if (cleanVal) hasValue = true;
      return cleanVal;
    }).join('|');
    return hasValue ? key : null;
  };

  const rowIndexIndex = {};
  rows.forEach((row, idx) => {
    if (idx <= headerIdx) return;
    const key = getLookupKey(row, matchColIndices);
    if (key && rowIndexIndex[key] === undefined) {
      rowIndexIndex[key] = idx;
    }
  });

  const batchUpdates = [];
  const batchAppends = [];
  const results = [];
  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const entry of syncData) {
    try {
      const { match, update } = entry;
      const key = getLookupKey(match, matchColIndices);
      const existingRowIdx = key ? rowIndexIndex[key] : undefined;

      if (existingRowIdx !== undefined) {
        // UPDATE Logic
        Object.entries(update).forEach(([field, val]) => {
          const colLetter = headerToColMap[field];
          if (colLetter) {
            batchUpdates.push({
              range: `${quotedName}!${colLetter}${existingRowIdx + 1}`,
              values: [[val]]
            });
          }
        });
        results.push({ match, status: 'SUCCESS', action: 'UPDATE', message: 'Row updated' });
        successCount++;
      } else if (upsert) {
        // APPEND Logic (Only if upsert is true)
        const fullItem = { ...match, ...update };
        const rowArr = headers.map(h => fullItem[h] || '');
        batchAppends.push(rowArr);
        results.push({ match, status: 'SUCCESS', action: 'APPEND', message: 'New row added' });
        successCount++;
      } else {
        // SKIP Logic
        results.push({ match, status: 'SKIPPED', action: 'NONE', message: 'No match found and upsert is disabled' });
        skippedCount++;
      }
    } catch (err) {
      errorCount++;
      results.push({ match: entry.match, status: 'FAILED', message: err.message });
    }
  }

  // Execute Batch Operations
  if (batchUpdates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: batchUpdates
      }
    });
  }

  if (batchAppends.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${quotedName}!A:${indexToColumn(headers.length - 1)}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: batchAppends }
    });
  }

  return {
    summary: { total: syncData.length, success: successCount, skipped: skippedCount, failed: errorCount },
    details: results
  };
};
