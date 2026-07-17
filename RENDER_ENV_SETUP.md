# 🔧 Fix "Connection Failed" - Set Supabase Environment Variables on Render

## 🎯 **Problem:**
Registration and Login are failing with "Database connection failed" because **Render doesn't have your Supabase credentials**.

Your local `.env` file has them, but Render needs them configured separately!

---

## ✅ **Solution: Add Environment Variables to Render**

### **Step 1: Go to Render Dashboard**
Visit: **https://dashboard.render.com**

### **Step 2: Select Your Service**
Click on: **crm-central-command**

### **Step 3: Open Environment Tab**
Look at the top navigation and click: **"Environment"**

### **Step 4: Add These Environment Variables**

Click **"Add Environment Variable"** for each of these:

#### Variable 1: SUPABASE_URL
```
Key:   SUPABASE_URL
Value: https://wgpvwutqzfxtlpeguhlx.supabase.co
```

#### Variable 2: SUPABASE_SERVICE_KEY
```
Key:   SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndncHZ3dXRxemZ4dGxwZWd1aGx4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIyNTM2OCwiZXhwIjoyMDk5ODAxMzY4fQ.erMXoU_z2PxEl-WD6vQ_9H7YtAvwYiApgHTliljmZ_0
```

#### Variable 3: SESSION_SECRET (if not already set)
```
Key:   SESSION_SECRET
Value: your-super-secret-random-key-here-12345
```

#### Variable 4: ALLOWED_ORIGINS (if not already set)
```
Key:   ALLOWED_ORIGINS
Value: *
```

### **Step 5: Save Changes**
Click **"Save Changes"** button at the bottom

### **Step 6: Wait for Auto-Deploy**
- Render will automatically redeploy your service
- Wait 2-3 minutes for the deployment to complete
- You'll see "Your service is live 🎉"

---

## 🧪 **Test After Setup**

### **Test 1: Check Environment Variables**
1. In Render Dashboard, click **"Shell"** tab
2. Run this command:
```bash
env | grep SUPABASE
```

You should see:
```
SUPABASE_URL=https://wgpvwutqzfxtlpeguhlx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...
```

### **Test 2: Try Registration**
1. Go to: https://christianrevolutionmovement.onrender.com/register
2. Fill out the form:
   - Full Name: Test User
   - Continent: Africa
   - Country: Kenya
   - City: Nairobi
   - Email: test@example.com
   - Phone: +254712345678
   - Username: testuser
   - Password: password123
   - Confirm Password: password123
3. Click **"Join Now"**

### **Expected Result:**
✅ "Registration successful! Welcome to CRM!"  
✅ Redirects to /portal  
✅ You're logged in!

---

## 📋 **Complete Environment Variables Checklist**

Make sure ALL these are set in Render → Environment:

| Variable | Value | Status |
|----------|-------|--------|
| `SUPABASE_URL` | `https://wgpvwutqzfxtlpeguhlx.supabase.co` | ❓ CHECK |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJI...` (long string) | ❓ CHECK |
| `SESSION_SECRET` | Any random string | ❓ CHECK |
| `ENVIRONMENT` | `production` | ✅ Set in render.yaml |
| `ALLOWED_ORIGINS` | `*` | ✅ Set in render.yaml |
| `PORT` | Auto-set by Render | ✅ Auto |

---

## 🔍 **How to Verify It's Working**

### Check Render Logs:
1. Go to Render Dashboard → **crm-central-command**
2. Click **"Logs"** tab
3. Look for startup messages:

#### ❌ **Before Fix (Missing Variables):**
```
ERROR: Missing required environment variables!
Please set SUPABASE_URL and SUPABASE_SERVICE_KEY
```

#### ✅ **After Fix (Variables Set):**
```
[INFO] Starting gunicorn 21.2.0
[INFO] Listening at: http://0.0.0.0:10000
[INFO] Booting worker with pid: 58
```
(No Supabase errors!)

---

## 🎯 **Quick Copy-Paste Format**

For easy copy-paste into Render:

```
SUPABASE_URL=https://wgpvwutqzfxtlpeguhlx.supabase.co

SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndncHZ3dXRxemZ4dGxwZWd1aGx4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIyNTM2OCwiZXhwIjoyMDk5ODAxMzY4fQ.erMXoU_z2PxEl-WD6vQ_9H7YtAvwYiApgHTliljmZ_0

SESSION_SECRET=crm-super-secret-key-2033-revolution

ALLOWED_ORIGINS=*
```

---

## 🔐 **Security Note**

⚠️ **NEVER commit `.env` to Git** (it's already in .gitignore)  
⚠️ **NEVER share your SUPABASE_SERVICE_KEY publicly**  
✅ **Only set it in Render Environment Variables** (secure)

---

## 📸 **Visual Guide**

### Where to Add Variables in Render:

1. **Dashboard** → Click your service
2. **Environment** tab (top navigation)
3. **Add Environment Variable** button
4. Fill in Key and Value
5. Click **Save Changes**

You'll see a list like this:
```
SUPABASE_URL               = https://wgpvwutq...
SUPABASE_SERVICE_KEY       = eyJhbGciOiJI...
SESSION_SECRET             = crm-super-se...
ENVIRONMENT                = production
ALLOWED_ORIGINS            = *
```

---

## 🆘 **Still Not Working?**

If you still get "Connection failed" after setting variables:

### 1. **Verify Variables Are Set**
- Render Dashboard → Environment
- Check each variable is listed
- No typos in variable names

### 2. **Check Render Logs**
- Look for any ERROR messages
- Search for "SUPABASE" in logs
- Check if variables are being loaded

### 3. **Verify Supabase Credentials**
- Go to https://app.supabase.com
- Click your project: wgpvwutqzfxtlpeguhlx
- Settings → API
- Confirm URL and Service Role Key match

### 4. **Force Redeploy**
- Render Dashboard → Manual Deploy
- Click "Clear build cache & deploy"

---

## ✅ **Summary**

**Problem**: Render doesn't have Supabase credentials  
**Solution**: Add `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` to Render Environment  
**Time**: 2 minutes to add, 3 minutes to redeploy  
**Result**: Registration and Login will work!

---

## 🚀 **Next Steps**

1. ✅ Add environment variables to Render
2. ⏳ Wait for auto-redeploy (2-3 minutes)
3. 🧪 Test registration again
4. 🎉 Success!

**Go to Render Dashboard now and add those variables!** 💜
