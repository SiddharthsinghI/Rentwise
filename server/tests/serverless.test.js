import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../api/index.js';
import { PRODUCTION_FRONTEND_ORIGIN } from '../src/config/env.js';

describe('Vercel Serverless Function & CORS Security Suite (api/index.js)', () => {
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

  it('should set cross-origin-resource-policy to cross-origin via Helmet', async () => {
    const res = await request(app).get('/');
    expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
  });

  it('should allow production frontend origin https://rentwise-zqd3.vercel.app with credentials', async () => {
    const res = await request(app)
      .get('/')
      .set('Origin', PRODUCTION_FRONTEND_ORIGIN);
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe(PRODUCTION_FRONTEND_ORIGIN);
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should allow production frontend origin even if sent with trailing slash', async () => {
    const res = await request(app)
      .get('/')
      .set('Origin', `${PRODUCTION_FRONTEND_ORIGIN}/`);
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe(`${PRODUCTION_FRONTEND_ORIGIN}/`);
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should handle preflight OPTIONS request for production frontend origin', async () => {
    const res = await request(app)
      .options('/api/auth/login')
      .set('Origin', PRODUCTION_FRONTEND_ORIGIN)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type, Authorization');

    expect([200, 204]).toContain(res.status);
    expect(res.headers['access-control-allow-origin']).toBe(PRODUCTION_FRONTEND_ORIGIN);
    expect(res.headers['access-control-allow-credentials']).toBe('true');
    expect(res.headers['access-control-allow-methods']).toContain('POST');
    expect(res.headers['access-control-allow-headers']).toContain('Content-Type');
  });

  it('should set CORS headers for local client origin http://localhost:5173', async () => {
    const res = await request(app)
      .get('/')
      .set('Origin', 'http://localhost:5173');
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should permit origins configured via CLIENT_URL environment variable', async () => {
    const originalClientUrl = process.env.CLIENT_URL;
    process.env.CLIENT_URL = 'https://custom-staging.rentwise.com';
    try {
      const res = await request(app)
        .get('/')
        .set('Origin', 'https://custom-staging.rentwise.com');
      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBe('https://custom-staging.rentwise.com');
    } finally {
      process.env.CLIENT_URL = originalClientUrl;
    }
  });

  it('should allow RentWise-specific preview deployments matching rentwise-*.vercel.app', async () => {
    const res = await request(app)
      .get('/')
      .set('Origin', 'https://rentwise-feature-branch.vercel.app');
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('https://rentwise-feature-branch.vercel.app');
  });

  it('should NOT allow arbitrary or untrusted third-party origins', async () => {
    const res = await request(app)
      .get('/')
      .set('Origin', 'https://malicious-attacker.com');
    expect(res.status).toBe(200);
    // Origin is not allowed, so access-control-allow-origin MUST be omitted
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('should NOT allow arbitrary third-party vercel.app domains indiscriminately', async () => {
    const res = await request(app)
      .get('/')
      .set('Origin', 'https://unrelated-hacker.vercel.app');
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});
