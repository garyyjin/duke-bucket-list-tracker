-- Duke Bucket List Tracker Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Traditions table
CREATE TABLE IF NOT EXISTS traditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User completions table
CREATE TABLE IF NOT EXISTS user_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tradition_id UUID REFERENCES traditions(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tradition_id)
);

-- User ratings table (quality rating)
CREATE TABLE IF NOT EXISTS user_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tradition_id UUID REFERENCES traditions(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tradition_id)
);

-- User difficulty ratings table
CREATE TABLE IF NOT EXISTS user_difficulty_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tradition_id UUID REFERENCES traditions(id) ON DELETE CASCADE,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tradition_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_completions_user_id ON user_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_completions_tradition_id ON user_completions(tradition_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_user_id ON user_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_tradition_id ON user_ratings(tradition_id);
CREATE INDEX IF NOT EXISTS idx_user_difficulty_ratings_user_id ON user_difficulty_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_difficulty_ratings_tradition_id ON user_difficulty_ratings(tradition_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE traditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_difficulty_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow all operations for now (you can restrict later)
-- Users: Anyone can read, but only authenticated users can insert/update
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert themselves" ON users
  FOR INSERT WITH CHECK (true);

-- Traditions: Anyone can read, authenticated users can insert
CREATE POLICY "Traditions are viewable by everyone" ON traditions
  FOR SELECT USING (true);

CREATE POLICY "Users can create traditions" ON traditions
  FOR INSERT WITH CHECK (true);

-- User completions: Users can only see/modify their own
CREATE POLICY "Users can view their own completions" ON user_completions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own completions" ON user_completions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their own completions" ON user_completions
  FOR DELETE USING (true);

-- User ratings: Users can only see/modify their own
CREATE POLICY "Users can view all ratings" ON user_ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own ratings" ON user_ratings
  FOR INSERT WITH CHECK (true);

-- User difficulty ratings: Users can only see/modify their own
CREATE POLICY "Users can view all difficulty ratings" ON user_difficulty_ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own difficulty ratings" ON user_difficulty_ratings
  FOR INSERT WITH CHECK (true);

-- Insert default traditions
INSERT INTO traditions (name, description) VALUES
  ('Climb Baldwin', 'Climb up the exterior of the Baldwin Auditorium building, a legendary unofficial requirement that many Duke students attempt.'),
  ('Go in the Tunnels', 'Explore the underground tunnel system that connects various buildings across Duke''s campus. A staple of Duke lore.'),
  ('Sex in the Stacks', 'Have intimate relations among the bookshelves at Perkins Library. An infamously whispered about Duke tradition.'),
  ('Sex in the Gardens', 'Have intimate relations in the Sarah P. Duke Gardens. Another whispered unofficial graduation requirement.'),
  ('Drive Around Backward Around C1 Loop', 'Drive or ride around the C1 campus bus route in reverse - a quirky tradition some Duke students attempt.')
ON CONFLICT DO NOTHING;

