-- Create property_types table for admin-managed property types
CREATE TABLE IF NOT EXISTS property_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;

-- Everyone can read property types
CREATE POLICY "Anyone can read property types"
  ON property_types FOR SELECT
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert property types"
  ON property_types FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Admins can update property types"
  ON property_types FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Admins can delete property types"
  ON property_types FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Seed with existing property types
INSERT INTO property_types (name, display_name) VALUES
  ('warehouse', 'Warehouse'),
  ('mansion', 'Mansion'),
  ('forest', 'Forest'),
  ('office', 'Office'),
  ('farm', 'Farm'),
  ('urban', 'Urban'),
  ('retail', 'Retail'),
  ('industrial', 'Industrial'),
  ('residential', 'Residential'),
  ('park', 'Park'),
  ('waterfront', 'Waterfront'),
  ('historic', 'Historic'),
  ('modern', 'Modern'),
  ('other', 'Other')
ON CONFLICT (name) DO NOTHING;
