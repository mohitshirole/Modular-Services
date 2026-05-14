import { Sequelize } from 'sequelize';
import logger from './logger.js';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || './scheduler.sqlite',
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info('✔ Scheduler SQLite Database connected and synced');
  } catch (error) {
    logger.error('Unable to connect to the SQLite database:', error);
  }
};

export default sequelize;
