import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { resetTestDb } from './dbHelper.js';

describe('Dashboard & Analytics APIs (/api/dashboard)', () => {
  let customerToken;
  let vendorToken;

  beforeEach(async () => {
    await resetTestDb();

    const [cRes, vRes] = await Promise.all([
      request(app).post('/api/auth/login').send({
        email: 'alex.customer@example.com',
        password: 'Password123!'
      }),
      request(app).post('/api/auth/login').send({
        email: 'marcus.vendor@example.com',
        password: 'Password123!'
      })
    ]);

    customerToken = cRes.body.data.token;
    vendorToken = vRes.body.data.token;
  });

  describe('GET /api/dashboard/customer', () => {
    it('returns calculated metrics and recent bookings for an authenticated customer', async () => {
      const res = await request(app)
        .get('/api/dashboard/customer')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.metrics).toBeDefined();
      expect(res.body.data.metrics.totalBookings).toBeDefined();
      expect(res.body.data.metrics.activeRentals).toBeDefined();
      expect(res.body.data.metrics.totalSpent).toBeDefined();
      expect(Array.isArray(res.body.data.recentBookings)).toBe(true);
    });

    it('forbids a vendor from accessing customer dashboard (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/dashboard/customer')
        .set('Authorization', `Bearer ${vendorToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/dashboard/vendor', () => {
    it('returns calculated metrics, monthly revenue trends, and recent requests for a vendor', async () => {
      const res = await request(app)
        .get('/api/dashboard/vendor')
        .set('Authorization', `Bearer ${vendorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.metrics).toBeDefined();
      expect(res.body.data.metrics.totalListings).toBeDefined();
      expect(res.body.data.metrics.totalEarnings).toBeDefined();
      expect(Array.isArray(res.body.data.monthlyRevenue)).toBe(true);
      expect(Array.isArray(res.body.data.recentRequests)).toBe(true);
    });

    it('forbids a customer from accessing vendor dashboard (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/dashboard/vendor')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('rejects unauthenticated request (401 Unauthorized)', async () => {
      const res = await request(app).get('/api/dashboard/vendor');
      expect(res.status).toBe(401);
    });
  });
});
