import * as sheetsService from '../services/sheets-engine.service.js';
import logger from '../utils/logger.js';
import { reportEvent } from '../utils/telemetry.js';

/**
 * Get Sheet Metadata (Tabs & Headers)
 */
export const getMetadata = async (req, res) => {
  const { spreadsheetId } = req.body;
  try {
    logger.info(`Fetching metadata for spreadsheet: ${spreadsheetId}`);
    const meta = await sheetsService.getSheetMetadata(spreadsheetId);
    await reportEvent('SHEET_METADATA_FETCHED', 'info', { spreadsheetId });
    res.json({ success: true, data: meta });
  } catch (error) {
    logger.error(`Metadata Error: ${error.message}`);
    await reportEvent('SHEET_METADATA_ERROR', 'error', { spreadsheetId, error: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Read Data from Sheets
 */
export const readData = async (req, res) => {
  const { spreadsheetId, config } = req.body;
  try {
    logger.info(`Reading data from spreadsheet: ${spreadsheetId}`);
    const data = await sheetsService.fetchSheetData({ spreadsheetId, config });
    await reportEvent('SHEET_DATA_READ', 'info', { spreadsheetId, count: data.length });
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    logger.error(`Read Error: ${error.message}`);
    await reportEvent('SHEET_READ_ERROR', 'error', { spreadsheetId, error: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Sync Data (Update or Append)
 */
export const syncData = async (req, res) => {
  const { spreadsheetId, tabName, syncData, headerRow, upsert } = req.body;
  try {
    logger.info(`Syncing data to spreadsheet: ${spreadsheetId}, tab: ${tabName} (Upsert: ${upsert})`);
    const result = await sheetsService.syncSheetData({ 
      spreadsheetId, 
      tabName, 
      syncData, 
      headerRow,
      upsert
    });
    await reportEvent('SHEET_DATA_SYNCED', 'info', { spreadsheetId, tabName, upsert });
    res.json({ success: true, result });
  } catch (error) {
    logger.error(`Sync Error: ${error.message}`);
    await reportEvent('SHEET_SYNC_ERROR', 'error', { spreadsheetId, tabName, error: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};
