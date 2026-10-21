import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(3, 'Equipment name must be at least 3 characters'),
  category: z.string().trim().min(2, 'Category is required'),
  pricePerDay: z.coerce.number().positive('Daily rate must be greater than 0'),
  securityDeposit: z.coerce.number().nonnegative('Security deposit cannot be negative').default(0),
  totalQuantity: z.coerce.number().int().min(1, 'Quantity must be at least 1').default(1),
  condition: z.enum(['Mint', 'Like New', 'Excellent', 'Good', 'Fair']).default('Like New'),
  availability: z.enum(['available', 'rented', 'unavailable']).default('available'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  images: z.array(z.string().url('Image must be a valid URL')).min(1, 'At least one image URL is required'),
  features: z.array(z.string()).optional().default([]),
  specs: z.record(z.any()).optional().default({}),
  location: z.string().trim().optional().default('United States'),
  inclusions: z.array(z.string()).optional().default([])
});

export const updateProductSchema = z.object({
  name: z.string().trim().min(3).optional(),
  category: z.string().trim().min(2).optional(),
  pricePerDay: z.coerce.number().positive().optional(),
  securityDeposit: z.coerce.number().nonnegative().optional(),
  totalQuantity: z.coerce.number().int().min(1).optional(),
  condition: z.enum(['Mint', 'Like New', 'Excellent', 'Good', 'Fair']).optional(),
  availability: z.enum(['available', 'rented', 'unavailable']).optional(),
  description: z.string().trim().min(10).optional(),
  images: z.array(z.string().url()).min(1).optional(),
  features: z.array(z.string()).optional(),
  specs: z.record(z.any()).optional(),
  location: z.string().trim().optional(),
  inclusions: z.array(z.string()).optional()
});

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  availability: z.string().optional(),
  sortBy: z.enum(['featured', 'price-asc', 'price-desc', 'rating', 'popular', 'newest']).optional(),
  vendorId: z.string().optional()
});
