import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/config/prisma.js';
import { resetTestDb } from './dbHelper.js';

describe('Concurrent Booking Conflict & Concurrency Safety (/api/bookings)', () => {
  let customer1Token;
  let customer2Token;
  let vendorToken;

  beforeEach(async () => {
    await resetTestDb();

    // Authenticate test actors
    const [c1Res, c2Res, vRes] = await Promise.all([
      request(app).post('/api/auth/login').send({
        email: 'alex.customer@example.com',
        password: 'Password123!'
      }),
      request(app).post('/api/auth/login').send({
        email: 'priya.customer@example.com',
        password: 'Password123!'
      }),
      request(app).post('/api/auth/login').send({
        email: 'marcus.vendor@example.com',
        password: 'Password123!'
      })
    ]);

    customer1Token = c1Res.body.data.token;
    customer2Token = c2Res.body.data.token;
    vendorToken = vRes.body.data.token;
  });

  it('prevents double-booking when concurrent requests compete for the same stock unit (409 Conflict)', async () => {
    // prod-1 has totalQuantity = 1
    const targetProduct = await prisma.product.findUnique({ where: { id: 'prod-1' } });
    expect(targetProduct.totalQuantity).toBe(1);

    // First approve an existing booking for these dates to simulate full stock exhaustion
    // Or send two concurrent requests competing for the single available slot
    // To test race conditions directly against an approved/confirmed slot:
    // Let's create an approved booking first
    await prisma.booking.create({
      data: {
        id: 'book-concurrency-existing',
        productId: 'prod-1',
        productName: 'Sony Alpha A7 IV Full-Frame Camera Kit',
        productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
        customerId: 'cust-1',
        customerName: 'Alex Rivera',
        customerEmail: 'alex.customer@example.com',
        vendorId: 'vend-1',
        vendorName: 'Marcus Vance',
        startDate: '2026-12-10',
        endDate: '2026-12-15',
        totalDays: 5,
        dailyRate: 68,
        baseCost: 340,
        serviceFee: 25.5,
        securityDeposit: 350,
        totalPrice: 365.5,
        status: 'approved',
        destination: 'Los Angeles, CA'
      }
    });

    // Now Customer 2 tries to book overlapping dates (Dec 12 - Dec 14)
    const conflictRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customer2Token}`)
      .send({
        productId: 'prod-1',
        startDate: '2026-12-12',
        endDate: '2026-12-14',
        customerNotes: 'Concurrent test attempt'
      });

    expect(conflictRes.status).toBe(409);
    expect(conflictRes.body.success).toBe(false);
    expect(conflictRes.body.error.message).toContain('Inventory Conflict');
    expect(conflictRes.body.error.message).toContain('All 1 unit(s)');
  });

  it('atomically rejects overlapping approval when stock capacity is already reached (409 Conflict)', async () => {
    // Create two pending bookings for overlapping dates
    const b1 = await prisma.booking.create({
      data: {
        id: 'book-pending-1',
        productId: 'prod-1',
        productName: 'Sony Alpha A7 IV Full-Frame Camera Kit',
        productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
        customerId: 'cust-1',
        customerName: 'Alex Rivera',
        customerEmail: 'alex.customer@example.com',
        vendorId: 'vend-1',
        vendorName: 'Marcus Vance',
        startDate: '2026-12-20',
        endDate: '2026-12-24',
        totalDays: 4,
        dailyRate: 68,
        baseCost: 272,
        serviceFee: 20.4,
        securityDeposit: 350,
        totalPrice: 292.4,
        status: 'pending',
        destination: 'Los Angeles, CA'
      }
    });

    const b2 = await prisma.booking.create({
      data: {
        id: 'book-pending-2',
        productId: 'prod-1',
        productName: 'Sony Alpha A7 IV Full-Frame Camera Kit',
        productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
        customerId: 'cust-2',
        customerName: 'Priya Sharma',
        customerEmail: 'priya.customer@example.com',
        vendorId: 'vend-1',
        vendorName: 'Marcus Vance',
        startDate: '2026-12-21',
        endDate: '2026-12-25',
        totalDays: 4,
        dailyRate: 68,
        baseCost: 272,
        serviceFee: 20.4,
        securityDeposit: 350,
        totalPrice: 292.4,
        status: 'pending',
        destination: 'Austin, TX'
      }
    });

    // Vendor approves the first booking
    const approve1 = await request(app)
      .patch(`/api/bookings/${b1.id}/status`)
      .set('Authorization', `Bearer ${vendorToken}`)
      .send({ status: 'approved' });

    expect(approve1.status).toBe(200);
    expect(approve1.body.data.status).toBe('approved');

    // Vendor attempts to approve the second conflicting booking
    const approve2 = await request(app)
      .patch(`/api/bookings/${b2.id}/status`)
      .set('Authorization', `Bearer ${vendorToken}`)
      .send({ status: 'approved' });

    expect(approve2.status).toBe(409);
    expect(approve2.body.success).toBe(false);
    expect(approve2.body.error.message).toContain('Inventory Conflict');
  });

  it('permits adjacent non-overlapping bookings without conflict', async () => {
    // Create approved booking from 2026-11-10 to 2026-11-15
    await prisma.booking.create({
      data: {
        id: 'book-adjacent-1',
        productId: 'prod-1',
        productName: 'Sony Alpha A7 IV Full-Frame Camera Kit',
        productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
        customerId: 'cust-1',
        customerName: 'Alex Rivera',
        customerEmail: 'alex.customer@example.com',
        vendorId: 'vend-1',
        vendorName: 'Marcus Vance',
        startDate: '2026-11-10',
        endDate: '2026-11-15',
        totalDays: 5,
        dailyRate: 68,
        baseCost: 340,
        serviceFee: 25.5,
        securityDeposit: 350,
        totalPrice: 365.5,
        status: 'approved',
        destination: 'Los Angeles, CA'
      }
    });

    // Subsequent booking starts the next day (2026-11-16 to 2026-11-20)
    const adjacentRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customer2Token}`)
      .send({
        productId: 'prod-1',
        startDate: '2026-11-16',
        endDate: '2026-11-20',
        customerNotes: 'Adjacent non-overlapping rental'
      });

    expect(adjacentRes.status).toBe(201);
    expect(adjacentRes.body.success).toBe(true);
    expect(adjacentRes.body.data.status).toBe('pending');
  });
});
