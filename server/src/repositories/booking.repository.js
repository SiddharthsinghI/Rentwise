import { prisma } from '../config/prisma.js';
import { doDatesOverlap } from '../utils/rentalCalculation.js';

const mapBooking = (b) => {
  if (!b) return null;

  let resolvedImage = b.productImage;
  if (!resolvedImage && b.product?.images) {
    let imgs = b.product.images;
    if (typeof imgs === 'string') {
      try { imgs = JSON.parse(imgs); } catch (e) { imgs = []; }
    }
    if (Array.isArray(imgs) && imgs.length > 0) {
      resolvedImage = imgs[0];
    }
  }

  const { product, ...bookingFields } = b;

  return {
    ...bookingFields,
    productImage: resolvedImage || b.productImage || null,
    totalDays: Number(b.totalDays),
    dailyRate: Number(b.dailyRate),
    baseCost: Number(b.baseCost),
    serviceFee: Number(b.serviceFee),
    securityDeposit: Number(b.securityDeposit),
    totalPrice: Number(b.totalPrice),
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString()
  };
};

export const bookingRepository = {
  async findAll(params = {}) {
    const where = {};
    if (params.customerId) where.customerId = String(params.customerId);
    if (params.vendorId) where.vendorId = String(params.vendorId);
    if (params.productId) where.productId = String(params.productId);
    if (params.status) where.status = params.status;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        product: {
          select: { images: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return bookings.map(mapBooking);
  },

  async findById(id) {
    if (!id) return null;
    const booking = await prisma.booking.findUnique({
      where: { id: String(id) },
      include: {
        product: {
          select: { images: true }
        }
      }
    });
    return mapBooking(booking);
  },

  async findByCustomer(customerId) {
    return this.findAll({ customerId });
  },

  async findByVendor(vendorId) {
    return this.findAll({ vendorId });
  },

  async findOverlapping(productId, startDate, endDate, excludeBookingId = null, tx = null) {
    const client = tx || prisma;
    const where = {
      productId: String(productId),
      status: { in: ['approved', 'active'] }
    };

    if (excludeBookingId) {
      where.id = { not: String(excludeBookingId) };
    }

    const bookings = await client.booking.findMany({ where });

    return bookings
      .filter((b) => doDatesOverlap(startDate, endDate, b.startDate, b.endDate))
      .map(mapBooking);
  },

  async create(data, tx = null) {
    const client = tx || prisma;
    const id = data.id || `book-${Date.now().toString().slice(-6)}`;

    let imageToSave = data.productImage || null;
    if (!imageToSave && data.productId) {
      try {
        const prod = await client.product.findUnique({
          where: { id: String(data.productId) },
          select: { images: true }
        });
        if (prod?.images) {
          let imgs = prod.images;
          if (typeof imgs === 'string') {
            try { imgs = JSON.parse(imgs); } catch (e) { imgs = []; }
          }
          if (Array.isArray(imgs) && imgs.length > 0) {
            imageToSave = imgs[0];
          }
        }
      } catch (err) {
        // Fallback silently
      }
    }

    const newBooking = await client.booking.create({
      data: {
        id,
        productId: String(data.productId),
        productName: data.productName,
        productImage: imageToSave,
        customerId: String(data.customerId),
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        vendorId: String(data.vendorId),
        vendorName: data.vendorName || 'Equipment Vendor',
        startDate: data.startDate,
        endDate: data.endDate,
        totalDays: Number(data.totalDays),
        dailyRate: Number(data.dailyRate),
        baseCost: Number(data.baseCost),
        serviceFee: Number(data.serviceFee),
        securityDeposit: Number(data.securityDeposit),
        totalPrice: Number(data.totalPrice),
        status: data.status || 'pending',
        customerNotes: data.customerNotes || null,
        destination: data.destination || 'Customer Address'
      }
    });

    return mapBooking(newBooking);
  },

  async update(id, updates, tx = null) {
    const client = tx || prisma;
    const safeData = {};

    if (updates.status !== undefined) safeData.status = updates.status;
    if (updates.rejectionReason !== undefined) safeData.rejectionReason = updates.rejectionReason;
    if (updates.vendorFeedback !== undefined) safeData.vendorFeedback = updates.vendorFeedback;
    if (updates.destination !== undefined) safeData.destination = updates.destination;
    if (updates.customerNotes !== undefined) safeData.customerNotes = updates.customerNotes;

    try {
      const updated = await client.booking.update({
        where: { id: String(id) },
        data: safeData
      });
      return mapBooking(updated);
    } catch (err) {
      if (err.code === 'P2025') return null;
      throw err;
    }
  },

  async delete(id, tx = null) {
    const client = tx || prisma;
    try {
      await client.booking.delete({
        where: { id: String(id) }
      });
      return true;
    } catch (err) {
      if (err.code === 'P2025') return false;
      throw err;
    }
  }
};
