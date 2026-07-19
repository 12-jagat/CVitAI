# ResumeIQ AI

ResumeIQ AI is a production-ready, premium AI-powered Resume Builder and ATS Resume Reviewer web application. Built with Next.js 15, Express, MongoDB, and the Google Gemini 2.5 API, it enables job seekers to write, scan, and optimize professional, recruiter-ready resumes in real-time.

---

## Folder Structure

```
resumeiq-ai/
 ├── backend/            # Express, Mongoose & TypeScript Backend API
 ├── frontend/           # Next.js 15, React 19 & Tailwind Client
 ├── docker/             # Production & Development Dockerfiles
 ├── docs/               # Security and Deployment Guides
 ├── docker-compose.yml  # Local stack orchestration
 ├── README.md           # Master Documentation
 └── .env.example        # Environment variable configurations
```

---

## Core Features

- **Saas Landing Page**: Premium dark-mode interface featuring glassmorphic designs and Framer Motion micro-animations.
- **Interactive Resume Editor**: Live typographic render preview supporting 4 premium themes (Modern, Minimal, Tech, Elegant).
- **AI ATS Scanner & Reviewer**: Scores resumes out of 100, highlights missing industry skills, and returns structured feedback.
- **AI Resume Generator**: Generate tailored resume details from simple text instructions using Gemini AI.
- **Job Description Matcher**: Paste target JDs to identify keyword alignment, compute compatibility scores, and optimize bullet points.
- **Resume File Parser**: Upload existing PDF or DOCX documents to auto-populate form segments instantly.
- **Client-side Vector Export**: Export clean vector-scaled PDFs directly via browser print windows, and generate editable DOCX files.
- **Secure Authentication**: Implements JWT Access Tokens, Refresh Token rotation (stored via secure, HTTP-only cookies), password hashing via `bcrypt`, and mock/active Google OAuth capabilities.

---

## Local Development Setup

### Prerequisite

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine.
- A **Google Gemini API Key** (obtainable from [Google AI Studio](https://aistudio.google.com/)).

### Running the entire stack with Docker Compose

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and insert your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Run the orchestration script:
   ```bash
   docker compose up --build
   ```
4. Access the applications:
   - **Frontend application**: [http://localhost:3000](http://localhost:3000)
   - **Backend API URL**: [http://localhost:5000](http://localhost:5000)
   - **Local MongoDB Instance**: `mongodb://localhost:27017/resumeiq`

---

## Manual Local Installation (Without Docker)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Copy backend configuration file:
   ```bash
   cp .env.example .env
   ```
4. Populate MONGODB_URI and GEMINI_API_KEY.
5. Launch the Express server in hot-reload development mode:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Launch the Next.js dev server:
   ```bash
   npm run dev
   ```
4. Access the UI at [http://localhost:3000](http://localhost:3000).

---

## Documentation Links

- [Security Guidelines (docs/Security.md)](file:///C:/Users/J.N.PATHAK/CVitAI/docs/Security.md)
- [Deployment Walkthrough (docs/Deployment.md)](file:///C:/Users/J.N.PATHAK/CVitAI/docs/Deployment.md)
