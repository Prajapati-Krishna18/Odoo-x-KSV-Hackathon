const { z } = require('zod');

const quotationItemSchema = z.object({
  rfqItemId: z.string().uuid(),
  unitPrice: z.number().positive(),
  quantity: z.number().positive(),
  remarks: z.string().optional(),
});

const createQuotationSchema = z.object({
  rfqVendorId: z.string().uuid(),
  currency: z.string().default('USD'),
  validityDate: z.string().datetime().optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(quotationItemSchema).min(1, 'At least one item required'),
});

const updateQuotationSchema = z.object({
  validityDate: z.string().datetime().optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(quotationItemSchema).min(1).optional(),
});

module.exports = { createQuotationSchema, updateQuotationSchema };
