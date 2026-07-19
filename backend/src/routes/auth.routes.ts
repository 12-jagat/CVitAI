import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimit';
import {
  register,
  verifyEmail,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  googleLogin,
  githubLogin,
} from '../controllers/auth.controller';

const router = Router();

// Zod schemas for input validation
const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().min(1, 'Name is required'),
  }),
});

const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    code: z.string().length(6, 'Verification code must be 6 digits'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

const googleLoginSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Google authentication token is required'),
  }),
});

const githubLoginSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'GitHub access token is required'),
  }),
});

// Routes
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/verify-email', authLimiter, validate(verifyEmailSchema), verifyEmail);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);
router.post('/google', authLimiter, validate(googleLoginSchema), googleLogin);
router.post('/github', authLimiter, validate(githubLoginSchema), githubLogin);

export default router;
