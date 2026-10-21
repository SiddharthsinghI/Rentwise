import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config();

// Direct automated tests to dedicated test database if configured
if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 20000
  }
});

