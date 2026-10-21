import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/customer', requireRole('customer'), dashboardController.getCustomerDashboard);
router.get('/vendor', requireRole('vendor'), dashboardController.getVendorDashboard);

export default router;
