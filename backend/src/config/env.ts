import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string({
    required_error: 'MONGODB_URI is required',
  }),
  JWT_ACCESS_SECRET: z.string({
    required_error: 'JWT_ACCESS_SECRET is required',
  }),
  JWT_REFRESH_SECRET: z.string({
    required_error: 'JWT_REFRESH_SECRET is required',
  }),
  GEMINI_API_KEY: z.string({
    required_error: 'GEMINI_API_KEY is required',
  }),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  SMTP_HOST: z.string().default('smtp.mailtrap.io'),
  SMTP_PORT: z.string().default('2525'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default('no-reply@cvitai.com'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
