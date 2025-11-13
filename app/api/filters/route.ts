import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all active locations with relevant fields
    const { data: locations, error } = await supabase
      .from('locations')
      .select('property_type, county, city')
      .eq('is_active', true);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch filter options' },
        { status: 500 }
      );
    }

    // Extract unique values and sort alphabetically
    const propertyTypes = Array.from(
      new Set(locations?.map(loc => loc.property_type).filter(Boolean) || [])
    ).sort();

    const counties = Array.from(
      new Set(locations?.map(loc => loc.county).filter(Boolean) || [])
    ).sort();

    const cities = Array.from(
      new Set(locations?.map(loc => loc.city).filter(Boolean) || [])
    ).sort();

    return NextResponse.json({
      propertyTypes,
      counties,
      cities,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
