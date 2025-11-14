/**
 * Amenities API
 * Returns all unique amenities from active locations
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all active locations with amenities
    const { data: locations, error } = await supabase
      .from('locations')
      .select('amenities')
      .eq('is_active', true);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch amenities' },
        { status: 500 }
      );
    }

    // Extract and flatten all amenities
    const allAmenities = locations?.flatMap(loc => loc.amenities || []) || [];

    // Get unique amenities and sort alphabetically
    const uniqueAmenities = Array.from(new Set(allAmenities)).sort();

    return NextResponse.json({ amenities: uniqueAmenities });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
