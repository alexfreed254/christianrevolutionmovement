# 🚀 Manual Render Setup Guide

If you're setting up the service manually (not using Blueprint), follow these exact steps.

---

## ✅ Step-by-Step Configuration

### 1. Create New Web Service

1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click **New +** → **Web Service**
3. Connect your GitHub account (if not already)
4. Select repository: `christianrevolutionmovement`

### 2. Configure Basic Settings

**Name**: `crm-central-command`

**Region**: Oregon (US West)

**Branch**: `main`

**Root Directory**: Leave blank (use root)

**Runtime**: `Python 3`

### 3. Build & Start Commands

**Build Command**:
```bash
bash build.sh
```

**Start Command**:
```bash
cd backend && gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:$PORT app:app
```

### 4. Environment Variables

Click **Advanced** → Add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | `eyJhbGc...` | Your service_role key (NOT anon key) |
| `SESSION_SECRET` | Auto-generate | Click "Generate" button |
| `ENVIRONMENT` | `production` | |
| `ALLOWED_ORIGINS` | `*` | Change to your domain later |

### 5. Plan Selection

- **Free Plan**: Service sleeps after 15 min (for testing)
- **Starter Plan**: $7/month (recommended for production)

### 6. Health Check

**Health Check Path**: `/api/health`

---

## 📊 What Will Happen During Build

```bash
✅ Cloning repository
✅ Using Python 3.11.8
✅ Running: bash build.sh
   ├─ Installing Python dependencies
   ├─ Installing Node dependencies
   └─ Building React app
✅ Build succeeded!
✅ Starting Gunicorn with eventlet
✅ Server listening on port 10000
✅ Health check passed
✅ Deploy live!
```

---

## 🔍 Troubleshooting

### Build Fails: "build.sh: Permission denied"

Render should auto-detect bash scripts. If not, try:

**Build Command**:
```bash
chmod +x build.sh && bash build.sh
```

### Build Fails: "npm: command not found"

Render provides Node.js automatically. Just wait, it installs in the background.

### Build Succeeds but App Crashes

**Check Start Command is exactly**:
```bash
cd backend && gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:$PORT app:app
```

### Import Errors

Make sure `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set in environment variables.

---

## 🎯 Alternative: Use Blueprint (Easier!)

Instead of manual setup, use Blueprint which reads `render.yaml`:

1. Click **New +** → **Blueprint**
2. Select repository: `christianrevolutionmovement`
3. Render auto-configures from `render.yaml`
4. Just add environment variables
5. Click **Apply**
6. Done! ✅

---

## 📝 After Successful Deployment

### 1. Get Your App URL

Render will give you a URL like:
```
https://crm-central-command.onrender.com
```

### 2. Test It

Visit these URLs:

- Homepage: `https://your-app.onrender.com/`
- Health: `https://your-app.onrender.com/api/health`
- API Docs: Coming soon

### 3. Setup Supabase

If not done already:

1. Go to Supabase dashboard
2. SQL Editor → Run `database/schema.sql`
3. Verify tables created

### 4. Create Test Stream

In Supabase SQL Editor:

```sql
INSERT INTO live_streams (
  title,
  description,
  stream_url,
  thumbnail_url,
  status,
  speaker,
  started_at
) VALUES (
  '🔴 Sunday Service - LIVE',
  'Join us for worship and powerful teaching!',
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://image.mux.com/x36xhzz/thumbnail.jpg',
  'live',
  'Pastor John Doe',
  NOW()
);
```

### 5. Test Your App

1. Register new account
2. Login
3. Go to Live page
4. Click the stream
5. Test commenting
6. Test reactions (👍 ❤️ 🙏 🔥)

---

## 🔒 Security: Update CORS

After testing, update `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=https://your-app.onrender.com,https://yourdomain.com
```

---

## 📈 Monitoring

### View Logs

Dashboard → Your Service → **Logs** tab

Watch for:
```
[INFO] Starting gunicorn
[INFO] Booting worker with eventlet
[INFO] Application startup complete
```

### Metrics

Dashboard → Your Service → **Metrics** tab

Monitor:
- CPU usage
- Memory usage
- Response times
- Request count

---

## 🆘 Still Having Issues?

### Check These Files Exist in Repo:

- ✅ `requirements.txt` (in root)
- ✅ `backend/requirements.txt`
- ✅ `build.sh`
- ✅ `.python-version` (contains `3.11.8`)
- ✅ `render.yaml`
- ✅ `backend/app.py`
- ✅ `frontend/package.json`

### Verify Repository

Go to GitHub:
https://github.com/alexfreed254/christianrevolutionmovement

Make sure all files are there.

### Contact Support

If still stuck:
1. Render Support: https://render.com/support
2. GitHub Issues: Create an issue in your repo
3. Check Render status: https://status.render.com/

---

## ✅ Success Checklist

- [ ] Repository connected to Render
- [ ] Build command: `bash build.sh`
- [ ] Start command: `cd backend && gunicorn...`
- [ ] Environment variables set
- [ ] Python 3.11.8 detected
- [ ] Build succeeds
- [ ] Health check passes
- [ ] App accessible at Render URL
- [ ] Can register/login
- [ ] Live streaming works

---

**Once everything works, share your live URL! 🎉**

*Built for the Kingdom | CRM 2033*
