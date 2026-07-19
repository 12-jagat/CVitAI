# Production Deployment Guide

This guide details instructions to deploy **ResumeIQ AI** to cloud environments:
- **Frontend** → Vercel
- **Backend API** → Render
- **Database** → MongoDB Atlas

---

## 1. MongoDB Atlas Database Setup

1. Sign up on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new shared cluster (Free Tier) in your preferred region.
3. Add a database user with read/write permissions. Keep the password secure.
4. Set up Network Access:
   - For initial deployment, configure IP Access List to allow access from anywhere `0.0.0.0/0` (since Render IP addresses are dynamic).
5. Retrieve the connection URI (Connection String):
   - Choose "Connect your application" and copy the MONGODB_URI. Replace `<password>` with your database user's password.

---

## 2. Backend Deployment on Render

1. Create a free account on [Render](https://render.com).
2. Open the dashboard and click **New +** → **Blueprint**.
3. Link your GitHub repository.
4. Render will parse the [render.yaml](file:///C:/Users/J.N.PATHAK/CVitAI/render.yaml) file and auto-configure a node web service named `resumeiq-backend`.
5. Enter the following Environment Variables in the Render dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas URI.
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `CLIENT_URL`: The URL of your Vercel deployment (once available, e.g. `https://resumeiq-ai.vercel.app`).
6. Deploy the web service. Render will download dependencies, compile TypeScript, and launch the server. Note down your backend URL (e.g. `https://resumeiq-backend.onrender.com`).

---

## 3. Frontend Deployment on Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** → **Project** and import your repository.
3. Configure the Project Settings:
   - **Root Directory**: Select `frontend` (crucial since Next.js resides in the folder).
   - **Framework Preset**: Next.js (detected automatically).
4. Enter the Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://resumeiq-backend.onrender.com/api`).
5. Click **Deploy**. Vercel will build the frontend assets.
6. Once deployed, copy your Vercel application URL and update the `CLIENT_URL` environment variable in your Render backend settings so CORS and HTTP-only cookies align.
