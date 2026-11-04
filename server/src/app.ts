import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { createSupplierRoutes } from './routes/supplierRoutes';
import { SupplierControllerDeps } from './controllers/supplierController';

export interface AppOptions extends SupplierControllerDeps {
  corsOrigins: string[];
  trustProxy: number;
}

export const createApp = ({ corsOrigins, trustProxy, storage, mailer }: AppOptions) => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', trustProxy);
  app.use(cors({ origin: corsOrigins, methods: ['POST'] }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use('/api/suppliers', createSupplierRoutes({ storage, mailer }));

  app.use(errorHandler);

  return app;
};
