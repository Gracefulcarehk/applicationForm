import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

class R2Service {
  private client: S3Client;
  private bucketName: string;
  private retryOptions: RetryOptions;

  constructor(config: R2Config, retryOptions: Partial<RetryOptions> = {}) {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    this.bucketName = config.bucketName;
    this.retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    const { maxAttempts, initialDelay, maxDelay } = { ...this.retryOptions, ...options };
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt === maxAttempts) {
          throw lastError;
        }

        // Calculate delay with exponential backoff and jitter
        const delay = Math.min(
          initialDelay * Math.pow(2, attempt - 1) * (0.5 + Math.random()),
          maxDelay
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  async uploadFile(file: Buffer, key: string, contentType: string): Promise<string> {
    return this.retryOperation(async () => {
      try {
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file,
          ContentType: contentType,
        });

        await this.client.send(command);
        return key;
      } catch (error) {
        console.error('Error uploading file to R2:', error);
        throw new Error('Failed to upload file to R2');
      }
    });
  }

  async deleteFile(key: string): Promise<void> {
    return this.retryOperation(async () => {
      try {
        const command = new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });

        await this.client.send(command);
      } catch (error) {
        console.error('Error deleting file from R2:', error);
        throw new Error('Failed to delete file from R2');
      }
    });
  }

  async fileExists(key: string): Promise<boolean> {
    return this.retryOperation(async () => {
      try {
        const command = new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });

        await this.client.send(command);
        return true;
      } catch (error) {
        return false;
      }
    });
  }

  generateFileKey(folder: string, originalName: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop()?.toLowerCase() || '';
    return `${folder}/${timestamp}-${randomString}.${extension}`;
  }
}

export default R2Service; 