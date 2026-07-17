# 🚀 Quick Start Guide - Christ Revolution Movement

## Welcome! Get your CRM platform running in 10 minutes.

---

## ✅ Prerequisites

Before you begin, make sure you have:
- [ ] Python 3.11+ installed ([Download](https://www.python.org/downloads/))
- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] Supabase account ([Sign up free](https://supabase.com))
- [ ] Git installed

---

## 🎯 Step 1: Clone & Setup (2 min)

### Windows
```cmd
cd c:\Users\user\Desktop\christ-revolution-movement
setup.bat
```

### Linux/Mac
```bash
cd ~/christ-revolution-movement
chmod +x setup.sh
./setup.sh
```

---

## 🗄️ Step 2: Setup Supabase Database (3 min)

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a name: `crm-2033`
4. Wait 2 minutes for project creation

### 2.2 Run Database Schema
1. In Supabase dashboard, click **SQL Editor**
2. Open file: `database/schema.sql`
3. Copy ALL content
4. Paste into SQL Editor
5. Click **Run**
6. Wait for "Success" message

### 2.3 Get API Credentials
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **service_role key** (NOT anon key!)

### 2.4 Update Environment File
Edit `.env` file in project root:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...your-service-role-key
SESSION_SECRET=any-random-string-here
ENVIRONMENT=development
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

---

## 🎬 Step 3: Start Backend (2 min)

### Open Terminal 1 - Backend

#### Windows
```cmd
cd backend
..\venv\Scripts\activate
python app.py
```

#### Linux/Mac
```bash
cd backend
source ../venv/bin/activate
python app.py
```

✅ Backend running at: **http://localhost:8000**
✅ API docs at: **http://localhost:8000/api/docs**

---

## 🎨 Step 4: Start Frontend (2 min)

### Open Terminal 2 - Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at: **http://localhost:3000**

---

## 🧪 Step 5: Test Everything (1 min)

### Create Test Stream (Optional)

In Supabase SQL Editor, run:

```sql
INSERT INTO live_streams (
  title,
  description,
  stream_url,
  thumbnail_url,
  status,
  viewer_count,
  speaker,
  started_at
) VALUES (
  'Sunday Service - LIVE',
  'Join us for worship and teaching!',
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://image.mux.com/x36xhzz/thumbnail.jpg',
  'live',
  0,
  'Pastor John Doe',
  NOW()
);
```

### Test the App

1. **Visit**: http://localhost:3000
2. **Click**: "Join Now" (Register)
3. **Fill form** and create account
4. **Go to**: Live page
5. **Click stream** to watch with live chat!

---

## 🎉 You're Done!

Your CRM platform is now running with:
- ✅ Modern React frontend
- ✅ Flask API backend
- ✅ Real-time WebSocket chat
- ✅ YouTube-style live streaming
- ✅ Supabase database

---

## 📱 What You Can Do Now

### As a User:
- ✅ Register and login
- ✅ Watch live streams
- ✅ Comment in real-time
- ✅ React with emojis (👍 ❤️ 🙏 🔥)
- ✅ Submit prayer requests
- ✅ View member portal
- ✅ Track engagement score

### Test Features:
1. **Live Streaming**: Go to `/live` and click a stream
2. **Prayer Wall**: Go to `/prayer-wall` and share a request
3. **Portal**: Go to `/portal` to see your dashboard
4. **Real-time Chat**: Open stream in 2 browser tabs and comment

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version (should be 3.11+)
python --version

# Reinstall dependencies
pip install -r backend/requirements.txt
```

### Frontend won't start
```bash
# Clear node modules
rm -rf node_modules
npm install

# Or on Windows
rmdir /s /q node_modules
npm install
```

### Database connection error
- Verify `SUPABASE_URL` is correct (starts with https://)
- Use `service_role` key, NOT `anon` key
- Check Supabase project is not paused

### Live stream not playing
- URL must be HLS format (.m3u8)
- Use test stream: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`

---

## 🚀 Next Steps

### Ready to Deploy?
See **DEPLOYMENT.md** for:
- Deploying to Render (recommended)
- GitHub setup
- Production configuration
- Custom domain setup

### Want to Customize?
See **UPDATED_README.md** for:
- Adding features
- Customizing UI/colors
- API documentation
- WebSocket events

---

## 🆘 Need Help?

- **Documentation**: Read `TROUBLESHOOTING.md`
- **API Reference**: Read `API_DOCUMENTATION.md`
- **GitHub Issues**: Report bugs
- **Email**: support@christrevolution.org

---

## 🎯 Quick Commands Reference

### Start Development
```bash
# Terminal 1 - Backend
cd backend && python app.py

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Build for Production
```bash
# Build frontend
cd frontend && npm run build

# Run production backend
cd backend && gunicorn --worker-class eventlet -w 1 app:app
```

### Database
```bash
# View in Supabase dashboard
# Settings → Database → Tables
```

---

**You're all set! Happy coding! 🙏**

*Built for the Kingdom | CRM 2033*
