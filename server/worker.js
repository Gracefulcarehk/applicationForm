import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';
import { supplierRoutes } from './src/routes/supplierRoutes';
import { StorageService } from './src/services/storageService';

const app = new Hono();

// Middleware
app.use('*', cors());

// Initialize storage service
app.use('*', async (c, next) => {
  const bucket = c.env.DOCUMENTS_BUCKET;
  const publicDomain = c.env.R2_PUBLIC_DOMAIN;
  c.set('storage', new StorageService(bucket, publicDomain));
  await next();
});

// Database initialization
app.use('*', async (c, next) => {
  const db = c.env.DB;
  c.set('db', db);
  await next();
});

// Routes
app.route('/api/suppliers', supplierRoutes);

// Error handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export default handle(app); 