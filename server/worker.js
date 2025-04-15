import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';
import { supplierRoutes } from './src/routes/supplierRoutes';

const app = new Hono();

// Middleware
app.use('*', cors());

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