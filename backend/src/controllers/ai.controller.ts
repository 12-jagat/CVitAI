import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Resume } from '../models/Resume';
import { Review } from '../models/Review';
import { GeminiService } from '../services/gemini.service';

/**
 * Review a resume to generate ATS score and improvement guidelines
 */
export const reviewResumeEndpoint = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { resumeId } = req.body;
    const userId = req.user?._id;

    if (!resumeId) {
      res.status(400).json({ success: false, message: 'Resume ID is required' });
      return;
    }

    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }

    // Call Gemini API to review
    const reviewData = await GeminiService.reviewResume(resume);

    // Save review report to database
    const review = new Review({
      userId,
      resumeId,
      ...reviewData,
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Resume reviewed successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Match a resume with a Job Description
 */
export const matchJobDescriptionEndpoint = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { resumeId, jobDescription } = req.body;
    const userId = req.user?._id;

    if (!resumeId || !jobDescription) {
      res.status(400).json({ success: false, message: 'Resume ID and Job Description are required' });
      return;
    }

    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }

    // Compute job match with Gemini
    const matchResults = await GeminiService.matchJobDescription(resume, jobDescription);

    res.status(200).json({
      success: true,
      matchResults,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate a new resume from text prompt details
 */
export const generateResumeEndpoint = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ success: false, message: 'Prompt details are required' });
      return;
    }

    // Generate structured resume layout from user instructions
    const structuredResume = await GeminiService.generateResumeFromPrompt(prompt);

    res.status(200).json({
      success: true,
      resumeData: structuredResume,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Improve specific experience bullet points
 */
export const suggestBulletsEndpoint = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bullets, jobTitle } = req.body;

    if (!bullets || !Array.isArray(bullets) || bullets.length === 0) {
      res.status(400).json({ success: false, message: 'An array of bullet points is required' });
      return;
    }

    const improvedBullets = await GeminiService.improveBulletPoints(bullets, jobTitle || 'Software Engineer');

    res.status(200).json({
      success: true,
      improvedBullets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch past review reports for a specific resume
 */
export const getReviewsForResume = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { resumeId } = req.params;
    const userId = req.user?._id;

    const reviews = await Review.find({ resumeId, userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
