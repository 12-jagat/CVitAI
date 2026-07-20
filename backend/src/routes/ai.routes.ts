import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  reviewResumeEndpoint,
  matchJobDescriptionEndpoint,
  generateResumeEndpoint,
  suggestBulletsEndpoint,
  getReviewsForResume,
  reviewGuestResumeEndpoint,
} from '../controllers/ai.controller';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word DOCX documents are allowed') as any);
    }
  },
});

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

// Public guest check endpoint
router.post('/review-guest', upload.single('file'), reviewGuestResumeEndpoint);

// Protect all AI routes
router.use(protect);

router.post('/review', validate(reviewSchema), reviewResumeEndpoint);
router.post('/job-match', validate(jobMatchSchema), matchJobDescriptionEndpoint);
router.post('/generate', validate(generateSchema), generateResumeEndpoint);
router.post('/improve-bullets', validate(improveBulletsSchema), suggestBulletsEndpoint);
router.get('/reviews/:resumeId', getReviewsForResume);

export default router;
