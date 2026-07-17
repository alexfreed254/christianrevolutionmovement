# 🚀 Render Deployment Guide - Christ Revolution Movement

## ⚠️ CRITICAL FIXES APPLIED

### Issue 1: Eventlet Monkey Patch Error ✅ FIXED
**Error:** `RuntimeError: Working outside of application context` and `16 RLock(s) were not greened`

**Root Cause:** Flask-JWT-Extended was being imported at the top level, which created Flask context objects before eventlet could patch them.

**Solution Applied:**
- Moved `eventlet.monkey_patch()` to be ABSOLUTE FIRST in `backend/app.py`
- Moved JWT imports AFTER Flask app initialization
- No other imports before eventlet

### Issue 2: Package.json Typo ✅ FIXED
**Error:** Invalid JSON in `frontend/package.json`

**Root Cause:** Line had `"lucide-react": "^0.index": "0.334.0"` (malformed)

**Solution Applied:**
- Fixed to: `"lucide-react": "^0.334.0"`

### Issue 3: Enhanced Build Script ✅ IMPROVED
**Issue:** Build failures were not clearly logged

**Solution Applied:**
- Added comprehensive logging with step-by-step output
- Added verification checks at each stage
- Added fallback to `npm install` if `npm ci` fails
- Added `--legacy-peer-deps` flag to handle dependency conflicts

---

## 📋 Pre-Deployment Checklist

Before pushing to GitHub and deploying to Render:

- [x] Python dependencies in `requirements.txt` (root + backend)
- [x] `.python-version` file with `3.11.8`
- [x] `build.sh` with enhanced logging
- [x] `render.yaml` configured correctly
- [x] Eventlet monkey_patch() at top of `backend/app.py`
- [x] No FastAPI imports in any files
- [x] Frontend `package.json` has valid JSON
- [x] Environment variables documented

---

## 🔧 Deployment Steps

### Step 1: Push to GitHub

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "fix: resolve eventlet monkey patch error and package.json typo"

# Push to main branch
git push origin main
```

### Step 2: Monitor Render Build

1. Go to https://dashboard.render.com
2. Click on your service: **crm-central-command**
3. Click **Manual Deploy** → **Deploy latest commit**
4. Watch the logs carefully

### Step 3: Check Build Logs

Look for these SUCCESS indicators:

```
✅ Python dependencies installed
✅ Frontend directory exists
✅ package.json found
✅ Node dependencies installed
✅ Build command completed
✅ build/ directory exists
✅ index.html found
✅ BUILD SUCCESSFUL!
```

---

## 🐛 Troubleshooting Common Errors

### Error: "No module named 'fastapi'"
**Status:** ✅ FIXED (removed FastAPI from auth.py)

### Error: "eventlet monkey patch error"
**Status:** ✅ FIXED (moved imports after monkey_patch)

### Error: "Frontend not built"
**Possible Causes:**
1. **Build failed silently** - Check build logs for NPM errors
2. **Memory limit exceeded** - Render free tier has 512MB RAM
3. **Node version mismatch** - Render uses Node 20.x by default

**Solutions:**
```bash
# Option A: Upgrade Render plan for more memory
# Go to Settings → Change Plan → Starter ($7/mo)

# Option B: Build locally and commit (NOT RECOMMENDED)
cd frontend
npm install
npm run build
git add -f frontend/build/
git commit -m "Add pre-built frontend"
git push
```

### Error: "Cannot find module 'lucide-react'"
**Status:** ✅ FIXED (fixed package.json typo)

### Error: "npm ci failed"
**Solution:** Build script now has automatic fallback to `npm install --legacy-peer-deps`

---

## 🌐 Environment Variables in Render

Make sure these are set in Render Dashboard → Environment:

| Variable | Value | Notes |
|----------|-------|-------|
| `SUPABASE_URL` | `https://xxx.supabase.co` | From Supabase dashboard |
| `SUPABASE_SERVICE_KEY` | `eyJxxx...` | Service role key (keep secret!) |
| `SESSION_SECRET` | Auto-generated | Render will generate |
| `ENVIRONMENT` | `production` | Already set in render.yaml |
| `ALLOWED_ORIGINS` | `*` | Or specific domains |
| `PORT` | Auto | Render sets automatically |

---

## 📊 Verify Deployment Success

### 1. Health Check
```bash
curl https://christianrevolutionmovement.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "CRM Central Command",
  "time": "2026-07-17T12:00:00.000000"
}
```

### 2. Frontend Check
Visit: https://christianrevolutionmovement.onrender.com

Should show the React app with:
- ✅ Navbar with logo and navigation
- ✅ Home page with hero section
- ✅ No "Frontend not built" error

### 3. WebSocket Check
Open browser console and check for:
```
Socket.IO connected
```

---

## 🔍 Reading Render Logs

### Build Logs (What You Need)
1. Go to Render Dashboard
2. Click your service
3. Click **Logs** tab
4. Look for section starting with: `==> Running build command 'bash build.sh'...`
5. Scroll through to find errors

### Runtime Logs (After Build)
These show the server starting:
```
==> Running 'cd backend && gunicorn --worker-class eventlet -w 1...'
[INFO] Starting gunicorn 21.2.0
[INFO] Listening at: http://0.0.0.0:10000
```

---

## 🆘 If Deployment Still Fails

### Share These Logs With Me:

1. **Full Build Log** starting from:
   ```
   ==> Running build command 'bash build.sh'...
   ```

2. **Any Error Messages** like:
   - `npm ERR!`
   - `ERROR:`
   - `ModuleNotFoundError:`
   - `Build failed`

3. **Runtime Errors** (if build succeeds):
   - The first 50 lines after `==> Your service is live`
   - Any 503 errors or exceptions

### Quick Commands to Test Locally:

```bash
# Test Python imports
cd backend
python -c "import eventlet; eventlet.monkey_patch(); from app import app; print('✅ OK')"

# Test frontend build
cd frontend
npm install --legacy-peer-deps
npm run build
ls -la build/index.html  # Should exist
```

---

## 🎯 Expected Final State

### After successful deployment:

1. ✅ Backend running on: `https://christianrevolutionmovement.onrender.com/api/health`
2. ✅ Frontend served at: `https://christianrevolutionmovement.onrender.com`
3. ✅ WebSockets working for live streaming
4. ✅ No eventlet errors in logs
5. ✅ All API endpoints responding correctly

### Test All Features:

- [ ] Home page loads with animations
- [ ] Register/Login works
- [ ] Live streaming page loads
- [ ] Prayer wall displays requests
- [ ] Giving page shows payment options
- [ ] Locations page shows map
- [ ] Media page shows videos

---

## 📞 Support

If you encounter issues:

1. **Check Render Status**: https://status.render.com
2. **Review Build Logs**: Render Dashboard → Logs
3. **Test Locally**: Run `bash build.sh` locally to see if it passes
4. **Share Logs**: Copy the exact error message

---

## ✅ Current Status

**Last Updated:** July 17, 2026

- [x] Eventlet monkey patch error FIXED
- [x] Package.json typo FIXED
- [x] Build script enhanced with detailed logging
- [x] FastAPI imports removed
- [x] Supabase v2.9.0 configured
- [x] Flask + SocketIO + Gunicorn with eventlet
- [ ] **NEXT:** Push to GitHub and monitor build logs

**Ready to deploy!** 🚀
