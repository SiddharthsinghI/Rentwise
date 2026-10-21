import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createBookingSchema,
  updateBookingStatusSchema
} from '../validators/booking.validators.js';

const router = Router();

router.use(authenticateToken);

router.get('/', bookingController.getAll);
router.get('/:id', bookingController.getById);

router.post(
  '/',
  requireRole('customer'),
  validate(createBookingSchema),
  bookingController.create
);

router.patch(
  '/:id/status',
  validate(updateBookingStatusSchema),
  bookingController.updateStatus
);

export default router;
