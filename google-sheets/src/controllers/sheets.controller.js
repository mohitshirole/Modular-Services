import * as sheetsService from '../services/sheets-engine.service.js';
import logger from '../utils/logger.js';

/**
 * Get Sheet Metadata (Tabs & Headers)
 */
export const getMetadata = async (req, res) => {
  const { spreadsheetId } = req.body;
  try {
    logger.info(`Fetching metadata for spreadsheet: ${spreadsheetId}`);
    const meta = await sheetsService.getSheetMetadata(spreadsheetId);
    res.json({ success: true, data: meta });
  } catch (error) {
    logger.error(`Metadata Error: ${error.message}`);
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
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    logger.error(`Read Error: ${error.message}`);
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
    res.json({ success: true, result });
  } catch (error) {
    logger.error(`Sync Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
