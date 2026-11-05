import mongoose from 'mongoose';
import { createApp } from './app';
import { loadConfig } from './config';
import { createGmailMailer } from './services/mailer';
import { createR2Storage } from './services/storage';
import { logger } from './utils/logger';

const start = async () => {
  const config = loadConfig();

  await mongoose.connect(config.mongodbUri, { serverSelectionTimeoutMS: 5000 });
  // Without a database name in the URI the driver silently uses "test"
  if (mongoose.connection.db?.databaseName === 'test') {
    throw new Error('MONGODB_URI must include the database name, e.g. ...mongodb.net/gracefulcare?...');
  }
  logger.info('MongoDB connected');

  const app = createApp({
    corsOrigins: config.corsOrigins,
    trustProxy: config.trustProxy,
    storage: createR2Storage(config.r2),
    mailer: createGmailMailer(config.smtp, config.notifyTo),
  });

  app.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port}`);
  });
};

start().catch((error) => {
  logger.error('Failed to start server', {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection', {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
