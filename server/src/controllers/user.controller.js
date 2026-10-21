import { userService } from '../services/user.service.js';
import { successResponse } from '../utils/response.js';

export const userController = {
  async getProfile(req, res, next) {
    try {
      const profile = await userService.getProfile(req.user.id);
      return successResponse(res, profile, 200);
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const updated = await userService.updateProfile(req.user.id, req.body);
      return successResponse(res, updated, 200, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  }
};
