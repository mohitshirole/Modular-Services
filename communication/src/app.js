import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import commRoutes from './routes/comm.routes.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4003;

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/v1/comm', commRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'communication-gateway',
    timestamp: new Date().toISOString()
  });
});

// Base Route
app.get('/', (req, res) => {
  res.json({
    service: 'Communication Gateway',
    status: 'Operational',
    version: '1.0.0',
    channels: ['email', 'sms', 'whatsapp']
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
  logger.info(`✔ Communication Gateway running on http://localhost:${PORT}`);
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
