"""
Christ Revolution Movement (CRM) — Central Command API
FastAPI backend with Supabase integration
"""
from fastapi import FastAPI, Request, HTTPException, Depends, Form, status
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
import uuid, os, secrets, hashlib

from supabase_client import supabase
from auth import (
    hash_password, verify_password, create_session,
    verify_session, get_current_user, generate_unique_id
)

# ---------- App Setup ----------
app = FastAPI(title="CRM Central Command", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="../frontend/static"), name="static")
templates = Jinja2Templates(directory="../frontend/templates")

# ---------- Models ----------
class RegisterData(BaseModel):
    full_name: str
    continent: str
    country: str
    city: str
    village: Optional[str] = None
    email: EmailStr
    phone: str
    username: str
    password: str

class LoginData(BaseModel):
    username: str
    password: str

class PrayerRequest(BaseModel):
    content: str
    is_public: bool = True

class AttendanceCheckin(BaseModel):
    service_type: str  # sunday | wednesday | friday
    location_code: Optional[str] = None
    mode: str = "online"  # online | in_person

class GivingRecord(BaseModel):
    amount: float
    currency: str = "USD"
    category: str = "tithe"  # tithe | offering | missions | welfare | building
    is_recurring: bool = False
    payment_method: str = "card"  # card | mpesa | paypal | bank

# ---------- Public Routes ----------
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.get("/live", response_class=HTMLResponse)
async def live_page(request: Request):
    return templates.TemplateResponse("live.html", {"request": request})

@app.get("/media", response_class=HTMLResponse)
async def media_page(request: Request):
    return templates.TemplateResponse("media.html", {"request": request})

@app.get("/locations", response_class=HTMLResponse)
async def locations_page(request: Request):
    return templates.TemplateResponse("locations.html", {"request": request})

@app.get("/give", response_class=HTMLResponse)
async def give_page(request: Request):
    return templates.TemplateResponse("give.html", {"request": request})

# ---------- Auth API ----------
@app.post("/api/register")
async def register(data: RegisterData):
    # Check existing
    existing = supabase.table("members").select("id").eq("username", data.username).execute()
    if existing.data:
        raise HTTPException(400, "Username already taken")
    existing_email = supabase.table("members").select("id").eq("email", data.email).execute()
    if existing_email.data:
        raise HTTPException(400, "Email already registered")

    unique_id = generate_unique_id(data.continent, data.country, data.city)
    password_hash = hash_password(data.password)

    member = {
        "full_name": data.full_name,
        "continent": data.continent,
        "country": data.country,
        "city": data.city,
        "village": data.village,
        "email": data.email,
        "phone": data.phone,
        "username": data.username,
        "password_hash": password_hash,
        "unique_id": unique_id,
        "growth_stage": "new_believer",  # new_believer | foundations | discipleship | leadership | sent
        "engagement_score": 0,
        "streak": 0,
        "joined_at": datetime.utcnow().isoformat(),
        "preferred_language": "en",
        "timezone": "UTC"
    }
    result = supabase.table("members").insert(member).execute()
    member_id = result.data[0]["id"]

    session_token = create_session(member_id)
    return {"token": session_token, "member": result.data[0]}

