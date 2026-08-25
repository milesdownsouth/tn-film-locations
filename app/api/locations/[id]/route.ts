import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { toPublicLocation } from '@/lib/public-location';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID
    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Fetch the location
    const { data: location, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Location not found' },
          { status: 404 }
        );
      }

      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch location', details: error.message },
        { status: 500 }
      );
    }

    // Fetch related locations (same property type or same city, excluding current)
    const { data: relatedLocations } = await supabase
      .from('locations')
      .select('id, name, city, county, property_type, images, square_footage')
      .eq('is_active', true)
      .neq('id', id)
      .or(`property_type.eq.${location.property_type},city.eq.${location.city}`)
      .limit(4);

    return NextResponse.json({
      location: toPublicLocation(location),
      relatedLocations: relatedLocations || [],
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
