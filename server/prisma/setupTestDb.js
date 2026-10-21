import { prisma } from '../src/config/prisma.js';

async function setupTestDb() {
  try {
    await prisma.$executeRawUnsafe(
      'CREATE DATABASE IF NOT EXISTS rentwise_test_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
    );
    console.log('✅ MySQL Database "rentwise_test_db" is ready for integration tests.');
  } catch (err) {
    console.error('❌ Failed to prepare test database:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestDb();
