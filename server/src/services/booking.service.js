import { prisma } from '../config/prisma.js';
import { bookingRepository } from '../repositories/booking.repository.js';
import { calculateDays, calculateRentalCost } from '../utils/rentalCalculation.js';

export const bookingService = {
  async getBookingsForUser(user, filters = {}) {
    if (user.role === 'customer') {
      return bookingRepository.findAll({
        ...filters,
        customerId: user.id
      });
    }

    if (user.role === 'vendor') {
      return bookingRepository.findAll({
        ...filters,
        vendorId: user.id
      });
    }

    return [];
  },

  async getBookingById(id, user) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      const err = new Error(`Booking #${id} was not found.`);
      err.statusCode = 404;
      throw err;
    }

    // Role-based authorization check: user must be the booking's customer OR the product's vendor
    const isCustomer = String(booking.customerId) === String(user.id);
    const isVendor = String(booking.vendorId) === String(user.id);

    if (!isCustomer && !isVendor) {
      const err = new Error('Forbidden: You are not authorized to view this booking.');
      err.statusCode = 403;
      throw err;
    }

    return booking;
  },

  async createBooking(customer, data) {
    return prisma.$transaction(async (tx) => {
      // Concurrency control: Acquire pessimistic row lock on the product in MySQL
      const [lockedProduct] = await tx.$queryRaw`
        SELECT id, name, vendorId, pricePerDay, securityDeposit, totalQuantity, availability, images
        FROM products
        WHERE id = ${data.productId}
        FOR UPDATE
      `;

      if (!lockedProduct) {
        const err = new Error(`Equipment with ID "${data.productId}" was not found.`);
        err.statusCode = 404;
        throw err;
      }

      if (lockedProduct.availability === 'unavailable') {
        const err = new Error('This equipment is currently marked unavailable by the vendor.');
        err.statusCode = 400;
        throw err;
      }

      const totalStock = Math.max(1, Number(lockedProduct.totalQuantity) || 1);

      // Overlap conflict detection against confirmed/active rentals
      const overlapping = await bookingRepository.findOverlapping(
        lockedProduct.id,
        data.startDate,
        data.endDate,
        null,
        tx
      );

      if (overlapping.length >= totalStock) {
        const conflict = overlapping[0];
        const err = new Error(
          `Inventory Conflict: All ${totalStock} unit(s) of "${lockedProduct.name}" are already booked between ${conflict.startDate} and ${conflict.endDate}. Please choose different dates.`
        );
        err.statusCode = 409;
        throw err;
      }

      // Fetch vendor information
      const vendor = await tx.user.findUnique({
        where: { id: lockedProduct.vendorId }
      });
      const vendorName = vendor ? (vendor.businessName || vendor.name) : 'Equipment Vendor';

      // Server-side financial calculations (NEVER trust client inputs)
      const days = calculateDays(data.startDate, data.endDate);
      const cost = calculateRentalCost(Number(lockedProduct.pricePerDay), days, Number(lockedProduct.securityDeposit));

      let parsedImages = [];
      try {
        parsedImages = typeof lockedProduct.images === 'string'
          ? JSON.parse(lockedProduct.images)
          : (lockedProduct.images || []);
      } catch (e) {
        parsedImages = [];
      }

      const bookingPayload = {
        productId: lockedProduct.id,
        productName: lockedProduct.name,
        productImage: parsedImages[0] || '',
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        vendorId: lockedProduct.vendorId,
        vendorName,
        startDate: data.startDate,
        endDate: data.endDate,
        totalDays: days,
        dailyRate: Number(lockedProduct.pricePerDay),
        baseCost: cost.baseCost,
        serviceFee: cost.serviceFee,
        securityDeposit: cost.securityDeposit,
        totalPrice: cost.totalPrice,
        status: 'pending',
        customerNotes: data.customerNotes || '',
        destination: data.destination || customer.location || 'Customer Address'
      };

      return bookingRepository.create(bookingPayload, tx);
    });
  },

  async updateBookingStatus(id, user, newStatus, reasonOrFeedback = '') {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: String(id) }
      });

      if (!booking) {
        const err = new Error(`Booking #${id} was not found.`);
        err.statusCode = 404;
        throw err;
      }

      const isCustomer = String(booking.customerId) === String(user.id);
      const isVendor = String(booking.vendorId) === String(user.id);

      if (!isCustomer && !isVendor) {
        const err = new Error('Forbidden: You are not authorized to modify this booking.');
        err.statusCode = 403;
        throw err;
      }

      // State transition authorization rules
      if (isCustomer && !isVendor) {
        if (newStatus !== 'cancelled') {
          const err = new Error('Customers can only cancel pending booking requests.');
          err.statusCode = 403;
          throw err;
        }
        if (booking.status !== 'pending') {
          const err = new Error(`Cannot cancel a booking that is already ${booking.status}.`);
          err.statusCode = 400;
          throw err;
        }
      }

      if (isVendor) {
        const allowedVendorTransitions = {
          pending: ['approved', 'rejected', 'cancelled'],
          approved: ['active', 'cancelled', 'completed'],
          active: ['completed'],
          rejected: [],
          completed: [],
          cancelled: []
        };

        const validNextStates = allowedVendorTransitions[booking.status] || [];
        if (!validNextStates.includes(newStatus)) {
          const err = new Error(
            `Invalid status transition: Cannot change booking status from "${booking.status}" to "${newStatus}".`
          );
          err.statusCode = 400;
          throw err;
        }

        // Check stock overlap if approving or activating
        if (newStatus === 'approved' || newStatus === 'active') {
          const [lockedProduct] = await tx.$queryRaw`
            SELECT id, totalQuantity, availability FROM products WHERE id = ${booking.productId} FOR UPDATE
          `;
          const totalStock = Math.max(1, Number(lockedProduct?.totalQuantity) || 1);

          const overlapping = await bookingRepository.findOverlapping(
            booking.productId,
            booking.startDate,
            booking.endDate,
            booking.id,
            tx
          );

          if (overlapping.length >= totalStock) {
            const conflict = overlapping[0];
            const err = new Error(
              `Inventory Conflict: All ${totalStock} unit(s) are already booked for overlapping dates (${conflict.startDate} to ${conflict.endDate} by ${conflict.customerName}).`
            );
            err.statusCode = 409;
            throw err;
          }
        }
      }

      const updates = {
        status: newStatus
      };

      if (newStatus === 'rejected' && reasonOrFeedback) {
        updates.rejectionReason = reasonOrFeedback;
      }
      if (newStatus === 'completed' && reasonOrFeedback) {
        updates.vendorFeedback = reasonOrFeedback;
      }

      const updatedBooking = await bookingRepository.update(id, updates, tx);

      // Sync product availability status if needed
      if (newStatus === 'completed') {
        const product = await tx.product.findUnique({ where: { id: booking.productId } });
        if (product) {
          const totalStock = Math.max(1, Number(product.totalQuantity) || 1);
          const activeBookings = await tx.booking.findMany({
            where: {
              productId: product.id,
              status: 'active'
            }
          });
          if (activeBookings.length < totalStock && product.availability === 'rented') {
            await tx.product.update({
              where: { id: product.id },
              data: { availability: 'available' }
            });
          }
        }
      }

      return updatedBooking;
    });
  }
};
