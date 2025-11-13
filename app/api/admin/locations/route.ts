import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { uploadImages } from '@/lib/cloudflare-r2';

export async function POST(request: NextRequest) {
  // Check admin authentication
  const { error: authError, user } = await requireAdmin();
  if (authError) return authError;

  try {
    const formData = await request.formData();

    // Extract location data
    const locationData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      county: formData.get('county') as string,
      description: formData.get('description') as string,
      property_type: formData.get('property_type') as string,
      year_built: formData.get('year_built') ? parseInt(formData.get('year_built') as string) : null,
      square_footage: formData.get('square_footage') ? parseInt(formData.get('square_footage') as string) : null,
      parking: formData.get('parking') as string || null,
      amenities: JSON.parse(formData.get('amenities') as string || '[]'),
      contact_name: formData.get('contact_name') as string,
      contact_email: formData.get('contact_email') as string,
      contact_phone: formData.get('contact_phone') as string,
      is_active: formData.get('is_active') === 'true',
      created_by: user?.id
    };

    // Validate required fields
    if (!locationData.name || !locationData.address || !locationData.city ||
        !locationData.county || !locationData.description || !locationData.property_type ||
        !locationData.contact_name || !locationData.contact_email || !locationData.contact_phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Extract image files
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'images' && value instanceof File) {
        imageFiles.push(value);
      }
    }

    // Upload images to R2
    let imageUrls: string[] = [];
    if (imageFiles.length > 0) {
      try {
        imageUrls = await uploadImages(imageFiles, locationData.name);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload images' },
          { status: 500 }
        );
      }
    }

    // Create location in database
    const supabase = await createClient();
    const { data: location, error: dbError } = await supabase
      .from('locations')
      .insert([{
        ...locationData,
        images: imageUrls
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create location', details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ location }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
