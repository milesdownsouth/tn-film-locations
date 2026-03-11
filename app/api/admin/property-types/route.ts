import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth-middleware';

// GET - Fetch all property types
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('property_types')
      .select('*')
      .order('display_name', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch property types' },
        { status: 500 }
      );
    }

    return NextResponse.json({ propertyTypes: data || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new property type
export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin();
    if (authError) return authError;

    const body = await request.json();
    const { name, display_name } = body;

    if (!name || !display_name) {
      return NextResponse.json(
        { error: 'Name and display name are required' },
        { status: 400 }
      );
    }

    // Sanitize the name to be lowercase, no spaces
    const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('property_types')
      .insert({ name: sanitizedName, display_name: display_name.trim() })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A property type with this name already exists' },
          { status: 409 }
        );
      }
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create property type' },
        { status: 500 }
      );
    }

    return NextResponse.json({ propertyType: data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
