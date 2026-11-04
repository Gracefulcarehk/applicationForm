import dotenv from 'dotenv';

dotenv.config();

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return value;
};

export const loadConfig = () => ({
  port: Number(process.env.PORT) || 5003,
  // Number of reverse proxies in front of the app (e.g. the host's load balancer), used for client IPs
  trustProxy: Number(process.env.TRUST_PROXY ?? 1),
  mongodbUri: required('MONGODB_URI'),
  corsOrigins: required('CORS_ORIGINS')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  r2: {
    accountId: required('R2_ACCOUNT_ID'),
    accessKeyId: required('R2_ACCESS_KEY_ID'),
    secretAccessKey: required('R2_SECRET_ACCESS_KEY'),
    bucket: required('R2_BUCKET'),
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    user: required('SMTP_USER'),
    pass: required('SMTP_PASS'),
  },
  notifyTo: required('NOTIFY_TO'),
});

export type Config = ReturnType<typeof loadConfig>;
