-- Seed Test Locations for TN Film Locations
-- Run this in your Supabase SQL Editor to add 5 test locations

-- Note: These locations will be inserted without created_by (set to NULL)
-- since they don't require admin authentication for testing purposes

INSERT INTO public.locations (
  name,
  address,
  city,
  county,
  description,
  property_type,
  year_built,
  square_footage,
  parking,
  amenities,
  contact_name,
  contact_email,
  contact_phone,
  images,
  is_active
) VALUES
(
  'Historic Red Barn Estate',
  '1234 Countryside Lane',
  'Franklin',
  'Williamson',
  'A stunning restored red barn on 50 acres of rolling hills, featuring original wood beams, vaulted ceilings, and panoramic countryside views. Perfect for rustic or period pieces. The property includes multiple outbuildings and a picturesque pond.',
  'barn',
  1892,
  4500,
  'Gravel lot - 50+ vehicles',
  ARRAY['Natural Light', 'Historic', 'Outdoor Space', 'Parking', 'Rustic Charm', 'Electricity', 'Water Access'],
  'Sarah Mitchell',
  'sarah@barnestatetn.com',
  '(615) 555-0123',
  ARRAY[
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
    'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800',
    'https://images.unsplash.com/photo-1530878955558-a6c31b9c97a3?w=800',
    'https://images.unsplash.com/photo-1464297162577-f5295c892194?w=800'
  ],
  true
),
(
  'Victorian Mansion on Music Row',
  '567 Music Square West',
  'Nashville',
  'Davidson',
  'Elegant Victorian mansion built during Nashville''s golden age. Features ornate woodwork, crystal chandeliers, grand staircase, and period-appropriate furnishings. Located in the heart of Music Row with easy access to downtown. Ideal for upscale interior shots and period dramas.',
  'mansion',
  1885,
  8200,
  'On-street and private driveway - 10 vehicles',
  ARRAY['Period Furnishings', 'Grand Staircase', 'Chandeliers', 'Hardwood Floors', 'Historic', 'Central Location', 'AC/Heat', 'Multiple Rooms'],
  'James Wellington',
  'james@musicrowmansion.com',
  '(615) 555-0234',
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800'
  ],
  true
),
(
  'Industrial Warehouse Loft',
  '890 Riverfront Drive',
  'Chattanooga',
  'Hamilton',
  'Converted industrial warehouse in the revitalized Southside district. Exposed brick walls, 20-foot ceilings, massive windows, concrete floors, and industrial fixtures. Open floor plan with 12,000 sq ft of column-free space. Perfect for contemporary shoots, music videos, or modern urban scenes.',
  'warehouse',
  1920,
  12000,
  'Loading dock and lot - 30 vehicles',
  ARRAY['High Ceilings', 'Natural Light', 'Exposed Brick', 'Open Floor Plan', 'Loading Dock', 'Industrial', 'Column Free', 'River Views'],
  'Marcus Chen',
  'marcus@southsideloft.com',
  '(423) 555-0345',
  ARRAY[
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1604328727105-fc6dfb36c7f8?w=800',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'
  ],
  true
),
(
  'Smoky Mountain Forest Retreat',
  '2345 Mountain Trail Road',
  'Gatlinburg',
  'Sevier',
  'Private 100-acre forest property nestled in the Smoky Mountains. Features old-growth trees, mountain streams, rustic cabins, and breathtaking mountain vistas. Multiple clearings suitable for base camp. Authentic Appalachian setting ideal for outdoor adventures, period pieces, or nature documentaries.',
  'forest',
  NULL,
  NULL,
  'Dirt road access - 15 vehicles',
  ARRAY['Outdoor Space', 'Mountain Views', 'Streams', 'Hiking Trails', 'Wildlife', 'Cabins', 'Natural Setting', 'Secluded'],
  'Rebecca Thompson',
  'rebecca@smokyretreats.com',
  '(865) 555-0456',
  ARRAY[
    'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'
  ],
  true
),
(
  'Modern Glass Office Tower',
  '100 Commerce Street, Suite 2000',
  'Memphis',
  'Shelby',
  'Sleek 20th-floor office space in downtown Memphis'' premier commercial tower. Floor-to-ceiling windows with Mississippi River views, contemporary furnishings, glass-walled conference rooms, and modern amenities. Perfect for corporate scenes, tech startups, or contemporary drama settings.',
  'office',
  2015,
  6500,
  'Underground garage - 20 vehicles',
  ARRAY['City Views', 'Natural Light', 'Modern', 'Conference Rooms', 'AC/Heat', 'Elevator Access', 'WiFi', 'River Views'],
  'David Park',
  'david@commercetower.com',
  '(901) 555-0567',
  ARRAY[
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
    'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800'
  ],
  true
);

-- Verify the insertions
SELECT
  name,
  city,
  county,
  property_type,
  array_length(images, 1) as image_count,
  array_length(amenities, 1) as amenity_count
FROM public.locations
ORDER BY created_at DESC
LIMIT 5;
