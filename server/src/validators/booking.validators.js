import { z } from 'zod';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const createBookingSchema = z
  .object({
    productId: z.string().min(1, 'Product ID is required'),
    startDate: z.string().regex(DATE_REGEX, 'Start date must be in YYYY-MM-DD format'),
    endDate: z.string().regex(DATE_REGEX, 'End date must be in YYYY-MM-DD format'),
    customerNotes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().default(''),
    destination: z.string().max(200).optional().default('Customer Address')
  })
  .refine(
    (data) => {
      const s = new Date(data.startDate);
      const e = new Date(data.endDate);
      return !isNaN(s.getTime()) && !isNaN(e.getTime()) && e >= s;
    },
    {
      message: 'End date must be on or after start date',
      path: ['endDate']
    }
  );

export const updateBookingStatusSchema = z.object({
  status: z.enum(['approved', 'rejected', 'active', 'completed', 'cancelled'], {
    errorMap: () => ({
      message: 'Status must be one of: approved, rejected, active, completed, cancelled'
    })
  }),
  reasonOrFeedback: z.string().max(500).optional()
});
