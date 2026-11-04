import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { createSupplierController, SupplierControllerDeps } from '../controllers/supplierController';
import { AppError } from '../middleware/errorHandler';
import {
  isAllowedFileType,
  MAX_CERTIFICATIONS,
  MAX_FILE_SIZE,
  validateSupplier,
} from '../middleware/validateSupplier';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_CERTIFICATIONS + 2,
    fields: 100,
    fieldSize: 10 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (isAllowedFileType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('只接受圖片和PDF文件 Only image and PDF files are allowed', 400));
    }
  },
});

const parseUpload = (req: Request, res: Response, next: NextFunction) => {
  upload.any()(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === 'LIMIT_FILE_SIZE'
          ? '文件大小不能超過5MB File size should be less than 5MB'
          : '上傳的文件無效 Invalid file upload';
      return next(new AppError(message, 400));
    }
    return next(error);
  });
};

const createSubmitLimiter = () =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
      status: 'fail',
      message: '提交次數過多，請稍後再試 Too many submissions, please try again later',
    },
  });

// Only submission is exposed publicly. Staff review applications in MongoDB Atlas and Cloudflare R2.
export const createSupplierRoutes = (deps: SupplierControllerDeps) => {
  const router = Router();
  const controller = createSupplierController(deps);

  router.post('/', createSubmitLimiter(), parseUpload, validateSupplier, controller.createSupplier);

  return router;
};
