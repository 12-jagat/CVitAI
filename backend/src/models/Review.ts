import { Schema, model, Document, Types } from 'mongoose';

export interface IBulletPointImprovement {
  original: string;
  improved: string;
}

export interface IReview extends Document {
  userId: Types.ObjectId;
  resumeId: Types.ObjectId;
  atsScore: number;
  overallScore: number;
  grammarReview: string[];
  formattingReview: string;
  missingKeywords: string[];
  missingSkills: string[];
  recruiterFeedback: string;
  improvedBulletPoints: IBulletPointImprovement[];
  suggestions: string[];
  createdAt: Date;
}

const BulletPointImprovementSchema = new Schema<IBulletPointImprovement>({
  original: { type: String, required: true },
  improved: { type: String, required: true },
}, { _id: false });

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grammarReview: {
      type: [String],
      default: [],
    },
    formattingReview: {
      type: String,
      default: '',
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    recruiterFeedback: {
      type: String,
      default: '',
    },
    improvedBulletPoints: {
      type: [BulletPointImprovementSchema],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Review = model<IReview>('Review', ReviewSchema);
