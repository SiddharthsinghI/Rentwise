import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  role: z.enum(['customer', 'vendor'], {
    errorMap: () => ({ message: 'Role must be either "customer" or "vendor"' })
  }),
  businessName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  bio: z.string().trim().optional()
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});
