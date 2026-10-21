import { prisma } from '../config/prisma.js';

async function check() {
  try {
    await prisma.$connect();
    console.log('PRISMA_CONNECT_SUCCESS');
    const [users, products, bookings] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.booking.count()
    ]);
    console.log(`DATABASE_COUNTS: Users=${users}, Products=${products}, Bookings=${bookings}`);
    process.exit(0);
  } catch (err) {
    console.error('PRISMA_CONNECT_ERROR:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

check();
