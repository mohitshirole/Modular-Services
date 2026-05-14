import fs from 'fs/promises';
import path from 'path';
import logger from '../utils/logger.js';

export const createLocalProvider = (config = {}) => {
  const basePath = config.basePath || process.env.LOCAL_STORAGE_PATH || './uploads';

  return {
    name: 'local',

    /**
     * Upload a file with bifurcation
     */
    upload: async ({ file, folder = 'general', fileName }) => {
      try {
        const targetDir = path.join(basePath, folder);
        
        // 1. Create directory if it doesn't exist
        await fs.mkdir(targetDir, { recursive: true });

        const finalFileName = fileName || `${Date.now()}-${file.originalname}`;
        const targetPath = path.join(targetDir, finalFileName);

        // 2. Write file
        await fs.writeFile(targetPath, file.buffer);

        logger.info(`File uploaded locally: ${targetPath}`);
        
        return { 
          success: true, 
          path: targetPath, 
          url: `/uploads/${folder}/${finalFileName}`, // Relative URL
          metadata: { size: file.size, mimetype: file.mimetype }
        };
      } catch (error) {
        logger.error(`Local Upload Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    },

    /**
     * Delete a file
     */
    delete: async (filePath) => {
      try {
        const absolutePath = path.resolve(filePath);
        await fs.unlink(absolutePath);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };
};
