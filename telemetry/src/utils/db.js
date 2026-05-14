import { Sequelize } from 'sequelize';
import logger from './logger.js';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || './telemetry.sqlite',
  logging: false, // Keep logs clean, winston handles it
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // Sync models in development
    await sequelize.sync();
    logger.info('✔ Telemetry SQLite Database connected and synced');
  } catch (error) {
    logger.error('Unable to connect to the SQLite database:', error);
  }
};

export default sequelize;
