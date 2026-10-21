import { productService } from '../services/product.service.js';
import { successResponse } from '../utils/response.js';

export const productController = {
  async getAll(req, res, next) {
    try {
      const products = await productService.getAllProducts(req.query);
      return successResponse(res, products, 200);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      return successResponse(res, product, 200);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const created = await productService.createProduct(req.user.id, req.body);
      return successResponse(res, created, 201, 'Equipment listed successfully');
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await productService.updateProduct(req.params.id, req.user.id, req.body);
      return successResponse(res, updated, 200, 'Equipment updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const result = await productService.deleteProduct(req.params.id, req.user.id);
      return successResponse(res, result, 200, 'Equipment removed successfully');
    } catch (err) {
      next(err);
    }
  }
};
