import { dashboardService } from '../services/dashboard.service.js';
import { successResponse } from '../utils/response.js';

export const dashboardController = {
  async getCustomerDashboard(req, res, next) {
    try {
      const data = await dashboardService.getCustomerDashboard(req.user.id);
      return successResponse(res, data, 200);
    } catch (err) {
      next(err);
    }
  },

  async getVendorDashboard(req, res, next) {
    try {
      const data = await dashboardService.getVendorDashboard(req.user.id);
      return successResponse(res, data, 200);
    } catch (err) {
      next(err);
    }
  }
};
