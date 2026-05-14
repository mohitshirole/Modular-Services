import storageFactory from '../services/storage-factory.js';
import { processImage } from '../services/image-processor.js';
import logger from '../utils/logger.js';
import { reportEvent } from '../utils/telemetry.js';

/**
 * Handle File Upload
 */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // 1. Parse metadata/config (Multipart sends these as strings)
    const providerName = req.body.provider || 'local';
    const folder = req.body.folder || 'general';
    const config = req.body.config ? JSON.parse(req.body.config) : {};
    const resizeOptions = req.body.resize ? JSON.parse(req.body.resize) : null;

    let fileToUpload = req.file;

    // 2. Process Image if requested
    if (resizeOptions && req.file.mimetype.startsWith('image/')) {
      logger.info(`Processing image for ${req.file.originalname}`);
      const processed = await processImage(req.file.buffer, resizeOptions);
      fileToUpload.buffer = processed.buffer;
    }

    // 3. Get Provider and Upload
    const provider = storageFactory.getProvider(providerName, config);
    const result = await provider.upload({
      file: fileToUpload,
      folder: folder,
      fileName: req.body.fileName
    });

    if (result.success) {
      await reportEvent('FILE_UPLOADED', 'info', { provider: providerName, folder, originalName: req.file.originalname });
      res.status(201).json(result);
    } else {
      await reportEvent('UPLOAD_FAILED', 'error', { provider: providerName, error: result.error });
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`Controller Upload Error: ${error.message}`);
    await reportEvent('UPLOAD_ERROR', 'error', { error: error.message });
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

/**
 * Generate a Signed URL (Cloud only)
 */
export const getSignedUrl = async (req, res) => {
  const { provider: providerName, key, config, expires } = req.body;

  try {
    const provider = storageFactory.getProvider(providerName, config || {});
    
    if (typeof provider.getSignedUrl !== 'function') {
      return res.status(400).json({ success: false, message: "Provider does not support signed URLs" });
    }

    const result = await provider.getSignedUrl(key, expires);
    await reportEvent('SIGNED_URL_GENERATED', 'info', { provider: providerName, key });
    res.json(result);
  } catch (error) {
    await reportEvent('SIGNED_URL_ERROR', 'error', { error: error.message });
    res.status(500).json({ success: false, message: "Failed to generate URL" });
  }
};
