import { Router } from 'express';
import {
  getDashboardStats,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  addInternalNote,
  exportInquiriesCsv,
} from '../controllers/adminController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All admin routes require valid authentication
router.use(authenticate);

router.get('/dashboard/stats', getDashboardStats);
router.get('/inquiries', getInquiries);
router.get('/inquiries/export/csv', exportInquiriesCsv);
router.get('/inquiries/:id', getInquiryById);
router.patch('/inquiries/:id/status', updateInquiryStatus);
router.post('/inquiries/:id/notes', addInternalNote);

export default router;
