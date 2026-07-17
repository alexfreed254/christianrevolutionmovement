# API Documentation

Complete API reference for Christ Revolution Movement Central Command.

**Base URL (Production):** `https://your-app.onrender.com`  
**Base URL (Local):** `http://localhost:8000`

**Interactive Docs:** `/api/docs` (Swagger UI)  
**Alternative Docs:** `/api/redoc` (ReDoc)

---

## 🔐 Authentication

All protected endpoints require authentication via:

**Method 1: Authorization Header**
```
Authorization: Bearer <token>
```

**Method 2: Cookie**
```
Cookie: crm_session=<token>
```

Token is obtained from `/api/register` or `/api/login` responses.

---

## 📌 Public Endpoints

### GET `/` - Homepage
Returns the main landing page.

### GET `/register` - Registration Page
Returns the registration form page.

### GET `/login` - Login Page
Returns the login form page.

### GET `/live` - Live Streaming Page
Returns the live streaming page.

### GET `/media` - Media Library Page
Returns the media library page.

### GET `/locations` - Church Locations Page
Returns the church locations map page.

### GET `/give` - Giving Page
Returns the online giving page.

---

## 🔑 Authentication Endpoints

### POST `/api/register`

Register a new member.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "continent": "Africa",
  "country": "Kenya",
  "city": "Nairobi",
  "village": "Kibera",
  "email": "john@example.com",
  "phone": "+254712345678",
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbG...",
  "member": {
    "id": "uuid-here",
    "full_name": "John Doe",
    "unique_id": "CRM-AFR-NAI-000001",
    "growth_stage": "new_believer",
    "engagement_score": 0,
    "joined_at": "2026-07-17T10:30:00"
  }
}
```

**Error Responses:**
- `400` - Username already taken
- `400` - Email already registered
- `422` - Validation error

---

### POST `/api/login`

Login an existing member.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbG...",
  "member": {
    "id": "uuid-here",
    "full_name": "John Doe",
    "username": "johndoe",
    "unique_id": "CRM-AFR-NAI-000001",
    "engagement_score": 45,
    "streak": 12
  }
}
```

**Error Responses:**
- `401` - Invalid credentials

---

### GET `/api/me`

Get current authenticated user info.

**Headers Required:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "id": "uuid-here",
  "full_name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "unique_id": "CRM-AFR-NAI-000001",
  "continent": "Africa",
  "country": "Kenya",
  "city": "Nairobi",
  "growth_stage": "foundations",
  "engagement_score": 85,
  "streak": 7,
  "last_seen": "2026-07-17T10:30:00"
}
```

**Error Responses:**
- `401` - Not authenticated
- `401` - Invalid or expired session

---

## 📅 Attendance Endpoints

### POST `/api/attendance`

Check-in to a service.

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "service_type": "sunday",
  "mode": "online",
  "location_code": "CRM-NAI-001"
}
```

**Service Types:**
- `sunday` - Sunday service
- `wednesday` - Wednesday service
- `friday` - Friday service

**Modes:**
- `online` - Online attendance
- `in_person` - Physical attendance

**Success Response (200):**
```json
{
  "status": "ok",
  "score": 95,
  "streak": 8
}
```

**Error Responses:**
- `401` - Not authenticated
- `422` - Validation error

---

## 🙏 Prayer Endpoints

### GET `/api/prayers`

Get public prayer requests.

**Query Parameters:**
- None

**Success Response (200):**
```json
[
  {
    "id": "uuid-here",
    "member_id": "uuid-here",
    "content": "Pray for my family's salvation",
    "pray_count": 42,
    "is_public": true,
    "created_at": "2026-07-17T10:30:00"
  }
]
```

---

### POST `/api/prayers`

Submit a prayer request.

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "Please pray for healing",
  "is_public": true
}
```

**Success Response (200):**
```json
[
  {
    "id": "uuid-here",
    "member_id": "uuid-here",
    "content": "Please pray for healing",
    "pray_count": 0,
    "is_public": true,
    "created_at": "2026-07-17T10:30:00"
  }
]
```

---

### POST `/api/prayers/{prayer_id}/pray`

Pray for a prayer request (increments counter).

**Path Parameters:**
- `prayer_id` (uuid) - ID of prayer request

**Success Response (200):**
```json
{
  "status": "ok"
}
```

---

## 💰 Giving Endpoints

### POST `/api/give`

Record a giving/donation.

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 100.00,
  "currency": "USD",
  "category": "tithe",
  "is_recurring": false,
  "payment_method": "card"
}
```

**Categories:**
- `tithe` - Tithe (10%)
- `offering` - General offering
- `missions` - Missions support
- `welfare` - Welfare/benevolence
- `building` - Building fund

**Payment Methods:**
- `card` - Credit/debit card
- `mpesa` - M-Pesa mobile money
- `paypal` - PayPal
- `bank` - Bank transfer

**Success Response (200):**
```json
[
  {
    "id": "uuid-here",
    "member_id": "uuid-here",
    "amount": 100.00,
    "currency": "USD",
    "category": "tithe",
    "receipt_id": "CRM-A1B2C3D4E5",
    "transaction_status": "completed",
    "created_at": "2026-07-17T10:30:00"
  }
]
```

---

### GET `/api/giving/history`

Get giving history for current user.

