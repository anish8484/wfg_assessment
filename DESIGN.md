# System Design & Architecture

## Overview
The system is composed of two independent services: a Transaction Processing Service (Backend) and an Analytics Dashboard (Frontend).

## Backend Design

### Architecture
Layered architecture:
- **Router Layer**: FastAPI endpoints (`main.py`).
- **Service/Logic Layer**: Background task handlers.
- **Data Layer**: SQLAlchemy ORM models (`models.py`) + SQLite.

### Transaction Flow
1. **Webhook Receipt**: `POST /v1/webhooks/transactions`
   - Validates payload.
   - Checks Idempotency (query DB for `transaction_id`).
   - Saves `RECEIVED` status.
   - **Returns 202 Accepted immediately**.
   - Spawns Background Task.
2. **Background Processing**:
   - Waits 30 seconds.
   - Updates status to `PROCESSED`.
   - Records `processed_at`.

### Idempotency
Implemented by checking the primary key `transaction_id` before insertion. Duplicate requests return a success message (202) but trigger no new actions.

## Frontend Design

### Architecture
Start React SPA.
- **Components**:
  - `Dashboard`: Main container.
  - `AnalyticsChart`: Reusable chart component.
  - `OverrideModal`: Form to user input.
- **State Management**: React `useState` + `useEffect`.
- **Persistence**: Supabase Client.

### Data Flow
1. **Load**: App loads dummy data for charts.
2. **User Interaction**: Click "Edit" on a chart.
3. **Capture**: Modal asks for Email + New Value.
4. **Persist**: 
   - Check Supabase for existing overrides for this email.
   - If exists -> Confirm overwrite.
   - Save -> Update local state & Supabase.

## Styling
Premium Dark Mode aesthetics using TailwindCSS:
- Deep grays/blacks (`bg-slate-900`)
- Gradient accents.
- Translucent cards (Glassmorphism).
