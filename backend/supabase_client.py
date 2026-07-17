from supabase import create_client, Client
import os
import sys

# Get environment variables
url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_SERVICE_KEY", "")

# Validate required environment variables
if not url or not key:
    print("ERROR: Missing required environment variables!")
    print("Please set SUPABASE_URL and SUPABASE_SERVICE_KEY")
    if os.environ.get("ENVIRONMENT") == "production":
        sys.exit(1)
    else:
        print("WARNING: Running in development mode without proper configuration")

# Create Supabase client
try:
    supabase: Client = create_client(url, key)
except Exception as e:
    print(f"ERROR: Failed to create Supabase client: {e}")
    if os.environ.get("ENVIRONMENT") == "production":
        sys.exit(1)
    raise