import { google } from 'googleapis';
import { Readable } from 'stream';
import logger from '../utils/logger.js';

export const createGoogleDriveProvider = (config = {}) => {
  const auth = new google.auth.GoogleAuth({
    credentials: config.credentials, // Service Account JSON
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });

  return {
    name: 'google-drive',

    /**
     * Upload to Google Drive
     */
    upload: async ({ file, folder, fileName }) => {
      try {
        const finalFileName = fileName || `${Date.now()}-${file.originalname}`;
        
        const fileMetadata = {
          name: finalFileName,
          parents: folder ? [folder] : [] // Folder ID in GDrive
        };

        const media = {
          mimeType: file.mimetype,
          body: Readable.from(file.buffer),
        };

        const response = await drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: 'id, webViewLink',
        });

        logger.info(`File uploaded to Google Drive: ${response.data.id}`);

        return { 
          success: true, 
          id: response.data.id, 
          url: response.data.webViewLink 
        };
      } catch (error) {
        logger.error(`Google Drive Upload Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  };
};
