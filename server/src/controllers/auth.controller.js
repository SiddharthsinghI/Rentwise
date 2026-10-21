import { authService } from '../services/auth.service.js';
import { successResponse } from '../utils/response.js';

export const authController = {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return successResponse(res, result, 201, 'Registration successful');
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return successResponse(res, result, 200, 'Login successful');
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      return successResponse(res, user, 200);
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      const result = await authService.logout();
      return successResponse(res, result, 200);
    } catch (err) {
      next(err);
    }
  }
};
