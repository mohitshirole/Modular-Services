import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import logger from './logger.js';

/**
 * Get an authenticated Google Sheets client
 */
export const getSheetsClient = async () => {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_FILE || './service-account.json';
  
  if (!fs.existsSync(keyPath)) {
    const errorMsg = `Google Service Account file missing at: ${path.resolve(keyPath)}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    return google.sheets({ version: 'v4', auth: authClient });
  } catch (error) {
    logger.error(`Failed to initialize Google Auth: ${error.message}`);
    throw error;
  }
};
