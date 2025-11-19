import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract query parameters
    const searchQuery = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';
    const county = searchParams.get('county') || '';
    const propertyType = searchParams.get('property_type') || '';
    const amenities = searchParams.get('amenities')?.split(',').filter(Boolean) || [];
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Create Supabase client
    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('locations')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    // Apply filters
    if (city) {
      query = query.eq('city', city);
    }

    if (county) {
      query = query.eq('county', county);
    }

    if (propertyType) {
      query = query.eq('property_type', propertyType);
    }

    // Apply amenities filter (locations must have all specified amenities)
    if (amenities.length > 0) {
      query = query.contains('amenities', amenities);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // If there's a search query, fetch more results for client-side filtering
    // Otherwise use normal pagination
    if (searchQuery) {
      // Fetch more results to filter client-side (including amenities search)
      query = query.range(0, 999);
    } else {
      // Normal pagination
      query = query.range(offset, offset + limit - 1);
    }

    // Execute query
    const { data: allLocations, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch locations', details: error.message },
        { status: 500 }
      );
    }

    let locations = allLocations || [];

    // If there's a search query, filter client-side across all fields including amenities
    if (searchQuery && locations.length > 0) {
      const searchLower = searchQuery.toLowerCase();
      locations = locations.filter(location => {
        // Check text fields
        const matchesText =
          location.name?.toLowerCase().includes(searchLower) ||
          location.description?.toLowerCase().includes(searchLower) ||
          location.address?.toLowerCase().includes(searchLower) ||
          location.city?.toLowerCase().includes(searchLower) ||
          location.county?.toLowerCase().includes(searchLower) ||
          location.property_type?.toLowerCase().includes(searchLower);

        // Check amenities array
        const matchesAmenity = location.amenities?.some((amenity: string) =>
          amenity.toLowerCase().includes(searchLower)
        );

        return matchesText || matchesAmenity;
      });
    }

    // Calculate count after filtering
    const count = locations.length;

    // Apply pagination to filtered results
    if (searchQuery) {
      const start = offset;
      const end = offset + limit;
      locations = locations.slice(start, end);
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);

    return NextResponse.json({
      locations: locations || [],
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        searchQuery,
        city,
        county,
        propertyType,
        amenities,
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
