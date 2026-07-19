import { Router } from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  importResumeFile,
} from '../controllers/resume.controller';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit to 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word DOCX documents are allowed'));
    }
  },
});

// Protect all routes
router.use(protect);

router.get('/', getResumes);
router.get('/:id', getResumeById);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/duplicate', duplicateResume);
router.post('/import', upload.single('file'), importResumeFile);

export default router;
