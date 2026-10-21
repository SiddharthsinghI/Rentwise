import { Router } from 'express';
import { wishlistController } from '../controllers/wishlist.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// All wishlist routes require authentication
router.use(authenticateToken);

router.get('/', wishlistController.getWishlist);
router.post('/toggle', wishlistController.toggleWishlist);

export default router;
