# Christ Revolution Movement (CRM) — Central Command

> Disciple 2 Billion Souls by 2033

A global Pentecostal, Evangelical, and Charismatic Jesus movement web platform — built with Python FastAPI, Supabase, and modern front-end.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 🏗 Architecture

- **Backend:** Python 3.11 + FastAPI
- **Database/Auth:** Supabase (Postgres + Row-Level Security)
- **Frontend:** Vanilla HTML/CSS/JS (Jinja2 templates)
- **Hosting:** Render (web service)
- **Video:** HLS adaptive streaming via CDN
- **Payments:** Stripe (cards), M-Pesa, PayPal, Bank Transfer

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.11 or higher
- Git
- Supabase account
- Render account (for deployment)

### 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `database/schema.sql`
3. Go to **Settings → API** and copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **service_role key** (not the anon key)

### 3. Local Development

#### Windows

```cmd
# Clone the repository
git clone https://github.com/YOUR_USERNAME/christ-revolution-movement.git
cd christ-revolution-movement

# Run setup script
setup.bat

# Edit .env file with your Supabase credentials

# Activate virtual environment
venv\Scripts\activate

# Start server
cd backend
uvicorn main:app --reload
```

#### Linux/Mac

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/christ-revolution-movement.git
cd christ-revolution-movement

# Run setup script
chmod +x setup.sh
./setup.sh

# Edit .env file with your Supabase credentials

# Activate virtual environment
source venv/bin/activate

# Start server
cd backend
uvicorn main:app --reload
```

### 4. Access the Application

- **Homepage:** http://localhost:8000
- **API Docs:** http://localhost:8000/api/docs
- **Admin Panel:** http://localhost:8000/admin
- **Health Check:** http://localhost:8000/api/health

## 📦 Project Structure

```
christ-revolution-movement/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── auth.py              # Authentication logic
│   ├── supabase_client.py   # Supabase client setup
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── templates/           # Jinja2 HTML templates
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── portal.html
│   │   └── admin.html
│   └── static/
│       ├── css/            # Stylesheets
│       ├── js/             # JavaScript files
│       └── img/            # Images and media
├── database/
│   └── schema.sql          # Database schema
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── render.yaml             # Render deployment config
├── Procfile                # Process file for deployment
├── runtime.txt             # Python version
├── setup.sh                # Linux/Mac setup script
├── setup.bat               # Windows setup script
├── DEPLOYMENT.md           # Detailed deployment guide
└── README.md               # This file
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SESSION_SECRET=your-random-secret-key
ENVIRONMENT=development
```

## 🌐 Deployment

### Deploy to Render

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Click **New +** → **Blueprint**
4. Select your repository
5. Set environment variables
6. Deploy!

Your app will be live at: `https://your-app.onrender.com`

## 🔑 Features

### For Members
- ✅ User registration and authentication
- ✅ Personal discipleship portal
- ✅ Attendance tracking (Sunday, Wednesday, Friday services)
- ✅ Prayer wall (submit & pray for others)
- ✅ Online giving (tithe, offerings, missions)
- ✅ Media library (sermons, teachings)
- ✅ Growth track progress
- ✅ Live streaming integration

### For Admins
- ✅ Member management dashboard
- ✅ Attendance reports
- ✅ Giving analytics
- ✅ Follow-up queue (inactive members)
- ✅ Multi-level permissions (Global, Continental, National, City)
- ✅ Real-time statistics

### Technical Features
- ✅ RESTful API with FastAPI
- ✅ JWT-based authentication
- ✅ Row-level security with Supabase
- ✅ Responsive design
- ✅ API documentation (Swagger/ReDoc)
- ✅ Health check endpoint
- ✅ CORS configuration
- ✅ Environment-based configuration

## 🛠 Development

### Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### Run Tests (Coming Soon)

```bash
pytest backend/tests/
```

### Code Quality

```bash
# Format code
black backend/

# Lint code
flake8 backend/

# Type checking
mypy backend/
```

## 📊 API Endpoints

### Public Routes
- `GET /` - Homepage
- `GET /register` - Registration page
- `GET /login` - Login page
- `GET /live` - Live streaming
- `GET /media` - Media library
- `GET /locations` - Church locations
- `GET /give` - Giving page

### Authentication
- `POST /api/register` - Register new member
- `POST /api/login` - Login member
- `GET /api/me` - Get current user

### Protected Routes
- `GET /portal` - Member portal
- `POST /api/attendance` - Check-in to service
- `GET /api/prayers` - Get prayer requests
- `POST /api/prayers` - Submit prayer request
- `POST /api/give` - Record giving
- `GET /api/growth` - Growth track progress

### Admin Routes
- `GET /admin` - Admin dashboard
- `GET /api/admin/members` - List members
- `GET /api/admin/followup-queue` - Get follow-up list

### Health
- `GET /api/health` - Health check

Full API documentation: http://localhost:8000/api/docs

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed for use by Christ Revolution Movement and its affiliates.

## 🆘 Support

- **Documentation:** See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues:** Open an issue on GitHub
- **Email:** support@christrevolution.org (example)

## 🎯 Roadmap

- [x] Core authentication system
- [x] Member portal
- [x] Admin dashboard
- [x] Attendance tracking
- [x] Prayer wall
- [x] Giving system
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration (Stripe, M-Pesa)
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] AI-powered follow-up
- [ ] Video hosting integration

## 🌟 Vision

**Christ Revolution Movement** aims to disciple 2 billion souls by 2033 through:

- Local church multiplication
- Digital discipleship tools
- Global connectivity
- Data-driven ministry
- Empowered leadership at every level

---

Built with ❤️ for the Kingdom | **CRM 2033**

*"Go therefore and make disciples of all nations..."* - Matthew 28:19
