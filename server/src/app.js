import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env, getAllowedOrigins } from './config/env.js';
import apiRouter from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Security headers
app.use(helmet());

// Dynamic CORS configuration supporting multiple origins and Vercel preview domains
const allowedOrigins = getAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, health checks)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, '');
    const isAllowed =
      allowedOrigins.includes(cleanOrigin) ||
      Boolean(process.env.VERCEL && cleanOrigin.endsWith('.vercel.app'));

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

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
