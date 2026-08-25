-- Add client-requested property types
-- Requested: Laundromat, Church, Smoke Shop (originally "Tobacco Store"),
-- Convenience Store, Governmental, Diner & Restaurant, Motel & Hotel

INSERT INTO property_types (name, display_name) VALUES
  ('church', 'Church'),
  ('convenience-store', 'Convenience Store'),
  ('diner-restaurant', 'Diner & Restaurant'),
  ('governmental', 'Governmental'),
  ('laundromat', 'Laundromat'),
  ('motel-hotel', 'Motel & Hotel'),
  ('smoke-shop', 'Smoke Shop')
ON CONFLICT (name) DO NOTHING;