@app.post("/api/login")
async def login(data: LoginData):
    result = supabase.table("members").select("*").eq("username", data.username).execute()
    if not result.data:
        raise HTTPException(401, "Invalid credentials")
    member = result.data[0]
    if not verify_password(data.password, member["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    token = create_session(member["id"])
    member.pop("password_hash", None)
    return {"token": token, "member": member}

# ---------- Protected Portal ----------
@app.get("/portal", response_class=HTMLResponse)
async def portal(request: Request, user=Depends(get_current_user)):
    # Fetch member data
    member = supabase.table("members").select("*").eq("id", user["id"]).single().execute().data
    attendance = supabase.table("attendance").select("*").eq("member_id", user["id"]).order("attended_at", desc=True).limit(10).execute().data
    giving = supabase.table("giving").select("*").eq("member_id", user["id"]).order("created_at", desc=True).limit(10).execute().data
    member.pop("password_hash", None)
    return templates.TemplateResponse("portal.html", {
        "request": request,
        "member": member,
        "attendance": attendance,
        "giving": giving
    })

@app.get("/api/me")
async def me(user=Depends(get_current_user)):
    member = supabase.table("members").select("*").eq("id", user["id"]).single().execute().data
    member.pop("password_hash", None)
    return member

# ---------- Attendance ----------
@app.post("/api/attendance")
async def check_in(data: AttendanceCheckin, user=Depends(get_current_user)):
    record = {
        "member_id": user["id"],
        "service_type": data.service_type,
        "mode": data.mode,
        "location_code": data.location_code,
        "attended_at": datetime.utcnow().isoformat()
    }
    supabase.table("attendance").insert(record).execute()
    # Update engagement score
    member = supabase.table("members").select("engagement_score, streak").eq("id", user["id"]).single().execute().data
    new_score = (member["engagement_score"] or 0) + 10
    new_streak = (member["streak"] or 0) + 1
    supabase.table("members").update({
        "engagement_score": new_score,
        "streak": new_streak,
        "last_seen": datetime.utcnow().isoformat()
    }).eq("id", user["id"]).execute()
    return {"status": "ok", "score": new_score, "streak": new_streak}

# ---------- Prayer Wall ----------
@app.get("/api/prayers")
async def get_prayers():
    result = supabase.table("prayer_requests").select("*").eq("is_public", True).order("created_at", desc=True).limit(50).execute()
    return result.data

@app.post("/api/prayers")
async def submit_prayer(data: PrayerRequest, user=Depends(get_current_user)):
    record = {
        "member_id": user["id"],
        "content": data.content,
        "is_public": data.is_public,
        "pray_count": 0,
        "created_at": datetime.utcnow().isoformat()
    }
    return supabase.table("prayer_requests").insert(record).execute().data

@app.post("/api/prayers/{prayer_id}/pray")
async def pray_for(prayer_id: int):
    supabase.rpc("increment_pray_count", {"p_id": prayer_id}).execute()
    return {"status": "ok"}

# ---------- Giving ----------
@app.post("/api/give")
async def record_giving(data: GivingRecord, user=Depends(get_current_user)):
    record = {
        "member_id": user["id"],
        "amount": data.amount,
        "currency": data.currency,
        "category": data.category,
        "is_recurring": data.is_recurring,
        "payment_method": data.payment_method,
        "receipt_id": f"CRM-{uuid.uuid4().hex[:10].upper()}",
        "created_at": datetime.utcnow().isoformat()
    }
    result = supabase.table("giving").insert(record).execute()
    return result.data

@app.get("/api/giving/history")
async def giving_history(user=Depends(get_current_user)):
    return supabase.table("giving").select("*").eq("member_id", user["id"]).order("created_at", desc=True).execute().data

# ---------- Media Library ----------
@app.get("/api/media")
async def list_media(series: Optional[str] = None, speaker: Optional[str] = None, language: Optional[str] = None):
    query = supabase.table("media").select("*")
    if series: query = query.eq("series", series)
    if speaker: query = query.eq("speaker", speaker)
    if language: query = query.eq("language", language)
    return query.order("published_at", desc=True).limit(50).execute().data

# ---------- Locations ----------
@app.get("/api/locations")
async def list_locations(continent: Optional[str] = None, country: Optional[str] = None):
    query = supabase.table("locations").select("*")
    if continent: query = query.eq("continent", continent)
    if country: query = query.eq("country", country)
    return query.execute().data

# ---------- Growth Track ----------
@app.get("/api/growth")
async def growth_progress(user=Depends(get_current_user)):
    member = supabase.table("members").select("growth_stage, engagement_score").eq("id", user["id"]).single().execute().data
    courses = supabase.table("course_completions").select("*").eq("member_id", user["id"]).execute().data
    return {"stage": member["growth_stage"], "score": member["engagement_score"], "courses_completed": [c["course_id"] for c in courses]}

@app.post("/api/growth/complete-course/{course_id}")
async def complete_course(course_id: str, user=Depends(get_current_user)):
    supabase.table("course_completions").insert({
        "member_id": user["id"],
        "course_id": course_id,
        "completed_at": datetime.utcnow().isoformat()
    }).execute()
    return {"status": "ok"}

# ---------- Admin Dashboard ----------
@app.get("/admin", response_class=HTMLResponse)
async def admin_page(request: Request, user=Depends(get_current_user)):
    member = supabase.table("members").select("role").eq("id", user["id"]).single().execute().data
    if (member.get("role") or "member") not in ["global_admin", "continental_admin", "national_admin", "city_admin"]:
        raise HTTPException(403, "Admin access required")
    stats = {
        "total_members": supabase.table("members").select("id", count="exact").execute().count,
        "active_today": supabase.table("attendance").select("member_id").gte("attended_at", (datetime.utcnow() - timedelta(days=1)).isoformat()).execute().data.__len__(),
        "total_giving": 0  # aggregate in real deployment
    }
    return templates.TemplateResponse("admin.html", {"request": request, "stats": stats})

@app.get("/api/admin/members")
async def admin_members(user=Depends(get_current_user)):
    member = supabase.table("members").select("role").eq("id", user["id"]).single().execute().data
    scope_filter = {}
    role = member.get("role", "member")
    if role == "city_admin":
        scope_filter["city"] = member.get("city")
    elif role == "national_admin":
        scope_filter["country"] = member.get("country")
    elif role == "continental_admin":
        scope_filter["continent"] = member.get("continent")
    query = supabase.table("members").select("id, full_name, unique_id, city, country, continent, growth_stage, engagement_score, last_seen")
    for k, v in scope_filter.items():
        query = query.eq(k, v)
    return query.limit(500).execute().data

@app.get("/api/admin/followup-queue")
async def followup_queue(user=Depends(get_current_user)):
    # Members who missed 2+ consecutive Sundays
    cutoff = (datetime.utcnow() - timedelta(days=14)).isoformat()
    return supabase.table("members").select("id, full_name, phone, email, last_seen").lt("last_seen", cutoff).limit(100).execute().data

# ---------- Health ----------
@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "CRM Central Command", "time": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)