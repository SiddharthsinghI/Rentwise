import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { resetTestDb } from './dbHelper.js';

describe('Authentication & Authorization APIs (/api/auth)', () => {
  beforeEach(async () => {
    await resetTestDb();
  });

  describe('POST /api/auth/register', () => {
    it('successfully registers a new customer', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          password: 'Password123!',
          role: 'customer',
          location: 'New York, NY'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe('jane.doe@example.com');
      expect(res.body.data.user.role).toBe('customer');
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    it('successfully registers a new vendor with business name', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'David Miller',
          email: 'david.vendor@example.com',
          password: 'Password123!',
          role: 'vendor',
          businessName: 'Miller Cine Gear',
          location: 'Chicago, IL'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('vendor');
      expect(res.body.data.user.businessName).toBe('Miller Cine Gear');
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    it('rejects registration with a duplicate email (409 Conflict)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alex Rivera Clone',
          email: 'alex.customer@example.com', // Already in seed data
          password: 'Password123!',
          role: 'customer'
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/already exists/i);
    });

    it('rejects registration with invalid email or short password (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'A',
          email: 'not-an-email',
          password: '123',
          role: 'customer'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.details).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('successfully logs in with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alex.customer@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('alex.customer@example.com');
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    it('rejects login with an incorrect password (401 Unauthorized)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alex.customer@example.com',
          password: 'WrongPassword999!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/invalid email or password/i);
    });

    it('rejects login for non-existent email (401 Unauthorized)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nobody@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns the authenticated user profile with valid Bearer token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'marcus.vendor@example.com',
          password: 'Password123!'
        });

      const token = loginRes.body.data.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Marcus Vance');
      expect(res.body.data.role).toBe('vendor');
      expect(res.body.data.passwordHash).toBeUndefined();
    });

    it('rejects request with missing Authorization header (401)', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('rejects request with invalid token format (401)', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token-string-xyz');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('acknowledges logout and explains client token discard requirements', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alex.customer@example.com',
          password: 'Password123!'
        });

      const token = loginRes.body.data.token;

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toMatch(/discard the stored Bearer token/i);
    });
  });
});
