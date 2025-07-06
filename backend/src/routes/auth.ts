import { Router } from 'express';
import { login } from '../controllers/authController';
import { loginValidation } from '../middleware/validation';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many login attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// POST /api/auth/login
router.post('/login', loginLimiter, loginValidation, login);

export default router; 