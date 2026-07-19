import { Response, NextFunction } from 'express';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { AuthRequest } from '../middleware/auth';
import { Resume } from '../models/Resume';
import { Review } from '../models/Review';
import { GeminiService } from '../services/gemini.service';

/**
 * Get all resumes for current user
 */
export const getResumes = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 }).select('title templateId updatedAt');
    
    res.status(200).json({ success: true, resumes });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single resume by ID
 */
export const getResumeById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const resume = await Resume.findOne({ _id: id, userId });
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }

    res.status(200).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new blank resume
 */
export const createResume = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { title, templateId } = req.body;

    const resume = new Resume({
      userId,
      title: title || 'My Resume',
      templateId: templateId || 'modern',
      personalInfo: {
        firstName: '',
        lastName: '',
        email: req.user?.email || '',
        phone: '',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        jobTitle: '',
      },
    });

    await resume.save();

    res.status(201).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

/**
 * Update resume details
 */
export const updateResume = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    
    const resume = await Resume.findOne({ _id: id, userId });
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }

    // Set updated fields
    const fieldsToUpdate = [
      'title',
      'templateId',
      'sectionsOrder',
      'personalInfo',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages',
      'achievements',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        (resume as any)[field] = req.body[field];
      }
    });

    await resume.save();

    res.status(200).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete resume and reviews
 */
export const deleteResume = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const resume = await Resume.findOneAndDelete({ _id: id, userId });
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }

    // Delete associated reviews
    await Review.deleteMany({ resumeId: id });

    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Clone/Duplicate resume
 */
export const duplicateResume = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const original = await Resume.findOne({ _id: id, userId });
    if (!original) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }

    const cloneData = original.toObject() as any;
    delete cloneData._id;
    delete cloneData.createdAt;
    delete cloneData.updatedAt;
    
    cloneData.title = `${original.title} (Copy)`;

    const clone = new Resume({
      ...cloneData,
      userId,
    });

    await clone.save();

    res.status(201).json({ success: true, resume: clone });
  } catch (error) {
    next(error);
  }
};

/**
 * Parse PDF/DOCX Resume Upload
 */
export const importResumeFile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    let rawText = '';

    if (file.mimetype === 'application/pdf') {
      const parsedPdf = await pdfParse(file.buffer);
      rawText = parsedPdf.text;
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.mimetype === 'application/msword'
    ) {
      const parsedDocx = await mammoth.extractRawText({ buffer: file.buffer });
      rawText = parsedDocx.value;
    } else {
      res.status(400).json({ success: false, message: 'Unsupported file type. Only PDF and DOCX files are allowed.' });
      return;
    }

    if (!rawText.trim()) {
      res.status(400).json({ success: false, message: 'Could not extract text content from the file' });
      return;
    }

    // Process extracted text with Gemini
    const structuredResume = await GeminiService.parseResumeText(rawText);

    // Save as a new resume
    const resume = new Resume({
      userId,
      title: file.originalname.split('.')[0] || 'Imported Resume',
      templateId: 'modern',
      ...structuredResume,
    });

    await resume.save();

    res.status(201).json({
      success: true,
      message: 'Resume parsed and imported successfully',
      resume,
    });
  } catch (error) {
    next(error);
  }
};
