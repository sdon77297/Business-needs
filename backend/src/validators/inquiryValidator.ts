import { z } from 'zod';

export const consultationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid business or personal email address'),
  phone: z.string().min(7, 'Please provide a valid direct phone number').max(30),
  countryOrCity: z.string().optional(),
  estimatedPortfolioTier: z.enum(['$1M-$5M', '$5M-$20M', '$20M+', 'CONFIDENTIAL']).default('CONFIDENTIAL'),
  serviceOfInterest: z.string().min(2).max(100).default('Private Wealth Management'),
  preferredMode: z.enum(['IN_PERSON', 'SECURE_VIDEO', 'TELEPHONE']).default('SECURE_VIDEO'),
  preferredDate: z.string().optional(),
  preferredTimeSlot: z.string().optional(),
  message: z.string().max(2000).optional(),
});

export const callbackSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z.string().min(7, 'Please provide a valid direct phone number').max(30),
  callbackWindow: z.enum(['IMMEDIATE', 'MORNING', 'AFTERNOON', 'EVENING']).default('IMMEDIATE'),
  serviceOfInterest: z.string().optional().default('Priority Wealth Inquiry'),
  countryOrCity: z.string().optional(),
});

export const generalContactSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Please provide a valid email'),
  phone: z.string().min(7, 'Phone number is required').max(30),
  serviceOfInterest: z.string().default('General Advisory'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'IN_REVIEW', 'CONVERTED', 'ARCHIVED']),
  assignedAdvisorId: z.string().optional(),
});

export const addNoteSchema = z.object({
  content: z.string().min(2, 'Note content must be at least 2 characters').max(1500),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
