import { apiClient } from './apiClient';

export const wishlistService = {
  // Get product IDs wishlisted by authenticated user from MySQL
  async getWishlist(userId) {
    try {
      const items = await apiClient.get('/wishlist');
      return Array.isArray(items) ? items : [];
    } catch (err) {
      console.warn('Could not load wishlist from server:', err.message);
      return [];
    }
  },

  // Toggle wishlist state for product in MySQL
  async toggle(userId, productId) {
    return apiClient.post('/wishlist/toggle', { productId });
  },

  // Check if product is in user's wishlist
  async isInWishlist(userId, productId) {
    const list = await this.getWishlist(userId);
    return list.includes(productId);
  }
};
