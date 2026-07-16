# Christ Revolution Movement (CRM) — Central Command

> Disciple 2 Billion Souls by 2033

A global Pentecostal, Evangelical, and Charismatic Jesus movement web platform — built with Python FastAPI, Supabase, and modern front-end.

## 🏗 Architecture

- **Backend:** Python 3.11 + FastAPI
- **Database/Auth:** Supabase (Postgres + Row-Level Security)
- **Frontend:** Vanilla HTML/CSS/JS (Jinja2 templates)
- **Hosting:** Render (web service)
- **Video:** HLS adaptive streaming via CDN
- **Payments:** Stripe (cards), M-Pesa, PayPal, Bank Transfer

## 🚀 Quick Start

### 1. Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Run `database/schema.sql` in the SQL Editor
3. Copy your **Project URL** and **service_role key**

### 2. Local Development
```bash
pip install -r backend/requirements.txt
export SUPABASE_URL="https://xxx.supabase.co"
export SUPABASE_SERVICE_KEY="eyJ..."
cd backend && uvicorn main:app --reload