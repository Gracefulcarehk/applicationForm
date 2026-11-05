import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { Supplier, SupplierData } from '../models/supplierModel';
import { AppError } from '../middleware/errorHandler';
import { ParsedApplication, UploadedFile } from '../middleware/validateSupplier';
import { FileStorage } from '../services/storage';
import { Mailer, StoredFile } from '../services/mailer';
import { logger } from '../utils/logger';

export interface SupplierControllerDeps {
  storage: FileStorage;
  mailer: Mailer;
}

const MIME_EXTENSIONS: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/heic': 'heic',
  'image/webp': 'webp',
};

const fileKey = (id: string, label: string, file: UploadedFile) =>
  `applications/${id}/${label}.${MIME_EXTENSIONS[file.mimetype] ?? 'bin'}`;

const isDuplicateKeyError = (error: unknown) =>
  typeof error === 'object' && error !== null && (error as { code?: number }).code === 11000;

export const createSupplierController = ({ storage, mailer }: SupplierControllerDeps) => ({
  async createSupplier(_req: Request, res: Response, next: NextFunction) {
    const { fields, files } = res.locals.application as ParsedApplication;
    const id = new Types.ObjectId();
    const idString = id.toHexString();

    const stored: StoredFile[] = [
      { label: 'id-card', file: files.idCard },
      { label: 'bank', file: files.bank },
      ...files.certifications.map((file, i) => ({ label: `certification-${i + 1}`, file })),
    ].map((f) => ({ ...f, key: fileKey(idString, f.label, f.file) }));

    const uploaded: string[] = [];
    const cleanUp = async () => {
      try {
        await storage.remove(uploaded);
      } catch (error) {
        logger.error(`Failed to clean up files for application ${idString}`, { error });
      }
    };

    let data: SupplierData;
    try {
      for (const { key, file } of stored) {
        await storage.upload(key, file.buffer, file.mimetype);
        uploaded.push(key);
      }

      data = {
        ...fields,
        idCardFileKey: stored[0].key,
        bankAccount: { ...fields.bankAccount, fileKey: stored[1].key },
        professionalCertifications: fields.professionalCertifications.map((cert, i) => ({
          ...cert,
          fileKey: stored[i + 2].key,
        })),
      };
      await new Supplier({ _id: id, ...data }).save();
    } catch (error) {
      await cleanUp();
      if (isDuplicateKeyError(error)) {
        return next(
          new AppError(
            '此身份證號碼或電郵已提交過申請 An application with this HKID or email already exists',
            409,
          ),
        );
      }
      logger.error(`Failed to create application ${idString}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return next(new AppError('提交申請時發生錯誤 Error submitting application', 500));
    }

    logger.info(`Application ${idString} created`);

    try {
      await mailer.sendApplicationNotification({ id: idString, data, files: stored });
    } catch (error) {
      // The application is saved; staff can still find it in MongoDB.
      logger.error(`Failed to send notification for application ${idString}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return res.status(201).json({ id: idString });
  },
});
