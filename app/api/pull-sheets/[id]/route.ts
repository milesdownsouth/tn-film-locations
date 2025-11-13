import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, checkResourceOwnership } from '@/lib/auth-middleware';

/**
 * GET - Get a single pull sheet with locations
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get pull sheet with locations
    const { data: pullSheet, error } = await supabase
      .from('pull_sheets')
      .select(`
        *,
        pull_sheet_locations(
          id,
          location_id,
          added_at,
          locations(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !pullSheet) {
      return NextResponse.json(
        { error: 'Pull sheet not found' },
        { status: 404 }
      );
    }

    // Check if user has access (owner or public)
    const { user } = await requireAuth();

    if (!pullSheet.is_public && (!user || pullSheet.user_id !== user.id)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Transform locations
    const locations = pullSheet.pull_sheet_locations?.map((psl: any) => psl.locations) || [];

    return NextResponse.json({
      pull_sheet: {
        ...pullSheet,
        locations
      }
    });
  } catch (error) {
    console.error('Error fetching pull sheet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pull sheet' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update a pull sheet
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { redirect: authRedirect, user } = await requireAuth();
  if (authRedirect || !user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const { name, description, is_public, location_ids } = await request.json();

    const supabase = await createClient();

    // Check ownership
    const { data: existing } = await supabase
      .from('pull_sheets')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update pull sheet
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (is_public !== undefined) updateData.is_public = is_public;

    const { data: pullSheet, error: updateError } = await supabase
      .from('pull_sheets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Update locations if provided
    if (location_ids !== undefined) {
      // Delete existing locations
      await supabase
        .from('pull_sheet_locations')
        .delete()
        .eq('pull_sheet_id', id);

      // Add new locations
      if (location_ids.length > 0) {
        const locationEntries = location_ids.map((location_id: string) => ({
          pull_sheet_id: id,
          location_id
        }));

        await supabase
          .from('pull_sheet_locations')
          .insert(locationEntries);
      }
    }

    return NextResponse.json({ pull_sheet: pullSheet });
  } catch (error) {
    console.error('Error updating pull sheet:', error);
    return NextResponse.json(
      { error: 'Failed to update pull sheet' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete a pull sheet
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { redirect: authRedirect, user } = await requireAuth();
  if (authRedirect || !user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check ownership
    const { data: existing } = await supabase
      .from('pull_sheets')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Delete pull sheet (cascade will delete pull_sheet_locations)
    const { error } = await supabase
      .from('pull_sheets')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pull sheet:', error);
    return NextResponse.json(
      { error: 'Failed to delete pull sheet' },
      { status: 500 }
    );
  }
}
