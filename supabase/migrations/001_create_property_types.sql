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

-- Seed with property types
INSERT INTO property_types (name, display_name) VALUES
  ('bar', 'Bar'),
  ('boutique', 'Boutique'),
  ('bungalow', 'Bungalow'),
  ('cabin', 'Cabin'),
  ('cafe', 'Cafe'),
  ('car-wash', 'Car Wash'),
  ('clapboard', 'Clapboard'),
  ('coffee-shop', 'Coffee Shop'),
  ('craftsman', 'Craftsman'),
  ('farm', 'Farm'),
  ('grocery-store', 'Grocery Store'),
  ('historic', 'Historic'),
  ('industrial', 'Industrial'),
  ('log-cabin', 'Log Cabin'),
  ('mansion', 'Mansion'),
  ('market', 'Market'),
  ('mid-american', 'Mid American'),
  ('modern-contemporary', 'Modern / Contemporary'),
  ('night-club', 'Night Club'),
  ('office', 'Office'),
  ('produce-stand', 'Produce Stand'),
  ('ranch', 'Ranch'),
  ('residential', 'Residential'),
  ('retail', 'Retail'),
  ('traditional', 'Traditional'),
  ('tudor', 'Tudor'),
  ('urban', 'Urban'),
  ('venue', 'Venue'),
  ('warehouse', 'Warehouse'),
  ('waterfront', 'Waterfront'),
  ('other', 'Other')
ON CONFLICT (name) DO NOTHING;
