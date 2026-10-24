import { PrismaClient } from '@prisma/client';
import { SEED_USERS, SEED_PRODUCTS, SEED_BOOKINGS } from '../src/repositories/seedData.js';

const prisma = new PrismaClient();

export const seedDatabase = async () => {
  console.log('🌱 Starting database seeding for RentWise (rentwise_db)...');

  // 1. Seed Demo Users
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {}, // Non-destructive: preserves existing vendor/user credentials and profile data
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        businessName: user.businessName || null,
        memberSince: user.memberSince,
        rating: user.rating,
        reviewsCount: user.reviewsCount,
        verified: user.verified,
        responseTime: user.responseTime || null
      }
    });
  }
  console.log(`✅ Seeded ${SEED_USERS.length} demo users`);

  // 2. Seed Demo Equipment Listings
  for (const p of SEED_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {}, // Non-destructive: preserves existing listings in production; only inserts missing items
      create: {
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
  console.log(`✅ Seeded ${SEED_PRODUCTS.length} equipment listings`);

  // 3. Seed Demo Bookings
  for (const b of SEED_BOOKINGS) {
    await prisma.booking.upsert({
      where: { id: b.id },
      update: {}, // Non-destructive: preserves existing bookings and lifecycle states
      create: {
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
  console.log(`✅ Seeded ${SEED_BOOKINGS.length} demo bookings`);

  // 4. Seed Wishlist Items
  await prisma.wishlistItem.upsert({
    where: {
      userId_productId: {
        userId: 'cust-1',
        productId: 'prod-2'
      }
    },
    update: {},
    create: {
      userId: 'cust-1',
      productId: 'prod-2'
    }
  });
  console.log('✅ Seeded demo wishlist items');

  console.log('🎉 RentWise Database Seeding completed successfully!');
};

seedDatabase()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
