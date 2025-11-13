import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { uploadImages, deleteImages } from '@/lib/cloudflare-r2';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin authentication
  const { error: authError, user } = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
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
    };

    // Get existing images that should be kept
    const existingImages = JSON.parse(formData.get('existing_images') as string || '[]');

    // Extract new image files
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'images' && value instanceof File) {
        imageFiles.push(value);
      }
    }

    // Upload new images to R2
    let newImageUrls: string[] = [];
    if (imageFiles.length > 0) {
      try {
        newImageUrls = await uploadImages(imageFiles, locationData.name);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload images' },
          { status: 500 }
        );
      }
    }

    // Combine existing and new images
    const allImages = [...existingImages, ...newImageUrls];

    // Update location in database
    const supabase = await createClient();
    const { data: location, error: dbError } = await supabase
      .from('locations')
      .update({
        ...locationData,
        images: allImages,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to update location', details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ location });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin authentication
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;

    const supabase = await createClient();

    // Get location first to retrieve image URLs
    const { data: location, error: fetchError } = await supabase
      .from('locations')
      .select('images')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Delete location from database
    const { error: deleteError } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Database error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete location', details: deleteError.message },
        { status: 500 }
      );
    }

    // Delete images from R2 (don't fail if this errors)
    if (location.images && location.images.length > 0) {
      try {
        await deleteImages(location.images);
      } catch (imageError) {
        console.error('Error deleting images from R2:', imageError);
        // Continue anyway - location is already deleted from DB
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
