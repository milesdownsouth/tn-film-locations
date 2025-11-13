# Seeding Test Locations

This guide explains how to add 5 test locations to your TN Film Locations database for testing the search functionality.

## Test Locations Overview

The seed data includes 5 diverse locations across Tennessee:

1. **Historic Red Barn Estate** - Franklin, Williamson County (Barn)
2. **Victorian Mansion on Music Row** - Nashville, Davidson County (Mansion)
3. **Industrial Warehouse Loft** - Chattanooga, Hamilton County (Warehouse)
4. **Smoky Mountain Forest Retreat** - Gatlinburg, Sevier County (Forest)
5. **Modern Glass Office Tower** - Memphis, Shelby County (Office)

Each location includes:
- Complete address and description
- Property type and specifications
- Multiple amenities
- 4-5 sample images from Unsplash
- Contact information

## Option 1: Using the Node.js Script (Recommended)

### Prerequisites

1. Make sure you have your environment variables set up:

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add your Supabase credentials
# You need at least:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY)
```

2. Install dependencies (includes tsx):

```bash
npm install
```

### Run the Seed Script

```bash
npm run seed
```

The script will:
- Connect to your Supabase database
- Insert all 5 test locations
- Verify the insertions
- Display a summary of added locations

### Expected Output

```
🌱 Starting to seed test locations...

📍 Adding: Historic Red Barn Estate (Franklin, Williamson)
   ✅ Successfully added (ID: abc123...)
📍 Adding: Victorian Mansion on Music Row (Nashville, Davidson)
   ✅ Successfully added (ID: def456...)
...

🎉 Seeding complete! Verifying...

📊 Latest locations in database:
   1. Historic Red Barn Estate
      City: Franklin, County: Williamson
      Type: barn
      Images: 4, Amenities: 7
...

✨ Done!
```

## Option 2: Using SQL Directly

If you prefer to use SQL or don't want to set up the environment variables:

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Open the file `seed-test-locations.sql`
4. Copy and paste the entire contents into the SQL Editor
5. Click "Run" or press `Cmd/Ctrl + Enter`

The SQL script includes a verification query at the end to show the added locations.

## Verifying the Seed

After seeding, you can verify the locations in several ways:

### 1. In Supabase Dashboard
- Go to Table Editor → `locations`
- You should see 5 new rows

### 2. Using the Search Page
- Start your dev server: `npm run dev`
- Navigate to http://localhost:3000/search
- You should see all 5 locations
- Try filtering by:
  - **Property Type**: barn, mansion, warehouse, forest, office
  - **County**: Williamson, Davidson, Hamilton, Sevier, Shelby
  - **City**: Franklin, Nashville, Chattanooga, Gatlinburg, Memphis

### 3. Using the API
```bash
# Get all locations
curl http://localhost:3000/api/locations

# Search for barns
curl http://localhost:3000/api/locations?property_type=barn

# Search in Nashville
curl http://localhost:3000/api/locations?city=Nashville

# Search for "mountain"
curl "http://localhost:3000/api/locations?q=mountain"
```

## Troubleshooting

### "Missing required environment variables"
- Make sure you've created `.env.local` from `.env.local.example`
- Verify your Supabase URL and keys are correct
- Check that the file is in the root directory

### "Permission denied" or "RLS policy violation"
- The locations table has Row Level Security (RLS) enabled
- The seed script uses the anon key, which should work with the "Anyone can read active locations" policy
- If issues persist, you can temporarily use the service role key (be careful with this!)

### "tsx: command not found"
```bash
# Reinstall dependencies
npm install

# Or run directly with npx
npx tsx scripts/seed-locations.ts
```

### Locations don't appear in search
- Check that `is_active` is `true` for all locations
- Verify the RLS policies are set up correctly
- Check browser console for API errors

## Cleaning Up

To remove the test locations:

```sql
-- Run this in Supabase SQL Editor
DELETE FROM public.locations
WHERE name IN (
  'Historic Red Barn Estate',
  'Victorian Mansion on Music Row',
  'Industrial Warehouse Loft',
  'Smoky Mountain Forest Retreat',
  'Modern Glass Office Tower'
);
```

## Next Steps

After seeding:

1. **Test the Search**: Try different search terms and filters
2. **Test Location Details**: Click on a location to view the detail page
3. **Test Downloads**: Try the PDF and ZIP download buttons
4. **Add More Locations**: Use the admin panel (when implemented) or modify the seed script

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check the terminal where `npm run dev` is running
3. Verify your Supabase connection in the Supabase dashboard
4. Make sure the schema is up to date (run `supabase-schema.sql` if needed)
