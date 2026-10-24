import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In local development, load .env without clobbering system/platform environment variables
if (process.env.NODE_ENV !== 'production' || !process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

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

/**
 * Returns a sanitized list of allowed client origins for CORS.
 * Supports comma-separated origins, strips trailing slashes, and retains local dev origins.
 */
export const getAllowedOrigins = () => {
  const configured = (env.CLIENT_URL || '')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  const localDefaults = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  return Array.from(new Set([...configured, ...localDefaults]));
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
    console.error('Please configure them in your environment settings before starting the server.');
    if (!env.isTest && !process.env.VERCEL) {
      process.exit(1);
    }
  }
};
