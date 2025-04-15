import { Request, Response, NextFunction } from 'express';
import { Supplier } from '../models/supplierModel';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const supplierController = {
  async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = new Supplier(req.body);
      await supplier.save();
      logger.info('Supplier created successfully:', supplier);
      res.status(201).json(supplier);
    } catch (error) {
      next(new AppError('Failed to create supplier', 500));
    }
  },

  async getSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const suppliers = await Supplier.find();
      res.json(suppliers);
    } catch (error) {
      next(new AppError('Failed to fetch suppliers', 500));
    }
  },

  async getSupplierById(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        return next(new AppError('Supplier not found', 404));
      }
      res.json(supplier);
    } catch (error) {
      next(new AppError('Failed to fetch supplier', 500));
    }
  },

  async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!supplier) {
        return next(new AppError('Supplier not found', 404));
      }
      logger.info('Supplier updated successfully:', supplier);
      res.json(supplier);
    } catch (error) {
      next(new AppError('Failed to update supplier', 500));
    }
  },

  async deleteSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await Supplier.findByIdAndDelete(req.params.id);
      if (!supplier) {
        return next(new AppError('Supplier not found', 404));
      }
      logger.info('Supplier deleted successfully:', supplier);
      res.status(204).send();
    } catch (error) {
      next(new AppError('Failed to delete supplier', 500));
    }
  },
}; 