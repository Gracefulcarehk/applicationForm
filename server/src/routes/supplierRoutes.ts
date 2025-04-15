import { Router } from 'express';
import { supplierController } from '../controllers/supplierController';
import { validateSupplier } from '../middleware/validateSupplier';

const router = Router();

router.post('/', validateSupplier, supplierController.createSupplier);
router.get('/', supplierController.getSuppliers);
router.get('/:id', supplierController.getSupplierById);
router.put('/:id', validateSupplier, supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

export const supplierRoutes = router; 