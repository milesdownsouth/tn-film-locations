-- Pull Sheets Schema
-- Run this SQL in your Supabase SQL Editor to add pull sheets functionality

-- Create pull_sheets table
CREATE TABLE public.pull_sheets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for locations in pull sheets
CREATE TABLE public.pull_sheet_locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pull_sheet_id UUID REFERENCES public.pull_sheets(id) ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pull_sheet_id, location_id)
);

-- Create indexes for better performance
CREATE INDEX idx_pull_sheets_user_id ON public.pull_sheets(user_id);
CREATE INDEX idx_pull_sheets_share_token ON public.pull_sheets(share_token);
CREATE INDEX idx_pull_sheet_locations_pull_sheet_id ON public.pull_sheet_locations(pull_sheet_id);
CREATE INDEX idx_pull_sheet_locations_location_id ON public.pull_sheet_locations(location_id);

-- Enable Row Level Security
ALTER TABLE public.pull_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pull_sheet_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pull_sheets

-- Users can read their own pull sheets
CREATE POLICY "Users can read own pull sheets" ON public.pull_sheets
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can read public pull sheets via share token
CREATE POLICY "Anyone can read public pull sheets" ON public.pull_sheets
  FOR SELECT USING (is_public = true);

-- Users can create their own pull sheets
CREATE POLICY "Users can create own pull sheets" ON public.pull_sheets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pull sheets
CREATE POLICY "Users can update own pull sheets" ON public.pull_sheets
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own pull sheets
CREATE POLICY "Users can delete own pull sheets" ON public.pull_sheets
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for pull_sheet_locations

-- Users can read locations in their own pull sheets
CREATE POLICY "Users can read own pull sheet locations" ON public.pull_sheet_locations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pull_sheets
      WHERE pull_sheets.id = pull_sheet_locations.pull_sheet_id
      AND pull_sheets.user_id = auth.uid()
    )
  );

-- Anyone can read locations in public pull sheets
CREATE POLICY "Anyone can read public pull sheet locations" ON public.pull_sheet_locations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pull_sheets
      WHERE pull_sheets.id = pull_sheet_locations.pull_sheet_id
      AND pull_sheets.is_public = true
    )
  );

-- Users can add locations to their own pull sheets
CREATE POLICY "Users can add to own pull sheets" ON public.pull_sheet_locations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pull_sheets
      WHERE pull_sheets.id = pull_sheet_locations.pull_sheet_id
      AND pull_sheets.user_id = auth.uid()
    )
  );

-- Users can remove locations from their own pull sheets
CREATE POLICY "Users can remove from own pull sheets" ON public.pull_sheet_locations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.pull_sheets
      WHERE pull_sheets.id = pull_sheet_locations.pull_sheet_id
      AND pull_sheets.user_id = auth.uid()
    )
  );

-- Function to generate unique share tokens
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
DECLARE
  token TEXT;
  done BOOLEAN := false;
BEGIN
  WHILE NOT done LOOP
    token := encode(gen_random_bytes(12), 'base64');
    token := replace(token, '/', '_');
    token := replace(token, '+', '-');
    token := replace(token, '=', '');

    IF NOT EXISTS (SELECT 1 FROM public.pull_sheets WHERE share_token = token) THEN
      done := true;
    END IF;
  END LOOP;

  RETURN token;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate share token when is_public is set to true
CREATE OR REPLACE FUNCTION auto_generate_share_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_public = true AND NEW.share_token IS NULL THEN
    NEW.share_token := generate_share_token();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_share_token
  BEFORE INSERT OR UPDATE ON public.pull_sheets
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_share_token();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pull_sheet_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pull_sheet_updated_at
  BEFORE UPDATE ON public.pull_sheets
  FOR EACH ROW
  EXECUTE FUNCTION update_pull_sheet_updated_at();

-- Verify tables were created
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('pull_sheets', 'pull_sheet_locations')
ORDER BY table_name;
