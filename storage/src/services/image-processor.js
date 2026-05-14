import sharp from 'sharp';
import logger from '../utils/logger.js';

/**
 * Process an image (Resize, Compress)
 */
export const processImage = async (buffer, options = {}) => {
  try {
    let pipeline = sharp(buffer);

    // 1. Auto-resize if width/height provided
    if (options.width || options.height) {
      pipeline = pipeline.resize({
        width: options.width,
        height: options.height,
        fit: options.fit || 'cover',
        withoutEnlargement: true
      });
    }

    // 2. Optimization
    if (options.format === 'webp') {
      pipeline = pipeline.webp({ quality: options.quality || 80 });
    } else if (options.format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality: options.quality || 80 });
    }

    const processedBuffer = await pipeline.toBuffer();
    const metadata = await sharp(processedBuffer).metadata();

    return { 
      buffer: processedBuffer, 
      metadata: { 
        width: metadata.width, 
        height: metadata.height, 
        format: metadata.format 
      } 
    };
  } catch (error) {
    logger.error(`Image Processing Error: ${error.message}`);
    // If processing fails, return original buffer
    return { buffer };
  }
};
