/**
 * PDF Generation Utility
 * Generates styled PDFs of saved locations for users
 */

import { jsPDF } from 'jspdf';
import type { Location } from '@/types/database';

// Brand colors
const BRAND_RED = '#C41E3A';
const BRAND_RED_RGB = { r: 196, g: 30, b: 58 };
const DARK_GRAY = '#333333';
const LIGHT_GRAY = '#666666';
const BORDER_GRAY = '#E5E5E5';

/**
 * Helper function to load image as base64
 * Uses server-side proxy to avoid CORS issues with R2 images
 */
async function loadImageAsBase64(url: string): Promise<string> {
  try {
    // Use image proxy API to fetch R2 images server-side (avoids CORS)
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      console.error('Image proxy failed:', response.status);
      return '';
    }

    const data = await response.json();
    return data.dataUrl || '';
  } catch (error) {
    console.error('Error loading image:', error);
    return '';
  }
}

/**
 * Draw a horizontal line
 */
function drawLine(doc: jsPDF, y: number, margin: number) {
  const pageWidth = doc.internal.pageSize.width;
  doc.setDrawColor(229, 229, 229); // Light gray
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
}

/**
 * Generate a PDF of saved locations
 * @param locations - Array of location objects
 * @param userEmail - User's email for the header
 * @returns PDF blob
 */
