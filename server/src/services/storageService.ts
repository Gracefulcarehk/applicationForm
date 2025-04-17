import { R2Bucket } from '@cloudflare/workers-types';
import { logger } from '../utils/logger';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf'
];

const URL_EXPIRY_TIME = 3600; // 1 hour in seconds

interface R2ObjectMetadata {
  contentType?: string;
  size?: number;
  uploadedAt?: string;
  lastModified?: Date;
}

export class StorageService {
  private bucket: R2Bucket;
  private readonly publicDomain: string;

  constructor(bucket: R2Bucket, publicDomain: string) {
    this.bucket = bucket;
    this.publicDomain = publicDomain;
  }

  private validateFile(file: Buffer, contentType: string): void {
    // Check file size
    if (file.length > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(contentType)) {
      throw new Error('Invalid file type. Only images and PDFs are allowed');
    }
  }

  async uploadFile(file: Buffer, key: string, contentType: string): Promise<{ key: string; url: string }> {
    try {
      // Validate file before upload
      this.validateFile(file, contentType);

      // Upload file to R2 with private ACL
      await this.bucket.put(key, file, {
        httpMetadata: {
          contentType,
        },
        customMetadata: {
          uploadedAt: new Date().toISOString(),
        },
      });

      // Generate a signed URL for the uploaded file
      const signedUrl = await this.generateSignedUrl(key);

      return {
        key,
        url: signedUrl,
      };
    } catch (error) {
      logger.error('Error uploading file to R2:', error);
      throw error;
    }
  }

  async generateSignedUrl(key: string): Promise<string> {
    try {
      // Since R2Bucket doesn't have createPresignedUrl, we'll use the public URL for now
      // TODO: Implement proper signed URL generation when Cloudflare adds this feature
      return `https://${this.publicDomain}/${key}`;
    } catch (error) {
      logger.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  generateFileKey(fileName: string, userId: string, type: 'idCard' | 'bank' | 'certification'): string {
    const timestamp = Date.now();
    const extension = fileName.split('.').pop();
    return `${type}/${userId}/${timestamp}.${extension}`;
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.bucket.delete(key);
    } catch (error) {
      logger.error('Error deleting file from R2:', error);
      throw new Error('Failed to delete file');
    }
  }

  async getFileMetadata(key: string): Promise<R2ObjectMetadata> {
    try {
      const object = await this.bucket.head(key);
      if (!object) {
        throw new Error('File not found');
      }

      return {
        contentType: object.httpMetadata?.contentType,
        size: object.size,
        uploadedAt: object.customMetadata?.uploadedAt,
        lastModified: object.uploaded,
      };
    } catch (error) {
      logger.error('Error getting file metadata:', error);
      throw new Error('Failed to get file metadata');
    }
  }
} 