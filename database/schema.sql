-- Christ Revolution Movement (CRM) Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    continent VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    village VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    unique_id VARCHAR(50) UNIQUE NOT NULL,
    growth_stage VARCHAR(50) DEFAULT 'new_believer',
    engagement_score INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT NOW(),
    last_seen TIMESTAMP DEFAULT NOW(),
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token TEXT UNIQUE NOT NULL,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL,
    mode VARCHAR(20) DEFAULT 'online',
    location_code VARCHAR(50),
    attended_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Prayer requests table
CREATE TABLE IF NOT EXISTS prayer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_public BOOLEAN DEFAULT true,
    pray_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Giving table
CREATE TABLE IF NOT EXISTS giving (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    category VARCHAR(50) NOT NULL,
    is_recurring BOOLEAN DEFAULT false,
    payment_method VARCHAR(50) NOT NULL,
    receipt_id VARCHAR(50) UNIQUE NOT NULL,
    transaction_status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    media_type VARCHAR(20) NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    series VARCHAR(100),
    speaker VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location_code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    continent VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    capacity INTEGER,
    pastor_name VARCHAR(255),
    pastor_phone VARCHAR(50),
    service_times TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Course completions table
CREATE TABLE IF NOT EXISTS course_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    course_id VARCHAR(100) NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(member_id, course_id)
);

-- Live streams table
CREATE TABLE IF NOT EXISTS live_streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    stream_url TEXT NOT NULL,
    thumbnail_url TEXT,
    status VARCHAR(20) DEFAULT 'scheduled',
    viewer_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    scheduled_for TIMESTAMP,
    speaker VARCHAR(255),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Stream comments table
CREATE TABLE IF NOT EXISTS stream_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Stream reactions table
CREATE TABLE IF NOT EXISTS stream_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(stream_id, member_id, reaction_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_members_username ON members(username);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_city ON members(city);
CREATE INDEX IF NOT EXISTS idx_members_country ON members(country);
CREATE INDEX IF NOT EXISTS idx_members_continent ON members(continent);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_attendance_member ON attendance(member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attended_at);
CREATE INDEX IF NOT EXISTS idx_prayer_member ON prayer_requests(member_id);
CREATE INDEX IF NOT EXISTS idx_giving_member ON giving(member_id);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(media_type);
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
CREATE INDEX IF NOT EXISTS idx_stream_comments_stream ON stream_comments(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_comments_created ON stream_comments(created_at);
CREATE INDEX IF NOT EXISTS idx_stream_reactions_stream ON stream_reactions(stream_id);
CREATE INDEX IF NOT EXISTS idx_live_streams_status ON live_streams(status);

-- Function to increment prayer count
CREATE OR REPLACE FUNCTION increment_pray_count(p_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE prayer_requests 
    SET pray_count = pray_count + 1 
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment viewer count
CREATE OR REPLACE FUNCTION increment_viewer_count(p_stream_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE live_streams 
    SET viewer_count = viewer_count + 1 
    WHERE id = p_stream_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement viewer count
CREATE OR REPLACE FUNCTION decrement_viewer_count(p_stream_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE live_streams 
    SET viewer_count = GREATEST(viewer_count - 1, 0)
    WHERE id = p_stream_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prayer_requests_updated_at 
    BEFORE UPDATE ON prayer_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_live_streams_updated_at 
    BEFORE UPDATE ON live_streams 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE giving ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_reactions ENABLE ROW LEVEL SECURITY;

-- Public read access for public prayer requests
CREATE POLICY "Public prayers are viewable by everyone"
    ON prayer_requests FOR SELECT
    USING (is_public = true);

-- Users can view their own data
CREATE POLICY "Users can view own profile"
    ON members FOR SELECT
    USING (true);

CREATE POLICY "Users can view own attendance"
    ON attendance FOR SELECT
    USING (true);

CREATE POLICY "Users can view own giving"
    ON giving FOR SELECT
    USING (true);

-- Live streams are viewable by everyone
CREATE POLICY "Live streams are viewable by everyone"
    ON live_streams FOR SELECT
    USING (true);

-- Stream comments are viewable by everyone
CREATE POLICY "Stream comments are viewable by everyone"
    ON stream_comments FOR SELECT
    USING (true);

-- Stream reactions are viewable by everyone
CREATE POLICY "Stream reactions are viewable by everyone"
    ON stream_reactions FOR SELECT
    USING (true);

-- Service role has full access (bypass RLS)
-- This is handled by using the service_role key in the application
