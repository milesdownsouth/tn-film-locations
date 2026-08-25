/**
 * Batch Image Upload API
 * Uploads images in smaller batches to avoid payload size limits
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { uploadImages } from '@/lib/cloudflare-r2';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  // Check admin authentication
  const { error: authError } = await requireAdmin();
  if (authError) {
    return authError;
  }

  try {
    const formData = await request.formData();
    const locationName = formData.get('locationName') as string;

    if (!locationName) {
      return NextResponse.json(
        { error: 'Location name is required' },
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

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Upload images to R2
    const imageUrls = await uploadImages(imageFiles, locationName);

    return NextResponse.json({ imageUrls }, { status: 200 });
  } catch (error) {
    console.error('Batch upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}