export async function generateLocationsPDF(
  locations: Location[],
  userEmail: string
): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 6;

  // ========== HEADER ==========
  // Red header bar
  doc.setFillColor(BRAND_RED_RGB.r, BRAND_RED_RGB.g, BRAND_RED_RGB.b);
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('TENNESSEE FILM LOCATIONS', margin, 18);

  // Subtitle
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Location Pull Sheet', margin, 28);

  // ========== META INFO ==========
  let yPosition = 50;

  doc.setTextColor(102, 102, 102);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Prepared for: ${userEmail}`, margin, yPosition);
  doc.text(`Date: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, pageWidth - margin - 60, yPosition);

  yPosition += 5;
  doc.text(`${locations.length} Location${locations.length !== 1 ? 's' : ''}`, margin, yPosition + 5);

  yPosition += 15;
  drawLine(doc, yPosition, margin);
  yPosition += 15;

  // ========== LOCATIONS ==========
  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];

    // Check if we need a new page (need space for at least title + image)
    if (yPosition > pageHeight - 120) {
      doc.addPage();
      yPosition = 25;
    }

    // Location number badge
    doc.setFillColor(BRAND_RED_RGB.r, BRAND_RED_RGB.g, BRAND_RED_RGB.b);
    doc.circle(margin + 5, yPosition - 2, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}`, margin + 5, yPosition, { align: 'center' });

    // Location name
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(location.name.toUpperCase(), margin + 15, yPosition);
    yPosition += 8;

    // Location subtitle (city, county)
    doc.setTextColor(102, 102, 102);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${location.city}, ${location.county} County`, margin + 15, yPosition);
    yPosition += 10;

    // Add featured image if available
    if (location.images && location.images.length > 0) {
      try {
        const imageData = await loadImageAsBase64(location.images[0]);
        if (imageData) {
          const imgWidth = 90;
          const imgHeight = 60;

          // Check if image would fit on current page
          if (yPosition + imgHeight > pageHeight - 50) {
            doc.addPage();
            yPosition = 25;
          }

          // Add a subtle border around the image
          doc.setDrawColor(229, 229, 229);
          doc.setLineWidth(0.5);
          doc.rect(margin, yPosition, imgWidth, imgHeight);

          doc.addImage(imageData, 'JPEG', margin, yPosition, imgWidth, imgHeight);

          // Details column next to image
          const detailsX = margin + imgWidth + 10;
          let detailsY = yPosition + 5;

          doc.setTextColor(51, 51, 51);
          doc.setFontSize(9);

          // Property Type
          doc.setFont('helvetica', 'bold');
          doc.text('PROPERTY TYPE', detailsX, detailsY);
          detailsY += 5;
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(102, 102, 102);
          const propertyType = location.property_type.charAt(0).toUpperCase() + location.property_type.slice(1);
          doc.text(propertyType, detailsX, detailsY);
          detailsY += 10;

          // Year Built
          if (location.year_built) {
            doc.setTextColor(51, 51, 51);
            doc.setFont('helvetica', 'bold');
            doc.text('YEAR BUILT', detailsX, detailsY);
            detailsY += 5;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(102, 102, 102);
            doc.text(location.year_built.toString(), detailsX, detailsY);
            detailsY += 10;
          }

          // Square Footage
          if (location.square_footage) {
            doc.setTextColor(51, 51, 51);
            doc.setFont('helvetica', 'bold');
            doc.text('SIZE', detailsX, detailsY);
            detailsY += 5;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(102, 102, 102);
            doc.text(`${location.square_footage.toLocaleString()} sq ft`, detailsX, detailsY);
            detailsY += 10;
          }

          // Parking
          if (location.parking) {
            doc.setTextColor(51, 51, 51);
            doc.setFont('helvetica', 'bold');
            doc.text('PARKING', detailsX, detailsY);
            detailsY += 5;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(102, 102, 102);
            const parkingLines = doc.splitTextToSize(location.parking, contentWidth - imgWidth - 15);
            parkingLines.forEach((line: string) => {
              doc.text(line, detailsX, detailsY);
              detailsY += 5;
            });
          }

          yPosition += imgHeight + 10;
        }
      } catch (error) {
        console.error('Error adding image to PDF:', error);
      }
    } else {
      // No image - show details in a row
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(9);

      let detailText = `Property Type: ${location.property_type}`;
      if (location.year_built) detailText += ` | Year Built: ${location.year_built}`;
      if (location.square_footage) detailText += ` | ${location.square_footage.toLocaleString()} sq ft`;

      doc.text(detailText, margin, yPosition);
      yPosition += 10;
    }

    // Features (formerly Amenities)
    if (location.amenities && location.amenities.length > 0) {
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('FEATURES', margin, yPosition);
      yPosition += 5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(102, 102, 102);
      const amenitiesText = location.amenities.join(' • ');
      const amenitiesLines = doc.splitTextToSize(amenitiesText, contentWidth);
      amenitiesLines.forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 25;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 3;
    }

    // Description
    if (location.description) {
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('DESCRIPTION', margin, yPosition);
      yPosition += 5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(102, 102, 102);
      const descriptionLines = doc.splitTextToSize(location.description, contentWidth);

      // Limit description to first 5 lines to save space
      const maxDescLines = Math.min(descriptionLines.length, 5);
      for (let i = 0; i < maxDescLines; i++) {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 25;
        }
        doc.text(descriptionLines[i], margin, yPosition);
        yPosition += lineHeight;
      }
      if (descriptionLines.length > 5) {
        doc.text('...', margin, yPosition);
        yPosition += lineHeight;
      }
    }

    // Additional photos note
    if (location.images && location.images.length > 1) {
      yPosition += 3;
      doc.setTextColor(BRAND_RED_RGB.r, BRAND_RED_RGB.g, BRAND_RED_RGB.b);
      doc.setFontSize(8);
      doc.text(`+ ${location.images.length - 1} additional photo${location.images.length > 2 ? 's' : ''} available`, margin, yPosition);
      yPosition += lineHeight;
    }

    // Separator between locations
    if (index < locations.length - 1) {
      yPosition += 8;
      drawLine(doc, yPosition, margin);
      yPosition += 15;
    }
  }

  // ========== FOOTER ON ALL PAGES ==========
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer line
    doc.setDrawColor(229, 229, 229);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);

    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(153, 153, 153);
    doc.setFont('helvetica', 'normal');
    doc.text('Tennessee Film Locations', margin, pageHeight - 10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  return doc.output('blob');
}

/**
 * Download the generated PDF
 * @param locations - Array of location objects
 * @param userEmail - User's email
 * @param fileName - Optional custom filename
 */
export async function downloadLocationsPDF(
  locations: Location[],
  userEmail: string,
  fileName?: string
): Promise<void> {
  const pdf = await generateLocationsPDF(locations, userEmail);
  const defaultFileName = `tennessee-film-locations-${new Date().toISOString().split('T')[0]}.pdf`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(pdf);
  link.download = fileName || defaultFileName;
  link.click();

  // Clean up
  URL.revokeObjectURL(link.href);
}
