import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import productRoutes from './product.routes.js';
import bookingRoutes from './booking.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import wishlistRoutes from './wishlist.routes.js';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/health', async (req, res) => {
  let dbStatus = 'connected';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = 'disconnected';
  }

  res.status(200).json({
    status: 'healthy',
    platform: 'RentWise Backend API',
    phase: 'Phase 3 (Express, JWT, Prisma ORM, MySQL)',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/bookings', bookingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/wishlist', wishlistRoutes);

export default router;
