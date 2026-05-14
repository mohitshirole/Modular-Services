import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import logger from '../utils/logger.js';

export const createS3Provider = (config = {}) => {
  const client = new S3Client({
    region: config.region || 'us-east-1',
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    }
  });

  const bucket = config.bucket;

  return {
    name: 's3',

    /**
     * Upload to S3
     */
    upload: async ({ file, folder = 'general', fileName }) => {
      try {
        const finalFileName = fileName || `${Date.now()}-${file.originalname}`;
        const key = folder ? `${folder}/${finalFileName}` : finalFileName;

        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype
        });

        await client.send(command);
        
        logger.info(`File uploaded to S3: ${key}`);

        return { 
          success: true, 
          key, 
          bucket, 
          url: `https://${bucket}.s3.amazonaws.com/${key}` 
        };
      } catch (error) {
        logger.error(`S3 Upload Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    },

    /**
     * Generate a temporary signed URL
     */
    getSignedUrl: async (key, expiresMode = 3600) => {
      try {
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        const url = await getSignedUrl(client, command, { expiresIn: expiresMode });
        return { success: true, url };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };
};
