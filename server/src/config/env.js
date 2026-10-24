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

export const PRODUCTION_FRONTEND_ORIGIN = 'https://rentwise-zqd3.vercel.app';

/**
 * Returns a sanitized list of allowed client origins for CORS.
 * Checks existing allowed-origin environment variables (CLIENT_URL, CORS_ORIGIN, ALLOWED_ORIGINS, FRONTEND_URL),
 * explicitly includes the production frontend origin, and retains local development defaults.
 */
export const getAllowedOrigins = () => {
  const envSources = [
    process.env.CLIENT_URL,
    process.env.CORS_ORIGIN,
    process.env.ALLOWED_ORIGINS,
    process.env.FRONTEND_URL,
    env.CLIENT_URL
  ].filter(Boolean);

  const parsedConfigured = envSources
    .flatMap((source) => source.split(','))
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  const knownProductionOrigins = [
    PRODUCTION_FRONTEND_ORIGIN
  ];

  const localDefaults = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  return Array.from(new Set([...knownProductionOrigins, ...parsedConfigured, ...localDefaults]));
};

/**
 * Evaluates whether an incoming HTTP Origin is authorized under the CORS policy.
 * - Permits direct/no-origin calls (mobile apps, curl, server-to-server health checks)
 * - Permits verified production frontend and configured environment origins
 * - Permits project-scoped Vercel preview deployments (rentwise-*.vercel.app)
 * - Rejects untrusted/arbitrary third-party origins
 */
export const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const cleanOrigin = origin.trim().replace(/\/+$/, '');
  const allowed = getAllowedOrigins();

  if (allowed.includes(cleanOrigin)) {
    return true;
  }

  // Allow project-scoped preview deployments (e.g. rentwise-preview-abc123.vercel.app)
  const isRentwisePreview = /^https:\/\/rentwise(-[a-z0-9-]+)?\.vercel\.app$/i.test(cleanOrigin);
  if (isRentwisePreview) {
    return true;
  }

  return false;
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
