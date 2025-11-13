/**
 * Cloudflare R2 Integration
 * Handles image uploads and management
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

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
 * Upload an image to Cloudflare R2
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
  const fileName = `locations/${locationId}/${timestamp}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: fileName,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
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
