import { BlobServiceClient } from '@azure/storage-blob';
import logger from '../utils/logger.js';

export const createAzureProvider = (config = {}) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionString);
  const containerClient = blobServiceClient.getContainerClient(config.containerName);

  return {
    name: 'azure',

    /**
     * Upload to Azure Blob
     */
    upload: async ({ file, folder = 'general', fileName }) => {
      try {
        const finalFileName = fileName || `${Date.now()}-${file.originalname}`;
        const blobName = folder ? `${folder}/${finalFileName}` : finalFileName;
        
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadData(file.buffer, {
          blobHTTPHeaders: { blobContentType: file.mimetype }
        });

        logger.info(`File uploaded to Azure: ${blobName}`);

        return { 
          success: true, 
          blobName, 
          url: blockBlobClient.url 
        };
      } catch (error) {
        logger.error(`Azure Upload Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  };
};
