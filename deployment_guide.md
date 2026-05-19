# Deployment Guide: Render, Netlify, and Supabase

Follow these steps to deploy the Crestcode application to production.

---

## 1. Database Setup (Supabase)
1.  **Create a New Project** on [Supabase](https://supabase.com).
2.  **Get Connection String**:
    *   Go to **Project Settings > Database**.
    *   Find the **Connection string** section.
    *   Select **Transaction Mode** (Port 6543) – this is critical for the connection pooling we've configured.
    *   Copy the URI (e.g., `postgresql://postgres.[ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`).
3.  **Run Initial Schema**: Ensure your tables (`content`, `talent_submissions`, `contact_submissions`, etc.) are created in the Supabase SQL Editor.

---

## 2. Backend Deployment (Render)
1.  **Create a New Web Service** on Render.
2.  **Connect Repository**: Connect your GitHub/GitLab repo.
3.  **Configure Settings**:
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r backend/requirements.txt`
    *   **Start Command**: `gunicorn backend:app`
4.  **Environment Variables**:
    *   `POSTGRES_URI`: The connection string from Supabase.
    *   `G_SECRET_KEY`: A strong random string for JWT/Sessions.
    *   `RESEND_API_KEY`: Your Resend API key for emails.
    *   `FLASK_ENV`: `production`

---

## 3. Frontend Deployment (Netlify)
1.  **Create a New Site** on Netlify and link your repo.
2.  **Configure Build Settings**:
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `out` (Since `next.config.js` is set to `output: 'export'`)
3.  **Environment Variables** (IMPORTANT: Set these *before* building):
    *   `NEXT_PUBLIC_DOCKLY_API_URL`: The URL of your Render backend (e.g., `https://your-app.onrender.com/server/api`).
    *   *Note: These are baked into the static files during build.*

---

## 4. Critical Checklist
- [ ] **Supabase Pooling**: Ensure you are using the **Transaction Mode** connection string (port 6543) to avoid "Server closed connection" errors.
- [ ] **CORS**: The backend currently allows all origins (`*`). For better security, you can update `backend/website/__init__.py` to specifically allow your Netlify URL once deployed.
- [ ] **trailing-slash**: The API service in `services/api.ts` automatically handles trailing slashes, so don't worry about including them in the env variable.

---

## Troubleshooting
- **API Connection Errors**: Check the Netlify build logs to ensure `NEXT_PUBLIC_DOCKLY_API_URL` was correctly detected during the `next build` step.
- **Database Timeouts**: If Render fails to connect, verify that your Supabase project isn't paused and that the IP whitelist (if enabled) allows Render's outbound IPs (Render usually recommends allowing `0.0.0.0/0` for Supabase).
