import { Router } from 'express';
import { login, logout, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authLimiter, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
