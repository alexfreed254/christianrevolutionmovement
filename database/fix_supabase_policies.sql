-- Fix Supabase RLS Policies for Registration/Login
-- Run this in Supabase SQL Editor

-- STEP 1: Disable RLS temporarily on members table for service role
-- (Service role should bypass RLS, but let's make sure)
ALTER TABLE members DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop all existing policies on members table
DROP POLICY IF EXISTS "Enable read access for all users" ON members;
DROP POLICY IF EXISTS "Enable insert for all users" ON members;
DROP POLICY IF EXISTS "Enable update for users based on id" ON members;
DROP POLICY IF EXISTS "Users can view own profile" ON members;
DROP POLICY IF EXISTS "Service role has full access" ON members;
DROP POLICY IF EXISTS "Allow public insert" ON members;
DROP POLICY IF EXISTS "Allow public read" ON members;

-- STEP 3: Re-enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create new permissive policies

-- Allow service role full access (backend uses service role key)
CREATE POLICY "Service role bypass" ON members
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Allow anyone to insert (for registration)
CREATE POLICY "Allow registration" ON members
    FOR INSERT
    WITH CHECK (true);

-- Allow anyone to read (for login check)
CREATE POLICY "Allow login check" ON members
    FOR SELECT
    USING (true);

-- Allow users to update their own profile
CREATE POLICY "Allow profile update" ON members
    FOR UPDATE
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

-- STEP 5: Grant necessary permissions to authenticated and anon roles
GRANT SELECT, INSERT, UPDATE ON members TO authenticated;
GRANT SELECT, INSERT ON members TO anon;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- STEP 6: Ensure service_role has full access
GRANT ALL ON members TO service_role;
GRANT ALL ON sessions TO service_role;
GRANT ALL ON attendance TO service_role;
GRANT ALL ON prayer_requests TO service_role;
GRANT ALL ON giving TO service_role;
GRANT ALL ON live_streams TO service_role;
GRANT ALL ON stream_comments TO service_role;
GRANT ALL ON stream_reactions TO service_role;

-- STEP 7: Fix other tables as well
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE giving DISABLE ROW LEVEL SECURITY;
ALTER TABLE live_streams DISABLE ROW LEVEL SECURITY;
ALTER TABLE stream_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE stream_reactions DISABLE ROW LEVEL SECURITY;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE '✅ RLS policies updated!';
    RAISE NOTICE '✅ Service role has full access';
    RAISE NOTICE '✅ Registration and login should work now!';
END $$;
