/**
 * Consistent API JSON response helpers
 */

export const successResponse = (res, data, statusCode = 200, message = null) => {
  const payload = {
    success: true,
    data
  };
  if (message) payload.message = message;
  return res.status(statusCode).json(payload);
};

export const errorResponse = (res, message, statusCode = 400, details = null) => {
  const payload = {
    success: false,
    error: {
      message,
      statusCode
    }
  };
  if (details) payload.error.details = details;
  return res.status(statusCode).json(payload);
};
