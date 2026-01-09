# WFG Full Stack Developer Assessment

This repository contains the solution for the Full Stack Developer Assessment, featuring a Python FastAPI backend for transaction processing and a React+TypeScript frontend for call analytics.

## Project Structure

```text
wfg_assessment/
├── backend/                 # Python FastAPI Service
│   ├── main.py             # Entry point & API endpoints
│   ├── models.py           # Database models (SQLAlchemy)
│   ├── schemas.py          # Pydantic data schemas
│   ├── database.py         # DB connection & Session management
│   └── requirements.txt    # Python dependencies
│
├── frontend/                # React + Vite Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx  # Main Analytics Dashboard (Recharts)
│   │   │   └── EditModal.tsx  # Modal for overwriting data
│   │   ├── lib/
│   │   │   └── supabase.ts    # Supabase client configuration
│   │   └── index.css          # TailwindCSS Global Styles
│   └── tailwind.config.js   # Tailwind Configuration
│
├── docker-compose.yml       # Container orchestration
├── DEPLOY.md               # Detailed Cloud Deployment Guide
├── DESIGN.md               # Architecture & Design decisions
└── test_backend.py         # Automated Backend Test Script
```

## Deployment

> **[📄 Read the DETAILED CLOUD DEPLOYMENT GUIDE (DEPLOY.md)](./DEPLOY.md)** -- Covers Vercel (Frontend) and Render (Backend) setup.

## Prerequisites

- Python 3.9+
- Node.js 16+
- Docker & Docker Compose (optional, for containerized run)

## Quick Start (Local)

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`.
Docs: `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```
The App will be available at `http://localhost:5173`.

## Technical Choices

### Backend
- **FastAPI**: Chosen for its high performance, automatic validation (Pydantic), and built-in support for asynchronous background tasks, fulfilling the <500ms response requirement easily.
- **SQLite**: Used for simplicity in this assessment. For production, the code is structured to easily switch to PostgreSQL via connection string.
- **BackgroundTasks**: Native FastAPI background tasks used to handle the 30s processing delay without blocking the request.

### Frontend
- **React + Vite**: Modern, fast build tooling.
- **TailwindCSS**: For rapid, premium "dark mode" styling.
- **Recharts**: For the analytics visualization.
- **Supabase**: Used for persisting user overwrites.

## Deployment

A `docker-compose.yml` is provided for orchestration.

```bash
docker-compose up --build
```
