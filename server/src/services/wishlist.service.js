import { wishlistRepository } from '../repositories/wishlist.repository.js';

export const wishlistService = {
  async getWishlist(userId) {
    return wishlistRepository.findByUser(userId);
  },

  async toggleWishlist(userId, productId) {
    if (!productId) {
      const err = new Error('Product ID is required to toggle wishlist.');
      err.statusCode = 400;
      throw err;
    }
    return wishlistRepository.toggle(userId, productId);
  }
};
