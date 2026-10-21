import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { resetTestDb } from './dbHelper.js';

describe('User Profile APIs (/api/users)', () => {
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

  describe('GET /api/users/me', () => {
    it('returns customer profile with booking summary stats', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('alex.customer@example.com');
      expect(res.body.data.stats).toBeDefined();
      expect(res.body.data.stats.totalBookings).toBeDefined();
      expect(res.body.data.passwordHash).toBeUndefined();
    });

    it('returns vendor profile with listing and handled booking stats', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${vendorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('vendor');
      expect(res.body.data.stats.totalListings).toBeDefined();
      expect(res.body.data.passwordHash).toBeUndefined();
    });

    it('rejects unauthenticated request (401)', async () => {
      const res = await request(app).get('/api/users/me');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/users/me', () => {
    it('allows user to update their bio, location, and phone number', async () => {
      const res = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Alexandre Rivera',
          phone: '+1 (555) 999-0000',
          location: 'Oakland, CA',
          bio: 'Filmmaker and creative producer.'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Alexandre Rivera');
      expect(res.body.data.location).toBe('Oakland, CA');
      expect(res.body.data.passwordHash).toBeUndefined();
    });

    it('rejects invalid profile data (e.g. invalid avatar URL format)', async () => {
      const res = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          avatar: 'not-a-valid-url'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
