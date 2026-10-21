import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters').optional(),
  businessName: z.string().trim().optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional()
});
