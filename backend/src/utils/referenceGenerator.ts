import crypto from 'crypto';

/**
 * Generates an institutional high-trust unique inquiry reference number
 * Example format: MFEF-2026-7A9B
 */
export const generateReferenceNumber = (prefix: string = 'MFEF'): string => {
  const year = new Date().getFullYear();
  const randomBytes = crypto.randomBytes(2).toString('hex').toUpperCase();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomBytes}${randomDigits}`.substring(0, 16);
};
