import { Router } from 'express';
import { z } from 'zod';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  reviewResumeEndpoint,
  matchJobDescriptionEndpoint,
  generateResumeEndpoint,
  suggestBulletsEndpoint,
  getReviewsForResume,
} from '../controllers/ai.controller';

const router = Router();

// Zod validation schemas
const reviewSchema = z.object({
  body: z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
  }),
});

const jobMatchSchema = z.object({
  body: z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    jobDescription: z.string().min(10, 'Job description must be at least 10 characters long'),
  }),
});

const generateSchema = z.object({
  body: z.object({
    prompt: z.string().min(10, 'Prompt/details must be at least 10 characters long'),
  }),
});

const improveBulletsSchema = z.object({
  body: z.object({
    bullets: z.array(z.string()).min(1, 'At least one bullet point is required'),
    jobTitle: z.string().optional(),
  }),
});

// Protect all AI routes
router.use(protect);

router.post('/review', validate(reviewSchema), reviewResumeEndpoint);
router.post('/job-match', validate(jobMatchSchema), matchJobDescriptionEndpoint);
router.post('/generate', validate(generateSchema), generateResumeEndpoint);
router.post('/improve-bullets', validate(improveBulletsSchema), suggestBulletsEndpoint);
router.get('/reviews/:resumeId', getReviewsForResume);

export default router;
