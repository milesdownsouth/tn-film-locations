/**
 * Presigned URL API
 * Generates presigned URLs for direct browser-to-R2 uploads
 * This bypasses Vercel's 4.5MB limit by allowing direct uploads to storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { generatePresignedUploadUrl } from '@/lib/cloudflare-r2';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Check admin authentication
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { locationName, fileName, contentType } = body;

    // Validate required fields
    if (!locationName || !fileName || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: locationName, fileName, contentType' },
        { status: 400 }
      );
    }

    // Validate content type is an image
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Generate presigned URL
    const { uploadUrl, publicUrl, key } = await generatePresignedUploadUrl(
      locationName,
      fileName,
      contentType
    );

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
