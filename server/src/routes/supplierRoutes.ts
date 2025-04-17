import express from 'express';
import { supplierController } from '../controllers/supplierController';
import { validateSupplier } from '../middleware/validateSupplier';
import { fileAccessMiddleware } from '../middleware/fileAccessMiddleware';
import { StorageService } from '../services/storageService';
import { R2Bucket } from '@cloudflare/workers-types';

const router = express.Router();

// Initialize storage service
if (!process.env.DOCUMENTS_BUCKET || !process.env.R2_PUBLIC_DOMAIN) {
  throw new Error('Missing required environment variables for R2 configuration');
}

const storageService = new StorageService(
  process.env.DOCUMENTS_BUCKET as unknown as R2Bucket,
  process.env.R2_PUBLIC_DOMAIN
);

// File access routes
router.get('/files/:fileKey', fileAccessMiddleware(storageService));

// Supplier routes
router.post('/', validateSupplier, supplierController.createSupplier);
router.get('/', supplierController.getSuppliers);
router.get('/:id', supplierController.getSupplierById);
router.put('/:id', validateSupplier, supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

export default router; 