# Pre-Deployment Checklist

Use this checklist before deploying to production.

## 📋 Local Testing

- [ ] Clone repository and run setup script
- [ ] Install all dependencies without errors
- [ ] Configure `.env` file with test Supabase credentials
- [ ] Run database schema in Supabase SQL Editor
- [ ] Start local server (`uvicorn main:app --reload`)
- [ ] Test health endpoint: http://localhost:8000/api/health
- [ ] Register a test account
- [ ] Login with test account
- [ ] Access member portal
- [ ] Submit attendance check-in
- [ ] Post a prayer request
- [ ] View prayer wall
- [ ] Submit giving record
- [ ] Access admin dashboard (with admin account)
- [ ] Test all API endpoints in Swagger docs

## 🔐 Security Review

- [ ] No credentials in `.env.example`
- [ ] No secrets committed to Git
- [ ] `.gitignore` includes `.env` and sensitive files
- [ ] `SESSION_SECRET` is strong and random
- [ ] `SUPABASE_SERVICE_KEY` is service_role (not anon)
- [ ] CORS `ALLOWED_ORIGINS` configured (not `*` in production)
- [ ] Row Level Security (RLS) enabled in Supabase
- [ ] Password hashing working correctly
- [ ] Session expiration working (30 days)
- [ ] HTTPS enforced (Render does this automatically)

## 🗄️ Database Setup

- [ ] Supabase project created
- [ ] Database schema (`schema.sql`) executed successfully
- [ ] All tables created (check Table Editor)
- [ ] All indexes created
- [ ] Functions created (`increment_pray_count`, etc.)
- [ ] Triggers created (updated_at triggers)
- [ ] RLS policies enabled
- [ ] Test data inserted (optional)
- [ ] Database backups configured

## 📦 GitHub Repository

- [ ] Repository created on GitHub
- [ ] Repository visibility set (public/private)
- [ ] `.gitignore` file present
- [ ] README.md complete and accurate
- [ ] LICENSE file added
- [ ] CONTRIBUTING.md present
- [ ] SECURITY.md present
- [ ] DEPLOYMENT.md present
- [ ] All code committed
- [ ] No sensitive data in commits
- [ ] GitHub Actions workflow configured (optional)

## ☁️ Render Configuration

- [ ] Render account created
- [ ] Repository connected to Render
- [ ] Blueprint or Web Service created
- [ ] Python version set (3.11.8)
- [ ] Build command correct: `pip install -r backend/requirements.txt`
- [ ] Start command correct: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2`
- [ ] Environment variables set:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_KEY`
  - [ ] `SESSION_SECRET`
  - [ ] `ENVIRONMENT=production`
  - [ ] `ALLOWED_ORIGINS` (your domain)
- [ ] Health check path set: `/api/health`
- [ ] Auto-deploy enabled

## 🚀 First Deployment

- [ ] Push code to GitHub main branch
- [ ] Monitor Render build logs
- [ ] Build completes successfully
- [ ] Service starts without errors
- [ ] Health check passes
- [ ] Visit deployed URL
- [ ] Homepage loads correctly
- [ ] Static files load (CSS, JS, images)
- [ ] API documentation accessible: `/api/docs`

## ✅ Post-Deployment Testing

- [ ] Register new account on production
- [ ] Verify email appears in Supabase members table
- [ ] Login with new account
- [ ] Portal page loads
- [ ] Attendance check-in works
- [ ] Prayer requests work
- [ ] Giving form works
- [ ] Media page loads
- [ ] Locations page loads
- [ ] Live streaming page loads
- [ ] Admin dashboard (if admin)
- [ ] All images and assets load
- [ ] Mobile responsiveness

## 📊 Monitoring Setup

- [ ] Render metrics enabled
- [ ] Render logs monitoring
- [ ] Supabase dashboard bookmarked
- [ ] Error tracking setup (Sentry - optional)
- [ ] Uptime monitoring (UptimeRobot - optional)
- [ ] Analytics setup (Google Analytics - optional)

## 🌐 Domain Configuration (Optional)

- [ ] Custom domain purchased
- [ ] DNS records configured
- [ ] Domain added in Render
- [ ] SSL certificate issued
- [ ] Domain resolves correctly
- [ ] HTTPS working
- [ ] Redirect HTTP to HTTPS

## 📧 Communication (Optional)

- [ ] Email service configured (SendGrid/Mailgun)
- [ ] SMS service configured (Twilio)
- [ ] Welcome email template
- [ ] Password reset flow
- [ ] Email verification

## 💳 Payment Integration (Future)

- [ ] Stripe account created
- [ ] Stripe API keys obtained
- [ ] M-Pesa credentials obtained
- [ ] PayPal API configured
- [ ] Test payments working
- [ ] Webhook endpoints secured

## 📱 Additional Features (Future)

- [ ] Mobile app development
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] AI-powered follow-up system
- [ ] Video hosting integration

## 🔄 Maintenance

- [ ] Regular dependency updates scheduled
- [ ] Database backup strategy
- [ ] Monitoring alerts configured
- [ ] Support contact information
- [ ] Documentation kept up-to-date
- [ ] Regular security audits

## 📝 Documentation

- [ ] API documentation complete
- [ ] User guide created (optional)
- [ ] Admin guide created (optional)
- [ ] Troubleshooting guide
- [ ] Video tutorials (optional)

---

## Quick Pre-Push Checklist

Before every `git push`:

```bash
# 1. Check for secrets
git diff

# 2. Verify .env not included
git status

# 3. Test locally
cd backend
uvicorn main:app --reload

# 4. Commit and push
git add .
git commit -m "Your commit message"
git push origin main
```

---

**Deployment Date:** _______________

**Deployed By:** _______________

**Production URL:** _______________

**Notes:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

*May this platform be used mightily for the Kingdom!* 🙏
