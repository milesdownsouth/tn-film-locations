/**
 * PDF Generation Utility
 * Generates PDFs of saved locations for users
 */

import { jsPDF } from 'jspdf';
import type { Location } from '@/types/database';

/**
 * Helper function to load image as base64
 */
async function loadImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    return '';
  }
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

  // Set up the document
  doc.setFontSize(20);
  doc.text('TN Film Locations', 20, 20);

  doc.setFontSize(12);
  doc.text(`Pull Sheet for ${userEmail}`, 20, 30);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 37);

  let yPosition = 50;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;

  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];

    // Check if we need a new page
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = 20;
    }

    // Location number and name
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${location.name}`, margin, yPosition);
    yPosition += lineHeight + 3;

    // Add featured image if available
    if (location.images && location.images.length > 0) {
      try {
        const imageData = await loadImageAsBase64(location.images[0]);
        if (imageData) {
          const imgWidth = 80;
          const imgHeight = 60;

          // Check if image would fit on current page
          if (yPosition + imgHeight > pageHeight - 40) {
            doc.addPage();
            yPosition = 20;
          }

          doc.addImage(imageData, 'JPEG', margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 5;
        }
      } catch (error) {
        console.error('Error adding image to PDF:', error);
      }
    }

    // Location details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text(`City: ${location.city}, County: ${location.county}`, margin, yPosition);
    yPosition += lineHeight;

    doc.text(`Property Type: ${location.property_type}`, margin, yPosition);
    yPosition += lineHeight;

    if (location.year_built) {
      doc.text(`Year Built: ${location.year_built}`, margin, yPosition);
      yPosition += lineHeight;
    }

    if (location.square_footage) {
      doc.text(`Square Footage: ${location.square_footage.toLocaleString()} sq ft`, margin, yPosition);
      yPosition += lineHeight;
    }

    if (location.parking) {
      doc.text(`Parking: ${location.parking}`, margin, yPosition);
      yPosition += lineHeight;
    }

    if (location.amenities && location.amenities.length > 0) {
      doc.text(`Amenities: ${location.amenities.join(', ')}`, margin, yPosition);
      yPosition += lineHeight;
    }

    // Description (wrapped text)
    doc.text(`Description:`, margin, yPosition);
    yPosition += lineHeight;

    const descriptionLines = doc.splitTextToSize(
      location.description,
      doc.internal.pageSize.width - margin * 2
    );

    descriptionLines.forEach((line: string) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin + 5, yPosition);
      yPosition += lineHeight;
    });

    if (location.images && location.images.length > 1) {
      doc.text(`Additional Photos: ${location.images.length - 1} photo(s)`, margin, yPosition);
    }
    yPosition += lineHeight * 2;
  }

  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      pageHeight - 10,
      { align: 'center' }
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
  const defaultFileName = `tn-film-locations-${new Date().toISOString().split('T')[0]}.pdf`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(pdf);
  link.download = fileName || defaultFileName;
  link.click();

  // Clean up
  URL.revokeObjectURL(link.href);
}
