import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// We will use gemini-2.5-flash as the fast default model, or fallback to gemini-1.5-flash if needed
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Service to interface with Google Gemini API
 */
export class GeminiService {
  /**
   * Helper to parse raw text from PDF/DOCX into a structured Resume JSON
   */
  static async parseResumeText(rawText: string): Promise<any> {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      You are an expert ATS (Applicant Tracking System) parser. Analyze the raw text content of a resume below and convert it into a structured JSON object.
      Do not invent any information. If a section is missing, leave the array/object empty.
      Format dates consistently (e.g., "MM/YYYY" or "Month YYYY", or "Present").
      
      Here is the raw resume text:
      """
      ${rawText}
      """

      Return ONLY a JSON object matching this TypeScript structure:
      {
        "personalInfo": {
          "firstName": string,
          "lastName": string,
          "email": string,
          "phone": string,
          "location": string,
          "website": string,
          "github": string,
          "linkedin": string,
          "jobTitle": string
        },
        "summary": string,
        "experience": Array<{
          "company": string,
          "position": string,
          "location": string,
          "startDate": string,
          "endDate": string,
          "current": boolean,
          "description": string
        }>,
        "education": Array<{
          "school": string,
          "degree": string,
          "fieldOfStudy": string,
          "location": string,
          "startDate": string,
          "endDate": string,
          "current": boolean,
          "gpa": string,
          "description": string
        }>,
        "skills": Array<{
          "name": string,
          "level": "Beginner" | "Intermediate" | "Expert" | ""
        }>,
        "projects": Array<{
          "name": string,
          "description": string,
          "role": string,
          "url": string,
          "startDate": string,
          "endDate": string,
          "technologies": string[]
        }>,
        "certifications": Array<{
          "name": string,
          "issuer": string,
          "issueDate": string,
          "url": string
        }>,
        "languages": Array<{
          "name": string,
          "proficiency": "Basic" | "Conversational" | "Fluent" | "Native" | ""
        }>,
        "achievements": Array<{
          "title": string,
          "date": string,
          "description": string
        }>
      }
    `;

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const text = result.response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini Parse Resume Error:', error);
      throw new Error('Failed to parse resume text using AI.');
    }
  }

  /**
   * Helper to generate a resume based on user details
   */
  static async generateResumeFromPrompt(promptDetails: string): Promise<any> {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      You are a professional resume writer. Based on the user's provided details below, generate a highly professional, ATS-friendly resume.
      Expand on the details provided, structure it nicely, and create strong bullet points for experiences/projects using the STAR method (Situation, Task, Action, Result).
      
      User Details:
      """
      ${promptDetails}
      """

      Return ONLY a JSON object matching this TypeScript structure:
      {
        "personalInfo": {
          "firstName": string,
          "lastName": string,
          "email": string,
          "phone": string,
          "location": string,
          "website": string,
          "github": string,
          "linkedin": string,
          "jobTitle": string
        },
        "summary": string,
        "experience": Array<{
          "company": string,
          "position": string,
          "location": string,
          "startDate": string,
          "endDate": string,
          "current": boolean,
          "description": string (multiline string with bullet points prefixed by '-')
        }>,
        "education": Array<{
          "school": string,
          "degree": string,
          "fieldOfStudy": string,
          "location": string,
          "startDate": string,
          "endDate": string,
          "current": boolean,
          "gpa": string,
          "description": string
        }>,
        "skills": Array<{
          "name": string,
          "level": "Beginner" | "Intermediate" | "Expert" | ""
        }>,
        "projects": Array<{
          "name": string,
          "description": string,
          "role": string,
          "url": string,
          "startDate": string,
          "endDate": string,
          "technologies": string[]
        }>,
        "certifications": Array<{
          "name": string,
          "issuer": string,
          "issueDate": string,
          "url": string
        }>,
        "languages": Array<{
          "name": string,
          "proficiency": "Basic" | "Conversational" | "Fluent" | "Native" | ""
        }>,
        "achievements": Array<{
          "title": string,
          "date": string,
          "description": string
        }>
      }
    `;

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      return JSON.parse(result.response.text());
    } catch (error) {
      console.error('Gemini Generate Resume Error:', error);
      throw new Error('Failed to generate resume using AI.');
    }
  }

  /**
   * Helper to perform a comprehensive ATS review
   */
  static async reviewResume(resumeData: any): Promise<any> {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      You are an expert recruiter and ATS evaluator. Review the following resume details and generate a thorough review.
      Evaluate grammar, formatting, suggestions for improvement, and generate better bullet points for their experience.
      
      Resume Data (JSON):
      ${JSON.stringify(resumeData, null, 2)}

      Return ONLY a JSON object matching this structure:
      {
        "atsScore": number (0 to 100),
        "overallScore": number (0 to 100),
        "grammarReview": Array<string> (specific grammar or spelling corrections),
        "formattingReview": string (feedback on structure and layout),
        "missingKeywords": Array<string> (industry-specific keywords that should be added),
        "missingSkills": Array<string> (skills typical for their target role that are missing),
        "recruiterFeedback": string (overall written feedback from a recruiter's perspective),
        "improvedBulletPoints": Array<{
          "original": string (an existing weak bullet point or project/job description line),
          "improved": string (the suggested stronger, result-oriented version using action verbs)
        }>,
        "suggestions": Array<string> (actionable tips to improve the resume)
      }
    `;

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      return JSON.parse(result.response.text());
    } catch (error) {
      console.error('Gemini Review Resume Error:', error);
      throw new Error('Failed to review resume using AI.');
    }
  }

  /**
   * Helper to match a resume with a Job Description
   */
  static async matchJobDescription(resumeData: any, jobDescription: string): Promise<any> {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      You are an ATS analyzer. Compare the following resume details with the pasted Job Description.
      Determine the match percentage, identify missing skills and keywords, and outline specific actions to optimize the resume for this job.

      Resume Data (JSON):
      ${JSON.stringify(resumeData, null, 2)}

      Job Description:
      """
      ${jobDescription}
      """

      Return ONLY a JSON object matching this structure:
      {
        "matchPercentage": number (0 to 100),
        "missingKeywords": Array<string> (keywords/phrases from the JD missing in the resume),
        "missingSkills": Array<string> (hard/soft skills mentioned in the JD missing in the resume),
        "atsImprovements": string (detailed structural improvements to pass ATS filters for this JD),
        "suggestions": string (tailored suggestions and advice on how to rewrite the resume summary/experiences to match this job)
      }
    `;

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      return JSON.parse(result.response.text());
    } catch (error) {
      console.error('Gemini Job Match Error:', error);
      throw new Error('Failed to compute job match using AI.');
    }
  }

  /**
   * Helper to improve specific bullet points
   */
  static async improveBulletPoints(bullets: string[], jobTitle: string): Promise<string[]> {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      You are a professional resume editor. Improve the following list of bullet points for a "${jobTitle}" position.
      Make them professional, impact-oriented, starting with strong action verbs, and focusing on quantifiable results where possible.
      
      Original Bullet Points:
      ${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}

      Return ONLY a JSON object matching this structure:
      {
        "improvedBulletPoints": Array<string>
      }
    `;

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const data = JSON.parse(result.response.text());
      return data.improvedBulletPoints || [];
    } catch (error) {
      console.error('Gemini Improve Bullets Error:', error);
      throw new Error('Failed to improve bullet points using AI.');
    }
  }
}
