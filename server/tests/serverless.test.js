import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../api/index.js';

describe('Vercel Serverless Function & Express Setup (api/index.js)', () => {
  it('should export the Express application instance as default export', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
  });

  it('should serve GET / with 200 OK and valid JSON metadata', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('RentWise Backend API');
    expect(res.body.version).toBe('1.0.0');
  });

  it('should set CORS headers for local client origin', async () => {
    const res = await request(app)
      .get('/')
      .set('Origin', 'http://localhost:5173');
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should handle preflight OPTIONS request with 204 or 200 and allowed methods', async () => {
    const res = await request(app)
      .options('/api/products')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET');
    expect([200, 204]).toContain(res.status);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-methods']).toContain('GET');
  });

  it('should handle Vercel preview domain when VERCEL environment is simulated', async () => {
    const previousVercel = process.env.VERCEL;
    process.env.VERCEL = '1';
    try {
      const res = await request(app)
        .get('/')
        .set('Origin', 'https://rentwise-frontend-preview-abc123.vercel.app');
      expect(res.headers['access-control-allow-origin']).toBe('https://rentwise-frontend-preview-abc123.vercel.app');
    } finally {
      if (previousVercel !== undefined) {
        process.env.VERCEL = previousVercel;
      } else {
        delete process.env.VERCEL;
      }
    }
  });
});
