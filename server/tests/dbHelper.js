import { prisma } from '../src/config/prisma.js';
import { SEED_USERS, SEED_PRODUCTS, SEED_BOOKINGS } from '../src/repositories/seedData.js';

export const resetTestDb = async () => {
  // Safety Guard: Ensure destructive test reset is restricted to a dedicated test database
  const activeUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || '';
  const isDedicatedTestDb = activeUrl.toLowerCase().includes('_test') || 
                           activeUrl.toLowerCase().includes('test_') ||
                           activeUrl.toLowerCase().includes('rentwise_test');
  const allowDevReset = process.env.ALLOW_DEV_DB_RESET === 'true';

  if (!isDedicatedTestDb && !allowDevReset) {
    throw new Error(
      `[Safety Guard] Destructive test reset blocked! Tests are currently targeted at a non-test database: "${activeUrl.split('@')[1] || 'rentwise_db'}". ` +
      `To protect your development data, configure a dedicated test database (e.g. TEST_DATABASE_URL="mysql://username:password@localhost:3306/rentwise_test_db") ` +
      `or explicitly set ALLOW_DEV_DB_RESET=true.`
    );
  }

  // Clean tables in reverse dependency order
  await prisma.wishlistItem.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed users
  for (const u of SEED_USERS) {
    await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        role: u.role,
        avatar: u.avatar,
        phone: u.phone,
        location: u.location,
        bio: u.bio,
        businessName: u.businessName || null,
        memberSince: u.memberSince,
        rating: u.rating,
        reviewsCount: u.reviewsCount,
        verified: u.verified,
        responseTime: u.responseTime || null
      }
    });
  }

  // Seed products
  for (const p of SEED_PRODUCTS) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        category: p.category,
        vendorId: p.vendorId,
        pricePerDay: p.pricePerDay,
        securityDeposit: p.securityDeposit || 0,
        totalQuantity: p.totalQuantity || 1,
        availability: p.availability || 'available',
        condition: p.condition || 'Like New',
        rating: p.rating || 5.0,
        reviewsCount: p.reviewsCount || 0,
        featured: Boolean(p.featured),
        popular: Boolean(p.popular),
        images: p.images || [],
        description: p.description,
        features: p.features || [],
        specs: p.specs || {},
        location: p.location || 'United States',
        inclusions: p.inclusions || []
      }
    });
  }

  // Seed bookings
  for (const b of SEED_BOOKINGS) {
    await prisma.booking.create({
      data: {
        id: b.id,
        productId: b.productId,
        productName: b.productName,
        productImage: b.productImage || null,
        customerId: b.customerId,
        customerName: b.customerName,
        customerEmail: b.customerEmail,
        vendorId: b.vendorId,
        vendorName: b.vendorName,
        startDate: b.startDate,
        endDate: b.endDate,
        totalDays: b.totalDays,
        dailyRate: b.dailyRate,
        baseCost: b.baseCost,
        serviceFee: b.serviceFee,
        securityDeposit: b.securityDeposit,
        totalPrice: b.totalPrice,
        status: b.status,
        customerNotes: b.customerNotes || null,
        destination: b.destination || null
      }
    });
  }
};
