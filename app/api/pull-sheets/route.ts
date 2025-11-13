import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-middleware';

/**
 * GET - Get all pull sheets for the current user
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

    // Get all pull sheets for user
    const { data: pullSheets, error } = await supabase
      .from('pull_sheets')
      .select(`
        *,
        pull_sheet_locations(
          location_id,
          locations(id, name, city, images, property_type)
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform data to include location count
    const transformedSheets = pullSheets?.map(sheet => ({
      ...sheet,
      location_count: sheet.pull_sheet_locations?.length || 0,
      locations: sheet.pull_sheet_locations?.map((psl: any) => psl.locations) || []
    }));

    return NextResponse.json({ pull_sheets: transformedSheets || [] });
  } catch (error) {
    console.error('Error fetching pull sheets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pull sheets' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new pull sheet
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
    const { name, description, is_public, location_ids } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create pull sheet
    const { data: pullSheet, error: sheetError } = await supabase
      .from('pull_sheets')
      .insert([{
        user_id: user.id,
        name,
        description: description || null,
        is_public: is_public || false
      }])
      .select()
      .single();

    if (sheetError) {
      throw sheetError;
    }

    // Add locations if provided
    if (location_ids && location_ids.length > 0) {
      const locationEntries = location_ids.map((location_id: string) => ({
        pull_sheet_id: pullSheet.id,
        location_id
      }));

      const { error: locationsError } = await supabase
        .from('pull_sheet_locations')
        .insert(locationEntries);

      if (locationsError) {
        console.error('Error adding locations:', locationsError);
        // Don't fail the whole request, sheet is created
      }
    }

    return NextResponse.json({ pull_sheet: pullSheet }, { status: 201 });
  } catch (error) {
    console.error('Error creating pull sheet:', error);
    return NextResponse.json(
      { error: 'Failed to create pull sheet' },
      { status: 500 }
    );
  }
}
