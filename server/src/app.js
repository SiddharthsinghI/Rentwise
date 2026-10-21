import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Security headers
app.use(helmet());

// Cross-Origin Resource Sharing with explicit client origins
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Root welcome
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'RentWise Backend API',
    version: '1.0.0',
    phase: 'Phase 2: Node.js + Express + JWT Architecture',
    docs: '/api/health'
  });
});

// API Routes
app.use('/api', apiRouter);

// 404 and Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
