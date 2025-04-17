import { Request, Response, NextFunction } from 'express';
import { Supplier } from '../models/supplierModel';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { StorageService } from '../services/storageService';

export const supplierController = {
  async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const formData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Handle ID card file upload
      if (files.idCardFile?.[0]) {
        const idCardFile = files.idCardFile[0];
        const fileKey = StorageService.generateFileKey(
          idCardFile.originalname,
          formData.hkid,
          'idCard'
        );
        const { key, url } = await StorageService.uploadFile(
          idCardFile.buffer,
          fileKey,
          idCardFile.mimetype
        );
        formData.idCardFileKey = key;
        formData.idCardFileUrl = url;
      }

      // Handle bank file upload
      if (files.bankFile?.[0]) {
        const bankFile = files.bankFile[0];
        const fileKey = StorageService.generateFileKey(
          bankFile.originalname,
          formData.hkid,
          'bank'
        );
        const { key, url } = await StorageService.uploadFile(
          bankFile.buffer,
          fileKey,
          bankFile.mimetype
        );
        formData.bankAccount.fileKey = key;
        formData.bankAccount.fileUrl = url;
      }

      // Handle certification files upload
      if (files.certificationFiles) {
        formData.professionalCertifications = await Promise.all(
          formData.professionalCertifications.map(async (cert: any, index: number) => {
            const certFile = files.certificationFiles[index];
            if (certFile) {
              const fileKey = StorageService.generateFileKey(
                certFile.originalname,
                formData.hkid,
                'certification'
              );
              const { key, url } = await StorageService.uploadFile(
                certFile.buffer,
                fileKey,
                certFile.mimetype
              );
              return {
                ...cert,
                fileKey: key,
                fileUrl: url,
              };
            }
            return cert;
          })
        );
      }

      const supplier = new Supplier(formData);
      await supplier.save();
      logger.info('Supplier created successfully:', supplier);
      res.status(201).json(supplier);
    } catch (error) {
      logger.error('Error creating supplier:', error);
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