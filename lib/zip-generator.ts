/**
 * ZIP File Generation Utility
 * Creates ZIP files of location images for download
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Download all images for a location as a ZIP file
 * @param locationName - Name of the location
 * @param imageUrls - Array of image URLs
 */
export async function downloadLocationImagesAsZip(
  locationName: string,
  imageUrls: string[]
): Promise<void> {
  if (imageUrls.length === 0) {
    throw new Error('No images to download');
  }

  const zip = new JSZip();
  const folder = zip.folder(locationName);

  if (!folder) {
    throw new Error('Failed to create ZIP folder');
  }

  // Fetch all images and add them to the ZIP
  const imagePromises = imageUrls.map(async (url, index) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed to fetch image: ${url}`);
        return null;
      }

      const blob = await response.blob();
      const extension = getFileExtension(url) || 'jpg';
      const fileName = `image-${(index + 1).toString().padStart(3, '0')}.${extension}`;

      folder.file(fileName, blob);
      return fileName;
    } catch (error) {
      console.error(`Error fetching image ${url}:`, error);
      return null;
    }
  });

  // Wait for all images to be added
  await Promise.all(imagePromises);

  // Generate the ZIP file
  const content = await zip.generateAsync({ type: 'blob' });

  // Trigger download
  const sanitizedName = locationName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const fileName = `${sanitizedName}-images.zip`;
  saveAs(content, fileName);
}

/**
 * Get file extension from URL
 * @param url - Image URL
 * @returns File extension without dot
 */
function getFileExtension(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-z0-9]+)$/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Download multiple locations' images as separate folders in one ZIP
 * @param locations - Array of objects with locationName and imageUrls
 */
export async function downloadMultipleLocationsAsZip(
  locations: Array<{ locationName: string; imageUrls: string[] }>
): Promise<void> {
  if (locations.length === 0) {
    throw new Error('No locations to download');
  }

  const zip = new JSZip();

  // Process each location
  for (const location of locations) {
    if (location.imageUrls.length === 0) continue;

    const sanitizedName = location.locationName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const folder = zip.folder(sanitizedName);

    if (!folder) continue;

    // Add all images for this location
    const imagePromises = location.imageUrls.map(async (url, index) => {
      try {
        const response = await fetch(url);
        if (!response.ok) return null;

        const blob = await response.blob();
        const extension = getFileExtension(url) || 'jpg';
        const fileName = `image-${(index + 1).toString().padStart(3, '0')}.${extension}`;

        folder.file(fileName, blob);
        return fileName;
      } catch (error) {
        console.error(`Error fetching image ${url}:`, error);
        return null;
      }
    });

    await Promise.all(imagePromises);
  }

  // Generate the ZIP file
  const content = await zip.generateAsync({ type: 'blob' });

  // Trigger download
  const fileName = `tn-film-locations-${new Date().toISOString().split('T')[0]}.zip`;
  saveAs(content, fileName);
}
