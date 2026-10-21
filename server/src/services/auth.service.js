import { userRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

export const authService = {
  async register(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      const err = new Error('An account with this email address already exists.');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await hashPassword(data.password);
    const created = await userRepository.create({
      ...data,
      passwordHash
    });

    const token = signToken({
      id: created.id,
      email: created.email,
      role: created.role
    });

    const { passwordHash: _, ...safeUser } = created;
    return { token, user: safeUser };
  },

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const { passwordHash: _, ...safeUser } = user;
    return { token, user: safeUser };
  },

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  },

  async logout() {
    return {
      message: 'Logged out successfully. Note: For stateless JWTs, the client must discard the stored Bearer token. Tokens remain cryptographically valid until their expiry window ends.'
    };
  }
};
