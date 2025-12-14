-- Add review approval system for authenticity
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Update existing reviews to be approved (for backward compatibility)
UPDATE reviews SET is_approved = true WHERE is_approved IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);

-- Update RLS policies to only show approved reviews publicly
DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;
CREATE POLICY "Public read approved reviews" ON reviews
  FOR SELECT
  USING (is_approved = true);

-- Keep existing policies for users to manage their reviews
-- (Users can still see their own unapproved reviews)
