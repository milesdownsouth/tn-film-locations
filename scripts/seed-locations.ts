/**
 * Seed Test Locations Script
 * Run with: npx tsx scripts/seed-locations.ts
 */

import { createClient } from '@supabase/supabase-js';

// Check for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testLocations = [
  {
    name: 'Historic Red Barn Estate',
    address: '1234 Countryside Lane',
    city: 'Franklin',
    county: 'Williamson',
    description: 'A stunning restored red barn on 50 acres of rolling hills, featuring original wood beams, vaulted ceilings, and panoramic countryside views. Perfect for rustic or period pieces. The property includes multiple outbuildings and a picturesque pond.',
    property_type: 'barn',
    year_built: 1892,
    square_footage: 4500,
    parking: 'Gravel lot - 50+ vehicles',
    amenities: ['Natural Light', 'Historic', 'Outdoor Space', 'Parking', 'Rustic Charm', 'Electricity', 'Water Access'],
    contact_name: 'Sarah Mitchell',
    contact_email: 'sarah@barnestatetn.com',
    contact_phone: '(615) 555-0123',
    images: [
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
      'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800',
      'https://images.unsplash.com/photo-1530878955558-a6c31b9c97a3?w=800',
      'https://images.unsplash.com/photo-1464297162577-f5295c892194?w=800'
    ],
    is_active: true
  },
  {
    name: 'Victorian Mansion on Music Row',
    address: '567 Music Square West',
    city: 'Nashville',
    county: 'Davidson',
    description: 'Elegant Victorian mansion built during Nashville\'s golden age. Features ornate woodwork, crystal chandeliers, grand staircase, and period-appropriate furnishings. Located in the heart of Music Row with easy access to downtown. Ideal for upscale interior shots and period dramas.',
    property_type: 'mansion',
    year_built: 1885,
    square_footage: 8200,
    parking: 'On-street and private driveway - 10 vehicles',
    amenities: ['Period Furnishings', 'Grand Staircase', 'Chandeliers', 'Hardwood Floors', 'Historic', 'Central Location', 'AC/Heat', 'Multiple Rooms'],
    contact_name: 'James Wellington',
    contact_email: 'james@musicrowmansion.com',
    contact_phone: '(615) 555-0234',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800'
    ],
    is_active: true
  },
  {
    name: 'Industrial Warehouse Loft',
    address: '890 Riverfront Drive',
    city: 'Chattanooga',
    county: 'Hamilton',
    description: 'Converted industrial warehouse in the revitalized Southside district. Exposed brick walls, 20-foot ceilings, massive windows, concrete floors, and industrial fixtures. Open floor plan with 12,000 sq ft of column-free space. Perfect for contemporary shoots, music videos, or modern urban scenes.',
    property_type: 'warehouse',
    year_built: 1920,
    square_footage: 12000,
    parking: 'Loading dock and lot - 30 vehicles',
    amenities: ['High Ceilings', 'Natural Light', 'Exposed Brick', 'Open Floor Plan', 'Loading Dock', 'Industrial', 'Column Free', 'River Views'],
    contact_name: 'Marcus Chen',
    contact_email: 'marcus@southsideloft.com',
    contact_phone: '(423) 555-0345',
    images: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1604328727105-fc6dfb36c7f8?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'
    ],
    is_active: true
  },
  {
    name: 'Smoky Mountain Forest Retreat',
    address: '2345 Mountain Trail Road',
    city: 'Gatlinburg',
    county: 'Sevier',
    description: 'Private 100-acre forest property nestled in the Smoky Mountains. Features old-growth trees, mountain streams, rustic cabins, and breathtaking mountain vistas. Multiple clearings suitable for base camp. Authentic Appalachian setting ideal for outdoor adventures, period pieces, or nature documentaries.',
    property_type: 'forest',
    year_built: null,
    square_footage: null,
    parking: 'Dirt road access - 15 vehicles',
    amenities: ['Outdoor Space', 'Mountain Views', 'Streams', 'Hiking Trails', 'Wildlife', 'Cabins', 'Natural Setting', 'Secluded'],
    contact_name: 'Rebecca Thompson',
    contact_email: 'rebecca@smokyretreats.com',
    contact_phone: '(865) 555-0456',
    images: [
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'
    ],
    is_active: true
  },
  {
    name: 'Modern Glass Office Tower',
    address: '100 Commerce Street, Suite 2000',
    city: 'Memphis',
    county: 'Shelby',
    description: 'Sleek 20th-floor office space in downtown Memphis\' premier commercial tower. Floor-to-ceiling windows with Mississippi River views, contemporary furnishings, glass-walled conference rooms, and modern amenities. Perfect for corporate scenes, tech startups, or contemporary drama settings.',
    property_type: 'office',
    year_built: 2015,
    square_footage: 6500,
    parking: 'Underground garage - 20 vehicles',
    amenities: ['City Views', 'Natural Light', 'Modern', 'Conference Rooms', 'AC/Heat', 'Elevator Access', 'WiFi', 'River Views'],
    contact_name: 'David Park',
    contact_email: 'david@commercetower.com',
    contact_phone: '(901) 555-0567',
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
      'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800'
    ],
    is_active: true
  }
];

async function seedLocations() {
  console.log('🌱 Starting to seed test locations...\n');

  for (const location of testLocations) {
    console.log(`📍 Adding: ${location.name} (${location.city}, ${location.county})`);

    const { data, error } = await supabase
      .from('locations')
      .insert([location])
      .select();

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
    } else {
      console.log(`   ✅ Successfully added (ID: ${data[0].id})`);
    }
  }

  console.log('\n🎉 Seeding complete! Verifying...\n');

  // Verify the insertions
  const { data: locations, error } = await supabase
    .from('locations')
    .select('id, name, city, county, property_type, images, amenities')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('❌ Error verifying locations:', error.message);
  } else {
    console.log('📊 Latest locations in database:');
    locations?.forEach((loc, index) => {
      console.log(`   ${index + 1}. ${loc.name}`);
      console.log(`      City: ${loc.city}, County: ${loc.county}`);
      console.log(`      Type: ${loc.property_type}`);
      console.log(`      Images: ${loc.images?.length || 0}, Amenities: ${loc.amenities?.length || 0}`);
      console.log('');
    });
  }
}

// Run the seeding
seedLocations()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
