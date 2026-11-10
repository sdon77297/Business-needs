import { Router } from 'express';
import { getServices, getServiceBySlug, getSiteSettings } from '../controllers/serviceController';

const router = Router();

router.get('/', getServices);
router.get('/settings', getSiteSettings);
router.get('/:slug', getServiceBySlug);

export default router;
