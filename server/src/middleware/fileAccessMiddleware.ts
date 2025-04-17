import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';
import { StorageService } from '../services/storageService';

// Extend Express Request type to include user
declare module 'express' {
  interface Request {
    user?: {
      id: string;
    };
  }
}

export const fileAccessMiddleware = (storageService: StorageService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileKey = req.params.fileKey;
      const userId = req.user?.id;

      if (!fileKey) {
        return next(new AppError('File key is required', 400));
      }

      // Check if user has permission to access this file
      const hasAccess = await checkFileAccess(fileKey, userId);
      if (!hasAccess) {
        return next(new AppError('Access denied', 403));
      }

      // Generate a new signed URL for the file
      const signedUrl = await storageService.generateSignedUrl(fileKey);
      
      // Redirect to the signed URL
      res.redirect(signedUrl);
    } catch (error) {
      logger.error('Error in file access middleware:', error);
      next(new AppError('Failed to process file access request', 500));
    }
  };
};

async function checkFileAccess(fileKey: string, userId?: string): Promise<boolean> {
  // Implement your access control logic here
  // For example:
  // 1. Check if the file belongs to the user
  // 2. Check if the user has the required role
  // 3. Check if the file type is allowed for the user
  return true; // Placeholder - implement actual access control logic
} 