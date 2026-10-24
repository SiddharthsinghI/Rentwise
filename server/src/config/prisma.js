import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: env.DATABASE_URL ? { db: { url: env.DATABASE_URL } } : undefined,
    log: env.isProd ? ['error'] : ['error', 'warn']
  });

// Preserve PrismaClient across hot reloads and warm serverless lambda invocations
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL) {
  globalForPrisma.prisma = prisma;
}

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected successfully to MySQL database');
    return true;
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error.message);
    return false;
  }
};
