import { bookingService } from '../services/booking.service.js';
import { successResponse } from '../utils/response.js';

export const bookingController = {
  async getAll(req, res, next) {
    try {
      const bookings = await bookingService.getBookingsForUser(req.user, req.query);
      return successResponse(res, bookings, 200);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const booking = await bookingService.getBookingById(req.params.id, req.user);
      return successResponse(res, booking, 200);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const created = await bookingService.createBooking(req.user, req.body);
      return successResponse(res, created, 201, 'Booking request submitted successfully');
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status, reasonOrFeedback } = req.body;
      const updated = await bookingService.updateBookingStatus(
        req.params.id,
        req.user,
        status,
        reasonOrFeedback
      );
      return successResponse(res, updated, 200, `Booking status updated to ${status}`);
    } catch (err) {
      next(err);
    }
  }
};
