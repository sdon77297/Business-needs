import { Router } from 'express';
import {
  submitConsultation,
  submitCallback,
  submitGeneralContact,
  lookupInquiryStatus,
} from '../controllers/inquiryController';
import { leadSubmissionLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/consultation', leadSubmissionLimiter, submitConsultation);
router.post('/callback', leadSubmissionLimiter, submitCallback);
router.post('/contact', leadSubmissionLimiter, submitGeneralContact);
router.get('/track', lookupInquiryStatus);

export default router;
