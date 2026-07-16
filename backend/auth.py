import hashlib, secrets, os
from datetime import datetime, timedelta
from fastapi import Request, HTTPException
from supabase_client import supabase

SECRET = os.environ.get("SESSION_SECRET", secrets.token_hex(32))

def hash_password(pw: str) -> str:
    salt = secrets.token_hex(16)
    h = hashlib.sha256((salt + pw).encode()).hexdigest()
    return f"{salt}${h}"

def verify_password(pw: str, stored: str) -> bool:
    salt, h = stored.split("$")
    return hashlib.sha256((salt + pw).encode()).hexdigest() == h

def create_session(member_id: str) -> str:
    token = secrets.token_urlsafe(48)
    expires = (datetime.utcnow() + timedelta(days=30)).isoformat()
    supabase.table("sessions").insert({
        "token": token,
        "member_id": member_id,
        "expires_at": expires
    }).execute()
    return token

def verify_session(token: str):
    result = supabase.table("sessions").select("*").eq("token", token).single().execute()
    if not result.data:
        return None
    if datetime.fromisoformat(result.data["expires_at"]) < datetime.utcnow():
        return None
    return result.data

async def get_current_user(request: Request):
    auth = request.headers.get("Authorization", "")
    cookie = request.cookies.get("crm_session")
    token = auth.replace("Bearer ", "") if auth.startswith("Bearer ") else cookie
    if not token:
        raise HTTPException(401, "Not authenticated")
    session = verify_session(token)
    if not session:
        raise HTTPException(401, "Invalid or expired session")
    return {"id": session["member_id"]}

def generate_unique_id(continent: str, country: str, city: str) -> str:
    # Format: CRM-<CONT>-<CITY>-<SEQ>
    cont_code = continent[:3].upper()
    city_code = city[:3].upper()
    # Get next sequence for this city
    result = supabase.table("members").select("id").eq("city", city).execute()
    seq = len(result.data) + 1
    return f"CRM-{cont_code}-{city_code}-{seq:06d}"