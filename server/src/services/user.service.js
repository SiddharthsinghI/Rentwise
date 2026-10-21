import { userRepository } from '../repositories/user.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import { bookingRepository } from '../repositories/booking.repository.js';

export const userService = {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }

    const { passwordHash: _, ...safeUser } = user;

    if (user.role === 'vendor') {
      const listings = await productRepository.findByVendor(userId);
      const bookings = await bookingRepository.findByVendor(userId);
      return {
        ...safeUser,
        stats: {
          totalListings: listings.length,
          totalBookingsHandled: bookings.length
        }
      };
    } else {
      const bookings = await bookingRepository.findByCustomer(userId);
      return {
        ...safeUser,
        stats: {
          totalBookings: bookings.length,
          activeRentals: bookings.filter((b) => b.status === 'active').length
        }
      };
    }
  },

  async updateProfile(userId, updates) {
    // Only allow safe profile fields to be updated
    const safeUpdates = {};
    if (updates.name !== undefined) safeUpdates.name = updates.name.trim();
    if (updates.phone !== undefined) safeUpdates.phone = updates.phone.trim();
    if (updates.location !== undefined) safeUpdates.location = updates.location.trim();
    if (updates.bio !== undefined) safeUpdates.bio = updates.bio.trim();
    if (updates.businessName !== undefined) safeUpdates.businessName = updates.businessName.trim();
    if (updates.avatar !== undefined) safeUpdates.avatar = updates.avatar.trim();

    const updated = await userRepository.update(userId, safeUpdates);
    if (!updated) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }

    const { passwordHash: _, ...safeUser } = updated;
    return safeUser;
  }
};
