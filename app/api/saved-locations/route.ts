import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-middleware';

/**
 * GET - Get all saved locations for the current user
 */
export async function GET(request: NextRequest) {
  const { redirect: authRedirect, user } = await requireAuth();
  if (authRedirect || !user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const supabase = await createClient();

    // Get saved location IDs
    const { data: savedLocations, error: savedError } = await supabase
      .from('saved_locations')
      .select('location_id, saved_at')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    if (savedError) {
      throw savedError;
    }

    if (!savedLocations || savedLocations.length === 0) {
      return NextResponse.json({ locations: [], savedLocationIds: [] });
    }

    const locationIds = savedLocations.map(sl => sl.location_id);

    // Get full location details
    const { data: locations, error: locationsError } = await supabase
      .from('locations')
      .select('*')
      .in('id', locationIds)
      .eq('is_active', true);

    if (locationsError) {
      throw locationsError;
    }

    return NextResponse.json({
      locations: locations || [],
      savedLocationIds: locationIds
    });
  } catch (error) {
    console.error('Error fetching saved locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved locations' },
      { status: 500 }
    );
  }
}

/**
 * POST - Save a location
 */
export async function POST(request: NextRequest) {
  const { redirect: authRedirect, user } = await requireAuth();
  if (authRedirect || !user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const { location_id } = await request.json();

    if (!location_id) {
      return NextResponse.json(
        { error: 'location_id is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved_locations')
      .select('id')
      .eq('user_id', user.id)
      .eq('location_id', location_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Location already saved' },
        { status: 400 }
      );
    }

    // Save the location
    const { data, error } = await supabase
      .from('saved_locations')
      .insert([{
        user_id: user.id,
        location_id
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ saved: data }, { status: 201 });
  } catch (error) {
    console.error('Error saving location:', error);
    return NextResponse.json(
      { error: 'Failed to save location' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Unsave a location
 */
export async function DELETE(request: NextRequest) {
  const { redirect: authRedirect, user } = await requireAuth();
  if (authRedirect || !user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = request.nextUrl;
    const location_id = searchParams.get('location_id');

    if (!location_id) {
      return NextResponse.json(
        { error: 'location_id is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('saved_locations')
      .delete()
      .eq('user_id', user.id)
      .eq('location_id', location_id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unsaving location:', error);
    return NextResponse.json(
      { error: 'Failed to unsave location' },
      { status: 500 }
    );
  }
}
