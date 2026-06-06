const { z } = require('zod');

const rfqItemSchema = z.object({
  itemName: z.string().min(1),
  description: z.string().optional(),
  quantity: z.number().positive(),
  unit: z.string().default('pcs'),
  estimatedUnitPrice: z.number().positive().optional(),
  specifications: z.any().optional(),
});

const createRfqSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  submissionDeadline: z.string().datetime().optional(),
  budgetEstimate: z.number().positive().optional(),
  currency: z.string().default('USD'),
  termsAndConditions: z.string().optional(),
  evaluationCriteria: z.any().optional(),
  items: z.array(rfqItemSchema).min(1, 'At least one item required'),
});

const updateRfqSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  submissionDeadline: z.string().datetime().optional(),
  budgetEstimate: z.number().positive().optional(),
  currency: z.string().optional(),
  termsAndConditions: z.string().optional(),
  evaluationCriteria: z.any().optional(),
});

const inviteVendorsSchema = z.object({
  vendorIds: z.array(z.string().uuid()).min(1, 'At least one vendor required'),
});

module.exports = { createRfqSchema, updateRfqSchema, inviteVendorsSchema };
