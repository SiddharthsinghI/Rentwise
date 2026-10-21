import app from './app.js';
import { env, validateEnvironment } from './config/env.js';
import { prisma, connectDatabase } from './config/prisma.js';

// Validate required environment settings
validateEnvironment();

const PORT = env.PORT;

const startServer = async () => {
  // Test database connectivity
  await connectDatabase();

  const server = app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 RentWise Backend API running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
    console.log(`🔒 Environment: ${env.NODE_ENV}`);
    console.log(`📡 Allowed Client Origin: ${env.CLIENT_URL}`);
    console.log(`🗄️ Database: MySQL (rentwise_db)`);
    console.log(`===============================================`);
  });

  // Graceful termination handling
  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Closing HTTP server and Prisma connections...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log('HTTP server and database connections closed gracefully.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
