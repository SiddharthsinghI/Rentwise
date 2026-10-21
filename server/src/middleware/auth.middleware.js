import { verifyToken } from '../utils/jwt.js';
import { userRepository } from '../repositories/user.repository.js';
import { errorResponse } from '../utils/response.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return errorResponse(res, 'Authentication token is required', 401);
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return errorResponse(res, 'Authorization header must be in format: Bearer <token>', 401);
    }

    const token = parts[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Session token has expired. Please log in again.', 401);
      }
      return errorResponse(res, 'Invalid authentication token', 401);
    }

    if (!decoded || !decoded.id) {
      return errorResponse(res, 'Invalid token payload', 401);
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 'Authenticated user account no longer exists', 401);
    }

    // Attach safe user (never passwordHash)
    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (error) {
    return errorResponse(res, 'Internal authentication error', 500);
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. This action requires one of the following roles: ${allowedRoles.join(', ')}`,
        403
      );
    }

    next();
  };
};
