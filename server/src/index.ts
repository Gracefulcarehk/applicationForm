import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { supplierRoutes } from './routes/supplierRoutes';
import { logger } from './utils/logger';
import R2Service from './services/r2Service';

// Load environment variables
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'https://31c48c74.applicationform-s7q.pages.dev',
    'https://014268e1.applicationform-s7q.pages.dev',
    'https://wemixtech.com',
    'https://www.wemixtech.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'Referer', 'User-Agent', 'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Initialize R2Service
const r2Service = new R2Service({
  accountId: process.env.R2_ACCOUNT_ID || '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucketName: process.env.CLOUDFLARE_BUCKET_NAME || '',
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
  });

// Routes
app.use('/api/suppliers', supplierRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
}); 