**Headers Required:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": "uuid-here",
    "amount": 100.00,
    "currency": "USD",
    "category": "tithe",
    "receipt_id": "CRM-A1B2C3D4E5",
    "created_at": "2026-07-17T10:30:00"
  }
]
```

---

## 📺 Media Endpoints

### GET `/api/media`

Get media library items (sermons, teachings, etc.).

**Query Parameters:**
- `series` (optional) - Filter by series name
- `speaker` (optional) - Filter by speaker name
- `language` (optional) - Filter by language code (e.g., "en")

**Example:**
```
GET /api/media?series=Foundations&language=en
```

**Success Response (200):**
```json
[
  {
    "id": "uuid-here",
    "title": "The Power of Prayer",
    "description": "Learning to pray effectively",
    "media_type": "video",
    "url": "https://cdn.example.com/video.m3u8",
    "thumbnail_url": "https://cdn.example.com/thumb.jpg",
    "duration_seconds": 3600,
    "series": "Foundations",
    "speaker": "Pastor John",
    "language": "en",
    "view_count": 1234,
    "published_at": "2026-07-01T10:00:00"
  }
]
```

---

## 📍 Location Endpoints

### GET `/api/locations`

Get church locations.

**Query Parameters:**
- `continent` (optional) - Filter by continent
- `country` (optional) - Filter by country

**Example:**
```
GET /api/locations?country=Kenya
```

**Success Response (200):**
```json
[
  {
    "id": "uuid-here",
    "name": "Nairobi Central Church",
    "location_code": "CRM-NAI-001",
    "address": "123 Main Street, Nairobi",
    "city": "Nairobi",
    "country": "Kenya",
    "continent": "Africa",
    "latitude": -1.286389,
    "longitude": 36.817223,
    "capacity": 500,
    "pastor_name": "Pastor John Doe",
    "pastor_phone": "+254712345678",
    "service_times": "Sunday 9AM, Wednesday 6PM, Friday 6PM"
  }
]
```

---

## 📈 Growth Track Endpoints

### GET `/api/growth`

Get growth track progress for current user.

**Headers Required:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "stage": "foundations",
  "score": 85,
  "courses_completed": [
    "new_believers_class",
    "water_baptism",
    "foundations_101"
  ]
}
```

**Growth Stages:**
1. `new_believer` - Just joined
2. `foundations` - Learning basics
3. `discipleship` - Active discipleship
4. `leadership` - Leadership training
5. `sent` - Commissioned for ministry

---

### POST `/api/growth/complete-course/{course_id}`

Mark a course as completed.

**Headers Required:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `course_id` (string) - Course identifier

**Example:**
```
POST /api/growth/complete-course/foundations_101
```

**Success Response (200):**
```json
{
  "status": "ok"
}
```

---

## 👥 Admin Endpoints

All admin endpoints require authentication AND admin role.

### GET `/admin`

Admin dashboard page (HTML).

**Requires:** Admin role (global_admin, continental_admin, national_admin, or city_admin)

---

### GET `/api/admin/members`

Get list of members (filtered by admin scope).

**Headers Required:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": "uuid-here",
    "full_name": "John Doe",
    "unique_id": "CRM-AFR-NAI-000001",
    "city": "Nairobi",
    "country": "Kenya",
    "continent": "Africa",
    "growth_stage": "foundations",
    "engagement_score": 85,
    "last_seen": "2026-07-17T10:30:00"
  }
]
```

**Scope Rules:**
- `city_admin` - See only their city
- `national_admin` - See only their country
- `continental_admin` - See only their continent
- `global_admin` - See all members

---

### GET `/api/admin/followup-queue`

Get members needing follow-up (missed 2+ consecutive Sundays).

**Headers Required:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": "uuid-here",
    "full_name": "Jane Smith",
    "phone": "+254712345678",
    "email": "jane@example.com",
    "last_seen": "2026-06-15T10:30:00"
  }
]
```

---

## ❤️ Health Check

### GET `/api/health`

Health check endpoint for monitoring.

**Success Response (200):**
```json
{
  "status": "ok",
  "service": "CRM Central Command",
  "time": "2026-07-17T10:30:00.123456"
}
```

---

## 📊 HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |

---

## 🔒 Security Notes

1. **HTTPS Only** - Always use HTTPS in production
2. **Token Storage** - Store tokens securely (httpOnly cookies recommended)
3. **Token Expiration** - Tokens expire after 30 days
4. **Rate Limiting** - Future feature to prevent abuse
5. **CORS** - Configure `ALLOWED_ORIGINS` properly

---

## 🧪 Testing Examples

### Using curl

```bash
# Register
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "continent": "Africa",
    "country": "Kenya",
    "city": "Nairobi",
    "email": "test@example.com",
    "phone": "+254712345678",
    "username": "testuser",
    "password": "TestPass123"
  }'

# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123"
  }'

# Get current user (replace TOKEN)
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer TOKEN"
```

### Using JavaScript (Fetch API)

```javascript
// Register
const register = async () => {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: 'Test User',
      continent: 'Africa',
      country: 'Kenya',
      city: 'Nairobi',
      email: 'test@example.com',
      phone: '+254712345678',
      username: 'testuser',
      password: 'TestPass123'
    })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// Login
const login = async () => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testuser',
      password: 'TestPass123'
    })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// Authenticated request
const getMe = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

---

## 📞 Support

For API support or questions:
- **Documentation:** http://localhost:8000/api/docs
- **Email:** support@christrevolution.org
- **Issues:** GitHub Issues

---

*Built for the Kingdom | CRM 2033* 🙏
