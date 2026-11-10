import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again later.',
  },
});

export const leadSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 inquiries per 15 minutes per IP to prevent spamming
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'High volume of inquiries received from your location. Please allow a few minutes before submitting another request.',
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Max 10 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. For security reasons, please wait 15 minutes before trying again.',
  },
});
