import { DeleteObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Config } from '../config';

export interface FileStorage {
  upload(key: string, body: Buffer, contentType: string): Promise<void>;
  remove(keys: string[]): Promise<void>;
}

// Cloudflare R2 through its S3-compatible API. The bucket must stay private (no public access).
export const createR2Storage = (r2: Config['r2']): FileStorage => {
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${r2.accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: r2.accessKeyId, secretAccessKey: r2.secretAccessKey },
  });

  return {
    async upload(key, body, contentType) {
      await client.send(
        new PutObjectCommand({ Bucket: r2.bucket, Key: key, Body: body, ContentType: contentType }),
      );
    },
    async remove(keys) {
      if (!keys.length) return;
      await client.send(
        new DeleteObjectsCommand({
          Bucket: r2.bucket,
          Delete: { Objects: keys.map((Key) => ({ Key })) },
        }),
      );
    },
  };
};
