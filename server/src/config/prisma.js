import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

export const prisma = new PrismaClient({
  log: env.isProd ? ['error'] : ['error', 'warn']
});

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
