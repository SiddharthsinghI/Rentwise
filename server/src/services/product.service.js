import { productRepository } from '../repositories/product.repository.js';
import { userRepository } from '../repositories/user.repository.js';

export const productService = {
  async getAllProducts(filters = {}) {
    return productRepository.findAll(filters);
  },

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      const err = new Error(`Equipment with ID "${id}" was not found.`);
      err.statusCode = 404;
      throw err;
    }

    // Attach vendor details
    const vendor = await userRepository.findById(product.vendorId);
    return {
      ...product,
      vendor: vendor
        ? {
            id: vendor.id,
            name: vendor.name,
            businessName: vendor.businessName,
            avatar: vendor.avatar,
            rating: vendor.rating,
            reviewsCount: vendor.reviewsCount,
            location: vendor.location,
            responseTime: vendor.responseTime
          }
        : null
    };
  },

  async createProduct(vendorId, data) {
    const vendor = await userRepository.findById(vendorId);
    if (!vendor || vendor.role !== 'vendor') {
      const err = new Error('Only registered equipment vendors can create listings.');
      err.statusCode = 403;
      throw err;
    }

    return productRepository.create({
      ...data,
      vendorId
    });
  },

  async updateProduct(id, vendorId, updates) {
    const product = await productRepository.findById(id);
    if (!product) {
      const err = new Error(`Equipment with ID "${id}" was not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (String(product.vendorId) !== String(vendorId)) {
      const err = new Error('Forbidden: You can only edit your own equipment listings.');
      err.statusCode = 403;
      throw err;
    }

    return productRepository.update(id, updates);
  },

  async deleteProduct(id, vendorId) {
    const product = await productRepository.findById(id);
    if (!product) {
      const err = new Error(`Equipment with ID "${id}" was not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (String(product.vendorId) !== String(vendorId)) {
      const err = new Error('Forbidden: You can only delete your own equipment listings.');
      err.statusCode = 403;
      throw err;
    }

    await productRepository.delete(id);
    return { id, name: product.name };
  }
};
