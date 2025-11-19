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

    // Apply search filter (search across name, description, address, city, county, property_type, and amenities)
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,county.ilike.%${searchQuery}%,property_type.ilike.%${searchQuery}%,amenities.cs.{${searchQuery}}`);
    }

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

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data: locations, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch locations', details: error.message },
        { status: 500 }
      );
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      locations: locations || [],
      pagination: {
        page,
        limit,
        total: count || 0,
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
