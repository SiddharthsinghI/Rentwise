import { productRepository } from '../repositories/product.repository.js';
import { bookingRepository } from '../repositories/booking.repository.js';

export const dashboardService = {
  async getCustomerDashboard(customerId) {
    const bookings = await bookingRepository.findByCustomer(customerId);

    const totalBookings = bookings.length;
    const activeRentals = bookings.filter((b) => b.status === 'active').length;
    const pendingRequests = bookings.filter((b) => b.status === 'pending').length;
    const completedRentals = bookings.filter((b) => b.status === 'completed').length;

    // Total spent across approved, active, and completed rentals
    const totalSpent = bookings
      .filter((b) => ['approved', 'active', 'completed'].includes(b.status))
      .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

    const recentBookings = bookings.slice(0, 5);

    return {
      metrics: {
        totalBookings,
        activeRentals,
        pendingRequests,
        completedRentals,
        totalSpent: Math.round(totalSpent * 100) / 100
      },
      recentBookings
    };
  },

  async getVendorDashboard(vendorId) {
    const [listings, bookings] = await Promise.all([
      productRepository.findByVendor(vendorId),
      bookingRepository.findByVendor(vendorId)
    ]);

    const totalListings = listings.length;
    const activeRentals = bookings.filter((b) => b.status === 'active').length;
    const pendingRequests = bookings.filter((b) => b.status === 'pending').length;
    const completedCount = bookings.filter((b) => b.status === 'completed').length;

    // Realized earnings from completed and active rentals (base rental rate paid to vendor)
    const totalEarnings = bookings
      .filter((b) => ['completed', 'active'].includes(b.status))
      .reduce((sum, b) => sum + (Number(b.baseCost) || 0), 0);

    // Projected revenue from approved but not yet active/completed
    const projectedRevenue = bookings
      .filter((b) => ['approved'].includes(b.status))
      .reduce((sum, b) => sum + (Number(b.baseCost) || 0), 0);

    // Calculate monthly revenue chart data
    const monthlyMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      monthlyMap[key] = 0;
    }

    bookings
      .filter((b) => ['active', 'completed'].includes(b.status))
      .forEach((b) => {
        const d = new Date(b.createdAt);
        const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
        if (monthlyMap[key] !== undefined) {
          monthlyMap[key] += Number(b.baseCost) || 0;
        }
      });

    const monthlyRevenue = Object.entries(monthlyMap).map(([month, revenue]) => ({
      month,
      revenue: Math.round(revenue * 100) / 100
    }));

    return {
      metrics: {
        totalListings,
        activeRentals,
        pendingRequests,
        completedRentals: completedCount,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        projectedRevenue: Math.round(projectedRevenue * 100) / 100
      },
      monthlyRevenue,
      recentRequests: bookings.slice(0, 5)
    };
  }
};
