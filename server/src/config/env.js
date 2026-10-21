import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

export const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'rentwise-dev-super-secret-key-change-in-production-2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  DATABASE_URL: process.env.DATABASE_URL || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  isTest: process.env.NODE_ENV === 'test',
  isProd: process.env.NODE_ENV === 'production'
};

export const validateEnvironment = () => {
  const missing = [];
  if (!env.DATABASE_URL && !env.isTest) {
    missing.push('DATABASE_URL');
  }
  if (!process.env.JWT_SECRET && env.isProd) {
    missing.push('JWT_SECRET');
  }

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('Please configure them in server/.env before starting the server.');
    if (!env.isTest) {
      process.exit(1);
    }
  }
};
