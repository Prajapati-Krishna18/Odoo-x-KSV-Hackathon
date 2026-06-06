const { z } = require('zod');

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().optional(),
});

const updateUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

const assignRolesSchema = z.object({
  roleIds: z.array(z.string().uuid()).min(1, 'At least one role required'),
});

module.exports = { createUserSchema, updateUserSchema, assignRolesSchema };
