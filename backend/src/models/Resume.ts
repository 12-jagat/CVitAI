import { Schema, model, Document, Types } from 'mongoose';

export interface IPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  github?: string;
  linkedin?: string;
  jobTitle: string;
}

export interface IExperience {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface IEducation {
  school: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  description?: string;
}

export interface ISkill {
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Expert' | '';
}

export interface IProject {
  name: string;
  description: string;
  role?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  technologies?: string[];
}

export interface ICertification {
  name: string;
  issuer: string;
  issueDate?: string;
  url?: string;
}

export interface ILanguage {
  name: string;
  proficiency?: 'Basic' | 'Conversational' | 'Fluent' | 'Native' | '';
}

export interface IAchievement {
  title: string;
  date?: string;
  description: string;
}

export interface IResume extends Document {
  userId: Types.ObjectId;
  title: string;
  templateId: string;
  sectionsOrder: string[];
  personalInfo: IPersonalInfo;
  summary: string;
  experience: IExperience[];
  education: IEducation[];
  skills: ISkill[];
  projects: IProject[];
  certifications: ICertification[];
  languages: ILanguage[];
  achievements: IAchievement[];
  createdAt: Date;
  updatedAt: Date;
}

const PersonalInfoSchema = new Schema<IPersonalInfo>({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
}, { _id: false });

const ExperienceSchema = new Schema<IExperience>({
  company: { type: String, default: '' },
  position: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
});

const EducationSchema = new Schema<IEducation>({
  school: { type: String, default: '' },
  degree: { type: String, default: '' },
  fieldOfStudy: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  gpa: { type: String, default: '' },
  description: { type: String, default: '' },
});

const SkillSchema = new Schema<ISkill>({
  name: { type: String, default: '' },
  level: { type: String, default: '' },
});

const ProjectSchema = new Schema<IProject>({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  role: { type: String, default: '' },
  url: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  technologies: { type: [String], default: [] },
});

const CertificationSchema = new Schema<ICertification>({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  issueDate: { type: String, default: '' },
  url: { type: String, default: '' },
});

const LanguageSchema = new Schema<ILanguage>({
  name: { type: String, default: '' },
  proficiency: { type: String, default: '' },
});

const AchievementSchema = new Schema<IAchievement>({
  title: { type: String, default: '' },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
});

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Untitled Resume',
    },
    templateId: {
      type: String,
      default: 'modern',
    },
    sectionsOrder: {
      type: [String],
      default: [
        'personalInfo',
        'summary',
        'experience',
        'education',
        'skills',
        'projects',
        'certifications',
        'languages',
        'achievements',
      ],
    },
    personalInfo: {
      type: PersonalInfoSchema,
      default: () => ({}),
    },
    summary: {
      type: String,
      default: '',
    },
    experience: {
      type: [ExperienceSchema],
      default: [],
    },
    education: {
      type: [EducationSchema],
      default: [],
    },
    skills: {
      type: [SkillSchema],
      default: [],
    },
    projects: {
      type: [ProjectSchema],
      default: [],
    },
    certifications: {
      type: [CertificationSchema],
      default: [],
    },
    languages: {
      type: [LanguageSchema],
      default: [],
    },
    achievements: {
      type: [AchievementSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = model<IResume>('Resume', ResumeSchema);
