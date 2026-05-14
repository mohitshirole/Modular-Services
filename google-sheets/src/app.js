import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import sheetRoutes from './routes/sheets.routes.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Higher limit for large sheet data

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/v1/sheets', sheetRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'sheets-engine',
    timestamp: new Date().toISOString()
  });
});

// Base Route
app.get('/', (req, res) => {
  res.json({
    service: 'Google Sheets Engine',
    status: 'Operational',
    version: '1.0.0'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.stack}`);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// Start Server
const server = app.listen(PORT, () => {
  logger.info(`✔ Google Sheets Engine running on http://localhost:${PORT}`);
});

// Graceful Shutdown
const shutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('Process terminated.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
