const { z } = require('zod');

const createVendorSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(200),
  contactPerson: z.string().min(1, 'Contact person is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  taxId: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  categoryId: z.string().uuid().optional(),
});

const updateVendorSchema = createVendorSchema.partial();

const updateStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BLACKLISTED', 'PENDING']),
  reason: z.string().optional(),
});

const rateVendorSchema = z.object({
  rfqId: z.string().uuid(),
  qualityScore: z.number().min(0).max(5),
  deliveryScore: z.number().min(0).max(5),
  priceScore: z.number().min(0).max(5),
  responsivenessScore: z.number().min(0).max(5),
  comments: z.string().optional(),
});

module.exports = { createVendorSchema, updateVendorSchema, updateStatusSchema, rateVendorSchema };
