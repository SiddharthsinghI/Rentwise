import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { resetTestDb } from './dbHelper.js';

describe('Product & Equipment APIs (/api/products)', () => {
  let customerToken;
  let vendor1Token;
  let vendor2Token;

  beforeEach(async () => {
    await resetTestDb();

    const [cRes, v1Res, v2Res] = await Promise.all([
      request(app).post('/api/auth/login').send({
        email: 'alex.customer@example.com',
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

    customerToken = cRes.body.data.token;
    vendor1Token = v1Res.body.data.token;
    vendor2Token = v2Res.body.data.token;
  });

  describe('GET /api/products (Public Catalog)', () => {
    it('returns the equipment catalog without authentication', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('filters equipment by category', async () => {
      const res = await request(app).get('/api/products?category=cameras');
      expect(res.status).toBe(200);
      expect(res.body.data.every((p) => p.category === 'cameras')).toBe(true);
    });

    it('filters equipment by search query across fields', async () => {
      const res = await request(app).get('/api/products?search=sony');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(
        res.body.data.every(
          (p) =>
            p.name.toLowerCase().includes('sony') ||
            p.specs?.brand?.toLowerCase().includes('sony') ||
            p.description.toLowerCase().includes('sony')
        )
      ).toBe(true);
    });

    it('sorts equipment by price ascending', async () => {
      const res = await request(app).get('/api/products?sortBy=price-asc');
      expect(res.status).toBe(200);
      const prices = res.body.data.map((p) => p.pricePerDay);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });
  });

  describe('GET /api/products/:id', () => {
    it('returns equipment details with attached vendor public information', async () => {
      const res = await request(app).get('/api/products/prod-1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('prod-1');
      expect(res.body.data.vendor).toBeDefined();
      expect(res.body.data.vendor.name).toBe('Marcus Vance');
    });

    it('returns 404 for non-existent equipment ID', async () => {
      const res = await request(app).get('/api/products/non-existent-999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/products (Vendor Listing Creation)', () => {
    it('allows a verified vendor to create a new equipment listing', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${vendor1Token}`)
        .send({
          name: 'DJI Ronin 4D 6K Cinema Camera Combo',
          category: 'cameras',
          pricePerDay: 125,
          securityDeposit: 750,
          totalQuantity: 2,
          condition: 'Mint',
          description: 'Full cinema camera gimbal combo with LiDAR focusing system.',
          images: [
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80'
          ],
          features: ['4-Axis Gimbal Stabilization', 'Full Frame 6K 60fps ProRes RAW']
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.vendorId).toBe('vend-1');
      expect(res.body.data.totalQuantity).toBe(2);
    });

    it('rejects product creation by a customer (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Unauthorized Customer Item',
          category: 'cameras',
          pricePerDay: 50,
          description: 'A customer attempting to list equipment.'
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/access denied/i);
    });

    it('rejects product creation without authentication (401)', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Unauthenticated Item' });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/products/:id (Ownership & Editing)', () => {
    it('allows the listing owner vendor to update their equipment', async () => {
      const res = await request(app)
        .patch('/api/products/prod-1') // Marcus owns prod-1
        .set('Authorization', `Bearer ${vendor1Token}`)
        .send({
          pricePerDay: 72,
          condition: 'Mint'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.pricePerDay).toBe(72);
      expect(res.body.data.condition).toBe('Mint');
    });

    it('forbids a vendor from modifying another vendor listing (403 Forbidden)', async () => {
      const res = await request(app)
        .patch('/api/products/prod-1') // Owned by Marcus (vend-1)
        .set('Authorization', `Bearer ${vendor2Token}`) // Elena (vend-2)
        .send({
          pricePerDay: 10
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/edit your own/i);
    });
  });

  describe('DELETE /api/products/:id (Ownership & Deletion)', () => {
    it('forbids a vendor from deleting another vendor listing (403 Forbidden)', async () => {
      const res = await request(app)
        .delete('/api/products/prod-1') // Owned by vend-1
        .set('Authorization', `Bearer ${vendor2Token}`); // Attempted by vend-2

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/delete your own/i);
    });

    it('allows the listing owner vendor to delete their equipment', async () => {
      const res = await request(app)
        .delete('/api/products/prod-1')
        .set('Authorization', `Bearer ${vendor1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify it is gone
      const checkRes = await request(app).get('/api/products/prod-1');
      expect(checkRes.status).toBe(404);
    });
  });
});
