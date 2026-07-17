import hashlib, secrets, os, sys
from datetime import datetime, timedelta
from fastapi import Request, HTTPException, status
from typing import Optional

try:
    from supabase_client import supabase
except Exception as e:
    print(f"ERROR: Failed to import supabase_client: {e}")
    sys.exit(1)

SECRET = os.environ.get("SESSION_SECRET", secrets.token_hex(32))

def hash_password(pw: str) -> str:
    """Hash password with salt using SHA-256."""
    salt = secrets.token_hex(16)
    h = hashlib.sha256((salt + pw).encode()).hexdigest()
    return f"{salt}${h}"

def verify_password(pw: str, stored: str) -> bool:
    """Verify password against stored hash."""
    try:
        salt, h = stored.split("$")
        return hashlib.sha256((salt + pw).encode()).hexdigest() == h
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def create_session(member_id: str) -> str:
    """Create a new session token for member."""
    try:
        token = secrets.token_urlsafe(48)
        expires = (datetime.utcnow() + timedelta(days=30)).isoformat()
        supabase.table("sessions").insert({
            "token": token,
            "member_id": member_id,
            "expires_at": expires
        }).execute()
        return token
    except Exception as e:
        print(f"Session creation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create session"
        )

def verify_session(token: str) -> Optional[dict]:
    """Verify session token and return session data if valid."""
    try:
        result = supabase.table("sessions").select("*").eq("token", token).execute()
        
        if not result.data or len(result.data) == 0:
            return None
        
        session = result.data[0]
        
        # Check expiration
        if datetime.fromisoformat(session["expires_at"]) < datetime.utcnow():
            return None
        
        return session
    except Exception as e:
        print(f"Session verification error: {e}")
        return None

async def get_current_user(request: Request) -> dict:
    """Get current authenticated user from request."""
    auth = request.headers.get("Authorization", "")
    cookie = request.cookies.get("crm_session")
    
    # Extract token from Authorization header or cookie
    token = auth.replace("Bearer ", "") if auth.startswith("Bearer ") else cookie
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    session = verify_session(token)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return {"id": session["member_id"], "token": token}

def generate_unique_id(continent: str, country: str, city: str) -> str:
    """Generate unique member ID in format: CRM-<CONT>-<CITY>-<SEQ>."""
    try:
        cont_code = continent[:3].upper()
        city_code = city[:3].upper()
        
        # Get next sequence for this city
        result = supabase.table("members").select("id").eq("city", city).execute()
        seq = len(result.data) + 1
        
        return f"CRM-{cont_code}-{city_code}-{seq:06d}"
    except Exception as e:
        print(f"Unique ID generation error: {e}")
        # Fallback to random ID
        return f"CRM-{secrets.token_hex(6).upper()}"