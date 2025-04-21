import { Request, Response, NextFunction } from 'express';
import { Supplier as SupplierModel } from '../models/supplierModel';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import R2Service from '../services/r2Service';
import { Context } from 'hono';
import { config } from '../config/config';
import type { Supplier } from '../types/supplier';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const r2Service = new R2Service({
  accountId: config.r2.accountId,
  accessKeyId: config.r2.accessKeyId,
  secretAccessKey: config.r2.secretAccessKey,
  bucketName: config.r2.bucketName,
});

interface CreateSupplierResponse {
  success: boolean;
  error?: string;
  data?: Supplier;
}

export const supplierController = {
  async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { files, body } = req;
      const formData = JSON.parse(body.data);

      // Handle file uploads
      const fileUrls: { [key: string]: string } = {};
      
      if (files) {
        for (const [fieldName, file] of Object.entries(files)) {
          if (file && !Array.isArray(file)) {
            const fileKey = r2Service.generateFileKey('suppliers', file.originalname);
            await r2Service.uploadFile(file.buffer, fileKey, file.mimetype);
            fileUrls[fieldName] = fileKey;
          }
        }
      }

      // Create supplier with file URLs
      const supplier = new SupplierModel({
        ...formData,
        ...fileUrls,
      });

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
      const suppliers = await SupplierModel.find();
      res.json(suppliers);
    } catch (error) {
      next(new AppError('Failed to fetch suppliers', 500));
    }
  },

  async getSupplierById(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await SupplierModel.findById(req.params.id);
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
      const supplier = await SupplierModel.findByIdAndUpdate(
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
      const supplier = await SupplierModel.findByIdAndDelete(req.params.id);
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

export const createSupplierHono = async (c: Context) => {
  try {
    await uploadMiddleware(c);

    const formData = await c.req.formData();
    const files = {
      idCardFile: formData.get('idCardFile') as File | null,
      bankFile: formData.get('bankFile') as File | null,
    };

    // Upload files to R2 if they exist
    const uploadedFiles: { [key: string]: string } = {};
    
    if (files.idCardFile) {
      const buffer = await files.idCardFile.arrayBuffer();
      const key = r2Service.generateFileKey('idCards', files.idCardFile.name);
      const idCardFileUrl = await r2Service.uploadFile(
        Buffer.from(buffer),
        key,
        files.idCardFile.type
      );
      uploadedFiles.idCardFile = idCardFileUrl;
    }

    if (files.bankFile) {
      const buffer = await files.bankFile.arrayBuffer();
      const key = r2Service.generateFileKey('bankFiles', files.bankFile.name);
      const bankFileUrl = await r2Service.uploadFile(
        Buffer.from(buffer),
        key,
        files.bankFile.type
      );
      uploadedFiles.bankFile = bankFileUrl;
    }

    // Create supplier record
    const supplierData: Supplier = {
      id: crypto.randomUUID(),
      supplierType: formData.get('supplierType') as string,
      contactPerson: formData.get('contactPerson') as string,
      gender: formData.get('gender') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      hkid: formData.get('hkid') as string,
      address: formData.get('address') as string,
      bankAccount: {
        accountName: formData.get('bankAccount.accountName') as string,
        accountNumber: formData.get('bankAccount.accountNumber') as string,
        bankName: formData.get('bankAccount.bankName') as string,
      },
      ...uploadedFiles,
      uploadDate: new Date().toISOString(),
      status: 'pending',
    };

    // TODO: Save supplier to database

    return c.json({ success: true, data: supplierData });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return c.json({ success: false, error: 'Failed to create supplier' }, 500);
  }
};

export const cleanupHono = async (c: Context) => {
  try {
    const { formData } = await c.req.json();
    const files = formData.getAll('files') as File[];

    // Delete files from R2
    await Promise.all(
      files.map(async (file) => {
        const key = `${Date.now()}-${file.name}`;
        await r2Service.deleteFile(key);
      })
    );

    return c.json({ success: true });
  } catch (error) {
    logger.error('Error cleaning up files:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An error occurred' 
    }, 500);
  }
}; 