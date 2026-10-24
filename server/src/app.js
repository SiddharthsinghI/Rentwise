import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { isOriginAllowed } from './config/env.js';
import apiRouter from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Security headers with crossOriginResourcePolicy permitting cross-origin API clients
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// Dynamic CORS configuration supporting explicit production origins, env vars, and preflights
const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // Cache preflight response for 24 hours
  optionsSuccessStatus: 200 // Compatible with older browsers & mobile webviews
};

// CORS middleware MUST be registered before any routes and parsers
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Root welcome / health check
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'RentWise Backend API',
    version: '1.0.0',
    phase: 'Phase 3: Express + JWT + Prisma ORM + MySQL',
    docs: '/api/health'
  });
});

// Direct alias for root health check in serverless environments
app.get('/health', (req, res) => {
  res.redirect('/api/health');
});

// API Routes
app.use('/api', apiRouter);

// 404 and Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
