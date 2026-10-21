import { wishlistService } from '../services/wishlist.service.js';
import { successResponse } from '../utils/response.js';

export const wishlistController = {
  async getWishlist(req, res, next) {
    try {
      const items = await wishlistService.getWishlist(req.user.id);
      return successResponse(res, items, 200);
    } catch (err) {
      next(err);
    }
  },

  async toggleWishlist(req, res, next) {
    try {
      const { productId } = req.body;
      const result = await wishlistService.toggleWishlist(req.user.id, productId);
      return successResponse(
        res,
        result,
        200,
        result.isWishlisted ? 'Product added to wishlist' : 'Product removed from wishlist'
      );
    } catch (err) {
      next(err);
    }
  }
};
