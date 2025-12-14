-- Create repair guides tables for HowTo and VideoObject schema

-- Repair Guides (HowTo)
CREATE TABLE IF NOT EXISTS repair_guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  device TEXT,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  estimated_time TEXT,
  tools_needed TEXT[],
  parts_needed TEXT[],
  featured_image TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Guide Steps
CREATE TABLE IF NOT EXISTS guide_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID REFERENCES repair_guides(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT,
  description TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Embedded Videos (for VideoObject schema)
CREATE TABLE IF NOT EXISTS guide_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID REFERENCES repair_guides(id),
  title TEXT,
  description TEXT,
  youtube_url TEXT,
  thumbnail_url TEXT,
  upload_date DATE DEFAULT NOW(),
  duration TEXT
);

-- Enable RLS
ALTER TABLE repair_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_videos ENABLE ROW LEVEL SECURITY;

-- Public read policies for published guides only
CREATE POLICY "Public read published guides" ON repair_guides FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published guide steps" ON guide_steps FOR SELECT USING (
  guide_id IN (SELECT id FROM repair_guides WHERE is_published = true)
);
CREATE POLICY "Public read guide videos" ON guide_videos FOR SELECT USING (
  guide_id IN (SELECT id FROM repair_guides WHERE is_published = true)
);
