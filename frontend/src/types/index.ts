export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
}

export interface PersonalInfo {
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

export interface Experience {
  _id?: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  _id?: string;
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

export interface Skill {
  _id?: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Expert' | '';
}

export interface Project {
  _id?: string;
  name: string;
  description: string;
  role?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  technologies?: string[];
}

export interface Certification {
  _id?: string;
  name: string;
  issuer: string;
  issueDate?: string;
  url?: string;
}

export interface Language {
  _id?: string;
  name: string;
  proficiency?: 'Basic' | 'Conversational' | 'Fluent' | 'Native' | '';
}

export interface Achievement {
  _id?: string;
  title: string;
  date?: string;
  description: string;
}

export interface Resume {
  _id: string;
  title: string;
  templateId: string;
  sectionsOrder: string[];
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
  updatedAt: string;
  createdAt: string;
}

export interface BulletPointImprovement {
  original: string;
  improved: string;
}

export interface Review {
  _id: string;
  resumeId: string;
  atsScore: number;
  overallScore: number;
  grammarReview: string[];
  formattingReview: string;
  missingKeywords: string[];
  missingSkills: string[];
  recruiterFeedback: string;
  improvedBulletPoints: BulletPointImprovement[];
  suggestions: string[];
  createdAt: string;
}

export interface JobMatchResults {
  matchPercentage: number;
  missingKeywords: string[];
  missingSkills: string[];
  atsImprovements: string;
  suggestions: string;
}
