import { errorResponse } from '../utils/response.js';
import { env } from '../config/env.js';

export const notFoundHandler = (req, res) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

export const errorHandler = (err, req, res, next) => {
  if (!env.isTest) {
    console.error('Unhandled server error:', err);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  // Do not expose stack traces or internal details in responses
  return errorResponse(
    res,
    message,
    statusCode,
    env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
};
