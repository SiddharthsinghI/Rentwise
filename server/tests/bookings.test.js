import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { resetTestDb } from './dbHelper.js';

describe('Booking & Rental Management APIs (/api/bookings)', () => {
  let customer1Token;
  let customer2Token;
  let vendor1Token;
  let vendor2Token;

  beforeEach(async () => {
    await resetTestDb();

    const [c1, c2, v1, v2] = await Promise.all([
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
      }),
      request(app).post('/api/auth/login').send({
        email: 'elena.vendor@example.com',
        password: 'Password123!'
      })
    ]);

    customer1Token = c1.body.data.token;
    customer2Token = c2.body.data.token;
    vendor1Token = v1.body.data.token;
    vendor2Token = v2.body.data.token;
  });

  describe('POST /api/bookings (Booking Creation & Server Calculations)', () => {
    it('creates a booking request and strictly calculates charges on the server', async () => {
      // prod-1: dailyRate = 68, securityDeposit = 350
      // 3 days: baseCost = 204, serviceFee (7.5%) = 15.30, total = 219.30
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({
          productId: 'prod-1',
          startDate: '2026-12-01',
          endDate: '2026-12-04', // 3 days
          customerNotes: 'Test booking',
          // Malicious client tries to send $1 total:
          totalPrice: 1.0,
          dailyRate: 1.0,
          baseCost: 1.0
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      const b = res.body.data;
      expect(b.customerId).toBe('cust-1');
      expect(b.dailyRate).toBe(68); // ignored client manipulation
      expect(b.totalDays).toBe(3);
      expect(b.baseCost).toBe(204);
      expect(b.serviceFee).toBe(15.30);
      expect(b.totalPrice).toBe(219.30);
      expect(b.status).toBe('pending');
    });

    it('rejects booking when end date is earlier than start date (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({
          productId: 'prod-1',
          startDate: '2026-12-10',
          endDate: '2026-12-05' // Invalid date order
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/validation failed/i);
    });

    it('forbids a vendor from creating a rental booking (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${vendor1Token}`)
        .send({
          productId: 'prod-5',
          startDate: '2026-12-01',
          endDate: '2026-12-03'
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('detects booking overlap conflicts when all stock units are reserved (409 Conflict)', async () => {
      // First, vendor approves a booking for prod-1 (totalQuantity = 1) for Dec 10 - Dec 15
      const b1 = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({
          productId: 'prod-1',
          startDate: '2026-12-10',
          endDate: '2026-12-15'
        });

      // Vendor approves it
      await request(app)
        .patch(`/api/bookings/${b1.body.data.id}/status`)
        .set('Authorization', `Bearer ${vendor1Token}`)
        .send({ status: 'approved' });

      // Customer 2 attempts to request the same item on overlapping dates (Dec 12 - Dec 14)
      const b2 = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customer2Token}`)
        .send({
          productId: 'prod-1',
          startDate: '2026-12-12',
          endDate: '2026-12-14'
        });

      expect(b2.status).toBe(409);
      expect(b2.body.success).toBe(false);
      expect(b2.body.error.message).toMatch(/inventory conflict/i);
    });
  });

  describe('GET /api/bookings & Access Control', () => {
    it('customer receives only their own bookings', async () => {
      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${customer1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.every((b) => b.customerId === 'cust-1')).toBe(true);
    });

    it('vendor receives only bookings for their own equipment', async () => {
      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${vendor1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.every((b) => b.vendorId === 'vend-1')).toBe(true);
    });

    it('forbids an unrelated user from accessing a private booking by ID (403 Forbidden)', async () => {
      // book-101 is customer Alex (cust-1) and vendor Marcus (vend-1)
      // Customer Priya (cust-2) attempts to view it
      const res = await request(app)
        .get('/api/bookings/book-101')
        .set('Authorization', `Bearer ${customer2Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/not authorized/i);
    });
  });

  describe('PATCH /api/bookings/:id/status (Lifecycle & State Transitions)', () => {
    it('allows vendor to approve a pending booking request', async () => {
      const res = await request(app)
        .patch('/api/bookings/book-101/status') // book-101 is pending for vendor Marcus
        .set('Authorization', `Bearer ${vendor1Token}`)
        .send({ status: 'approved' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('approved');
    });

    it('allows vendor to decline a booking with rejection reason', async () => {
      const res = await request(app)
        .patch('/api/bookings/book-101/status')
        .set('Authorization', `Bearer ${vendor1Token}`)
        .send({
          status: 'rejected',
          reasonOrFeedback: 'Equipment is currently scheduled for routine sensor calibration.'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('rejected');
      expect(res.body.data.rejectionReason).toMatch(/sensor calibration/i);
    });

    it('rejects invalid state transitions (400 Bad Request)', async () => {
      // book-103 is completed in seed data; cannot transition completed -> approved
      const res = await request(app)
        .patch('/api/bookings/book-103/status')
        .set('Authorization', `Bearer ${vendor1Token}`)
        .send({ status: 'approved' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/invalid status transition/i);
    });

    it('allows customer to cancel their own pending booking', async () => {
      const res = await request(app)
        .patch('/api/bookings/book-101/status')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({ status: 'cancelled' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('cancelled');
    });

    it('forbids customer from approving or completing a booking (403 Forbidden)', async () => {
      const res = await request(app)
        .patch('/api/bookings/book-101/status')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({ status: 'approved' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});
