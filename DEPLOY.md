# FREE Deployment Guide

## 1. Frontend (Vercel)
**Free Tier:** Best for React/Vite/Next.js apps.

1.  **Push to GitHub**: Ensure your code is on GitHub.
2.  **Go to [Vercel](https://vercel.com/new)**.
3.  Import your Repository.
4.  **Edit Project Settings**:
    *   **Root Directory**: Select `frontend`.
    *   **Framework**: It should auto-detect `Vite`.
5.  **Environment Variables**:
    *   `VITE_API_URL`: The URL of your deployed Backend (see below).
    *   `VITE_SUPABASE_URL`: (Optional) Your Supabase URL.
    *   `VITE_SUPABASE_ANON_KEY`: (Optional) Your Supabase Key.
6.  Click **Deploy**.

---

## 2. Backend (Render)
**Free Tier:** "Web Services" allow Python apps with background tasks.

1.  **Go to [Render Dashboard](https://dashboard.render.com/)**.
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub Repository.
4.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables**:
    *   `PYTHON_VERSION`: `3.9.0` (Recommended)
    *   `DATABASE_URL`: (Optional) Connection string for PostgreSQL if you want persistence.
6.  Click **Create Web Service**.

> **Note**: The Render free tier spins down after inactivity. The first request might take 50s+ to wake up. This is normal for free tiers.

---

## 3. Database (Supabase / Neon) - Optional
If you want the data to persist properly on the Cloud:

1.  Create a Free Project on [Supabase.com](https://supabase.com).
2.  Get the **Connection String** (Transaction Pooler is best for serverless, but Session mode works for this persistent server).
3.  Add `DATABASE_URL` to your **Render Environment Variables**.
