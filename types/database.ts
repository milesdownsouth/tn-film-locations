/**
 * Database Types for TN Film Locations
 * These types match the Supabase database schema
 */

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  county: string;
  description: string;
  property_type: string; // warehouse, mansion, forest, office, etc.
  year_built?: number;
  square_footage?: number;
  parking?: string;
  amenities: string[]; // Array of amenity strings
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  images: string[]; // Array of image URLs from Cloudflare R2 (max 50)
  is_active: boolean;
  is_featured: boolean; // Whether this location is featured on the home page
  created_by: string; // User ID of admin who added it
  created_at: string;
  updated_at: string;
}

export interface SavedLocation {
  id: string;
  user_id: string;
  location_id: string;
  saved_at: string;
}

export interface PullSheet {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  share_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface PullSheetLocation {
  id: string;
  pull_sheet_id: string;
  location_id: string;
  added_at: string;
}

// Pull sheet with locations populated
export interface PullSheetWithLocations extends PullSheet {
  locations: Location[];
}

// For creating a new pull sheet
export type CreatePullSheetInput = {
  name: string;
  description?: string;
  is_public?: boolean;
};

// For updating a pull sheet
export type UpdatePullSheetInput = Partial<Omit<PullSheet, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'share_token'>> & {
  id: string;
};

// For creating a new location (without auto-generated fields)
export type CreateLocationInput = Omit<Location, 'id' | 'created_at' | 'updated_at'>;

// For updating a location (all fields optional except id)
export type UpdateLocationInput = Partial<Omit<Location, 'id' | 'created_at' | 'updated_at'>> & {
  id: string;
};

// Property types are now managed in the database via the property_types table
// and editable from the admin panel at /admin/property-types

// Tennessee counties for filtering
export const TN_COUNTIES = [
  'Anderson', 'Bedford', 'Benton', 'Bledsoe', 'Blount',
  'Bradley', 'Campbell', 'Cannon', 'Carroll', 'Carter',
  'Cheatham', 'Chester', 'Claiborne', 'Clay', 'Cocke',
  'Coffee', 'Crockett', 'Cumberland', 'Davidson', 'Decatur',
  'DeKalb', 'Dickson', 'Dyer', 'Fayette', 'Fentress',
  'Franklin', 'Gibson', 'Giles', 'Grainger', 'Greene',
  'Grundy', 'Hamblen', 'Hamilton', 'Hancock', 'Hardeman',
  'Hardin', 'Hawkins', 'Haywood', 'Henderson', 'Henry',
  'Hickman', 'Houston', 'Humphreys', 'Jackson', 'Jefferson',
  'Johnson', 'Knox', 'Lake', 'Lauderdale', 'Lawrence',
  'Lewis', 'Lincoln', 'Loudon', 'McMinn', 'McNairy',
  'Macon', 'Madison', 'Marion', 'Marshall', 'Maury',
  'Meigs', 'Monroe', 'Montgomery', 'Moore', 'Morgan',
  'Obion', 'Overton', 'Perry', 'Pickett', 'Polk',
  'Putnam', 'Rhea', 'Roane', 'Robertson', 'Rutherford',
  'Scott', 'Sequatchie', 'Sevier', 'Shelby', 'Smith',
  'Stewart', 'Sullivan', 'Sumner', 'Tipton', 'Trousdale',
  'Unicoi', 'Union', 'Van Buren', 'Warren', 'Washington',
  'Wayne', 'Weakley', 'White', 'Williamson', 'Wilson',
] as const;

export type TNCounty = typeof TN_COUNTIES[number];

// Search/Filter parameters
export interface LocationFilters {
  city?: string;
  county?: TNCounty;
  property_type?: string;
  year_built_min?: number;
  year_built_max?: number;
  square_footage_min?: number;
  square_footage_max?: number;
  amenities?: string[];
  search_query?: string; // For text search in name/description
}
