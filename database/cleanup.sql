-- Cleanup script - Run this FIRST if you want to start fresh
-- WARNING: This will delete ALL data!

-- Drop tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS stream_reactions CASCADE;
DROP TABLE IF EXISTS stream_comments CASCADE;
DROP TABLE IF EXISTS live_streams CASCADE;
DROP TABLE IF EXISTS course_completions CASCADE;
DROP TABLE IF EXISTS giving CASCADE;
DROP TABLE IF EXISTS prayer_requests CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS increment_pray_count(UUID);
DROP FUNCTION IF EXISTS increment_viewer_count(UUID);
DROP FUNCTION IF EXISTS decrement_viewer_count(UUID);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Now run the full schema.sql
