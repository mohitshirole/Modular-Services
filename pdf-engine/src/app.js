import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pdfRoutes from './routes/pdf.routes.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4005;

// Security & Middleware
app.use(helmet({
  contentSecurityPolicy: false // Required for Puppeteer if you serve the browser preview
}));
app.use(cors());
// PDF requests can be large (HTML templates), so we increase the limit
app.use(express.json({ limit: '10mb' }));

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/v1/pdf', pdfRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'pdf-engine',
    timestamp: new Date().toISOString()
  });
});

// Health Check
app.get('/', (req, res) => {
  res.json({
    service: 'PDF Rendering Engine',
    status: 'Operational',
    engine: 'Puppeteer/Chromium',
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
  logger.info(`✔ PDF Engine running on http://localhost:${PORT}`);
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
