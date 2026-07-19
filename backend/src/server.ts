import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db';
import { env } from './config/env';
import { apiLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/error';
import authRoutes from './routes/auth.routes';
import resumeRoutes from './routes/resume.routes';
import aiRoutes from './routes/ai.routes';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS with dynamic configurations
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom lightweight inline cookie parser middleware
app.use((req: Request, res: Response, next) => {
  (req as any).cookies = {};
  const rawCookies = req.headers.cookie;
  if (rawCookies) {
    rawCookies.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      (req as any).cookies[key] = val;
    });
  }
  next();
});

// Apply rate limiter to all api routes
app.use('/api', apiLimiter);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the CVItAI API',
    version: '1.0.0',
  });
});

// Bind API routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);

// Catch-all route for unhandled routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start server and connect DB
const startServer = async () => {
  await connectDB();
  const PORT = parseInt(env.PORT, 10);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start CVItAI backend server:', err);
});
