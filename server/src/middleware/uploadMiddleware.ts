import { Context, Next } from 'hono';
import { config } from '../config/config';

export const uploadMiddleware = async (c: Context, next?: Next) => {
  const contentType = c.req.header('content-type');
  if (!contentType?.includes('multipart/form-data')) {
    return c.json({ success: false, error: 'Invalid content type' }, 400);
  }

  const formData = await c.req.formData();
  const files = ['idCardFile', 'bankFile'];

  for (const fileKey of files) {
    const file = formData.get(fileKey) as File | null;
    if (file) {
      // Check file size
      if (file.size > config.api.maxFileSize) {
        return c.json({
          success: false,
          error: `${fileKey} exceeds maximum file size of ${config.api.maxFileSize / (1024 * 1024)}MB`,
        }, 400);
      }

      // Check file type
      if (!config.api.allowedFileTypes.includes(file.type)) {
        return c.json({
          success: false,
          error: `${fileKey} has invalid file type. Allowed types: ${config.api.allowedFileTypes.join(', ')}`,
        }, 400);
      }
    }
  }

  if (next) {
    await next();
  }
}; 