import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema
} from '../validators/product.validators.js';

const router = Router();

// Public equipment discovery routes
router.get('/', validate(productQuerySchema, 'query'), productController.getAll);
router.get('/:id', productController.getById);

// Protected vendor routes
router.post(
  '/',
  authenticateToken,
  requireRole('vendor'),
  validate(createProductSchema),
  productController.create
);

router.patch(
  '/:id',
  authenticateToken,
  requireRole('vendor'),
  validate(updateProductSchema),
  productController.update
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole('vendor'),
  productController.delete
);

export default router;
