/**
 * Cloudflare R2 Integration
 * Handles image uploads and management with automatic optimization
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

// Initialize R2 client (R2 is S3-compatible)
export function getR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

/**
 * Upload an image to Cloudflare R2 with automatic optimization
 * - Converts to WebP format (60-80% smaller than JPG/PNG)
 * - Resizes to max 1920x1920 (maintains aspect ratio)
 * - Optimizes quality (85% - excellent quality, smaller size)
 * - Strips metadata for privacy and smaller file size
 *
 * @param file - The file to upload
 * @param locationId - The location ID (for organizing files)
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  locationId: string
): Promise<string> {
  const client = getR2Client();
  const timestamp = Date.now();

  // Get original filename without extension
  const originalName = file.name.replace(/\.[^/.]+$/, '');
  const fileName = `locations/${locationId}/${timestamp}-${originalName}.webp`;

  // Process image with Sharp
  const buffer = Buffer.from(await file.arrayBuffer());
  const optimizedBuffer = await sharp(buffer)
    .resize(1920, 1920, {
      fit: 'inside', // Maintain aspect ratio, don't enlarge
      withoutEnlargement: true // Don't upscale smaller images
    })
    .webp({
      quality: 85, // High quality, good compression
      effort: 4 // Balance between compression and speed
    })
    .toBuffer();

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: fileName,
    Body: optimizedBuffer,
    ContentType: 'image/webp',
  });

  await client.send(command);

  // Return the public URL
  return `${process.env.R2_PUBLIC_URL}/${fileName}`;
}

/**
 * Upload multiple images to Cloudflare R2
 * @param files - Array of files to upload
 * @param locationId - The location ID
 * @returns Array of public URLs
 */
export async function uploadImages(
  files: File[],
  locationId: string
): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImage(file, locationId));
  return Promise.all(uploadPromises);
}

/**
 * Delete an image from Cloudflare R2
 * @param imageUrl - The full URL of the image to delete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  const client = getR2Client();

  // Extract the key from the URL
  const url = new URL(imageUrl);
  const key = url.pathname.substring(1); // Remove leading slash

  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  });

  await client.send(command);
}

/**
 * Delete multiple images from Cloudflare R2
 * @param imageUrls - Array of image URLs to delete
 */
export async function deleteImages(imageUrls: string[]): Promise<void> {
  const deletePromises = imageUrls.map(url => deleteImage(url));
  await Promise.all(deletePromises);
}
