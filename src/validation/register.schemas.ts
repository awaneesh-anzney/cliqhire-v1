import { z } from 'zod';

export const step1Schema = z.object({
  orgType: z.enum(['agency', 'company'], { required_error: 'Please select workspace type' }),
  companyName: z.string().min(2, 'Company name required'),
  tenantSlug: z
    .string()
    .min(2, 'Minimum 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
});

export const step2Schema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const toSlug = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');