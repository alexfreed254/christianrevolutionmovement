# Troubleshooting Guide

Common issues and their solutions for the Christ Revolution Movement platform.

---

## 🔧 Installation Issues

### Python Not Found

**Error:** `'python' is not recognized as an internal or external command`

**Solution:**
1. Install Python 3.11+ from [python.org](https://www.python.org/downloads/)
2. During installation, check "Add Python to PATH"
3. Restart terminal/command prompt
4. Verify: `python --version`

### pip Install Fails

**Error:** Various errors during `pip install -r backend/requirements.txt`

**Solutions:**

1. **Upgrade pip:**
   ```bash
   python -m pip install --upgrade pip
   ```

2. **Use virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. **Install build tools (Windows):**
   - Download: [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

4. **Install system dependencies (Linux):**
   ```bash
   sudo apt-get update
   sudo apt-get install python3-dev build-essential
   ```

---

## 🗄️ Database Issues

### Cannot Connect to Supabase

**Error:** Connection refused or timeout errors

**Solutions:**

1. **Check environment variables:**
   ```bash
   # Verify .env file
   cat .env  # Linux/Mac
   type .env # Windows
   ```

2. **Verify URL format:**
   - Correct: `https://xxxxx.supabase.co`
   - Wrong: `xxxxx.supabase.co` (missing https://)

3. **Check API key:**
   - Use `service_role` key (not `anon` key)
   - Get from: Supabase → Settings → API

4. **Verify Supabase project is active:**
   - Free tier projects pause after inactivity
   - Visit Supabase dashboard to wake up

### Schema Errors

**Error:** Table doesn't exist or column not found

**Solutions:**

1. **Re-run schema:**
   - Go to Supabase → SQL Editor
   - Copy entire `database/schema.sql`
   - Click "Run"

2. **Check for errors in SQL output**

3. **Verify tables exist:**
   - Supabase → Table Editor
   - Should see: members, sessions, attendance, etc.

### Row Level Security (RLS) Issues

**Error:** Permission denied or 403 errors

**Solutions:**

1. **Use service_role key** (bypasses RLS):
   - Not the `anon` key

2. **Check RLS policies:**
   ```sql
   -- Disable RLS temporarily for testing
   ALTER TABLE members DISABLE ROW LEVEL SECURITY;
   ```

3. **Re-enable with proper policies:**
   - See `database/schema.sql` for policies

---

## 🚀 Server Issues

### Server Won't Start

**Error:** Various errors when running `uvicorn main:app --reload`

**Solutions:**

1. **Check working directory:**
   ```bash
   # Must be in backend directory
   cd backend
   uvicorn main:app --reload
   ```

2. **Check for syntax errors:**
   ```bash
   python main.py
   # Should show syntax errors if any
   ```

3. **Verify imports:**
   ```bash
   python -c "from supabase_client import supabase"
   # Should not error
   ```

4. **Check port availability:**
   ```bash
   # Windows
   netstat -ano | findstr :8000
   
   # Linux/Mac
   lsof -i :8000
   ```
   - If port is in use, kill process or use different port:
     ```bash
     uvicorn main:app --reload --port 8001
     ```

### Static Files Not Loading

**Error:** 404 errors for CSS, JS, images

**Solutions:**

1. **Check file paths:**
   - Ensure `frontend/static/` directory exists
   - Verify subdirectories: `css/`, `js/`, `img/`

2. **Check server is serving static files:**
   - Visit: http://localhost:8000/static/css/style.css
   - Should load CSS file

3. **Verify mount path in main.py:**
   ```python
   app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
   ```

### Template Errors

**Error:** Template not found

**Solutions:**

1. **Check templates directory:**
   - Ensure `frontend/templates/` exists
   - Verify HTML files are present

2. **Check Jinja2 configuration:**
   ```python
   templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
   ```

---

## 🔐 Authentication Issues

### Cannot Register

**Error:** Registration fails

**Solutions:**

1. **Check password requirements:**
   - Minimum length (implementation dependent)
   - No special character restrictions

2. **Verify unique constraints:**
   - Username must be unique
   - Email must be unique
   - Check Supabase table for duplicates

3. **Check database connection:**
   - Verify Supabase credentials
   - Check console for errors

### Cannot Login

**Error:** Invalid credentials or 401 errors

**Solutions:**

1. **Verify credentials:**
   - Check username (case-sensitive)
   - Check password (case-sensitive)

2. **Check session table:**
   ```sql
   SELECT * FROM sessions ORDER BY created_at DESC;
   ```

3. **Clear old sessions:**
   ```sql
   DELETE FROM sessions WHERE expires_at < NOW();
   ```

4. **Reset password (if needed):**
   - Currently no reset feature
   - Manually update in database or re-register

### Session Expired

**Error:** 401 Unauthorized after some time

**Solutions:**

1. **Normal behavior:**
   - Sessions expire after 30 days
   - Login again

2. **Check session expiration:**
   ```sql
   SELECT expires_at FROM sessions WHERE token = 'your-token';
   ```

3. **Extend session (if needed):**
   ```sql
   UPDATE sessions 
   SET expires_at = NOW() + INTERVAL '30 days'
   WHERE member_id = 'your-member-id';
   ```

---

## ☁️ Render Deployment Issues

### Build Fails

**Error:** Build command failed

**Solutions:**

1. **Check build logs:**
   - Render Dashboard → Your Service → Logs

2. **Verify requirements.txt:**
   - Ensure all packages have versions
   - No typos in package names

3. **Check Python version:**
   - Ensure `runtime.txt` has: `python-3.11.8`

4. **Verify build command:**
   - Should be: `pip install -r backend/requirements.txt`

### Deploy Succeeds but Site Won't Load

**Error:** Service running but 502 errors

**Solutions:**

1. **Check start command:**
   - Should be: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2`
   - Note: `$PORT` is provided by Render

2. **Check environment variables:**
   - All required variables set
   - No typos in variable names

3. **Check application logs:**
   - Look for Python errors
   - Check for missing dependencies

4. **Verify health check:**
   - Should be: `/api/health`
   - Test locally first

### Environment Variables Not Working

**Error:** Missing configuration errors

**Solutions:**

1. **Verify in Render dashboard:**
   - Service → Environment
   - Check all variables are set

2. **No spaces in values:**
   - Wrong: `SUPABASE_URL = https://...`
   - Right: `SUPABASE_URL=https://...`

3. **Save and redeploy:**
   - After changing env vars
   - Click "Save Changes"
   - May need to manually redeploy

---

## 🐛 Common Errors

### ImportError: No module named 'X'

**Solution:**
```bash
pip install X
# or
pip install -r backend/requirements.txt
```

### 500 Internal Server Error

**Solutions:**

1. **Check application logs**
2. **Add error handling:**
   ```python
   try:
       # your code
   except Exception as e:
       print(f"Error: {e}")
   ```
3. **Enable debug mode locally:**
   ```python
   if __name__ == "__main__":
       uvicorn.run(app, host="0.0.0.0", port=8000, debug=True)
   ```

### CORS Errors

**Error:** Browser console shows CORS policy errors

**Solutions:**

1. **Check ALLOWED_ORIGINS:**
   ```env
   ALLOWED_ORIGINS=http://localhost:8000,https://your-app.onrender.com
   ```

2. **Verify CORS middleware:**
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=ALLOWED_ORIGINS,
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

---

## 💡 Performance Issues

### Slow Page Loads

**Solutions:**

1. **Check database queries:**
   - Add indexes (see schema.sql)
   - Optimize SELECT statements

2. **Enable caching (future):**
   - Use Redis for session caching
   - Cache API responses

3. **Use CDN for static files (future):**
   - CloudFlare, AWS CloudFront

### High Memory Usage

**Solutions:**

1. **Reduce Uvicorn workers:**
   ```bash
   uvicorn main:app --workers 1
   ```

2. **Upgrade Render plan:**
   - Starter plan ($7/mo) has more resources

---

## 📱 Browser-Specific Issues

### Works in Chrome but not Safari

**Solutions:**

1. **Check console errors**
2. **Update JavaScript:**
   - Avoid newer ES features
   - Use polyfills if needed
3. **Test CSS compatibility:**
   - Use autoprefixer

---

## 🆘 Still Need Help?

1. **Check logs:**
   - Application logs
   - Render logs
   - Supabase logs
   - Browser console

2. **Search GitHub Issues:**
   - Someone may have had the same problem

3. **Open an Issue:**
   - Include error messages
   - Include steps to reproduce
   - Include environment details

4. **Contact Support:**
   - Email: support@christrevolution.org
   - Include relevant logs and screenshots

---

## 🔍 Debugging Tips

### Enable Verbose Logging

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Test API Endpoints

```bash
# Using curl (Linux/Mac/Windows with Git Bash)
curl -X GET http://localhost:8000/api/health

# Using PowerShell (Windows)
Invoke-WebRequest -Uri http://localhost:8000/api/health
```

### Check Database Directly

```sql
-- Check member count
SELECT COUNT(*) FROM members;

-- Check recent activity
SELECT * FROM attendance ORDER BY attended_at DESC LIMIT 10;

-- Check sessions
SELECT COUNT(*), 
       COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active
FROM sessions;
```

---

*"In all your ways acknowledge Him, and He will make straight your paths."* - Proverbs 3:6
