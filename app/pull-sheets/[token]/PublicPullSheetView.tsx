/**
 * Public Pull Sheet View
 * Client component for viewing shared pull sheets
 */

'use client';

import Link from 'next/link';
import { Location } from '@/types/database';

interface PullSheet {
  id: string;
  name: string;
  description: string | null;
  locations: Location[];
  user_id: string;
}

interface PublicPullSheetViewProps {
  pullSheet: PullSheet;
}

export default function PublicPullSheetView({ pullSheet }: PublicPullSheetViewProps) {
  const handleDownloadPDF = async () => {
    try {
      const { downloadLocationsPDF } = await import('@/lib/pdf-generator');
      downloadLocationsPDF(
        pullSheet.locations,
        'Shared Pull Sheet',
        `${pullSheet.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
      );
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-semibold text-black mb-2">{pullSheet.name}</h1>
          {pullSheet.description && (
            <p className="text-gray-600 text-lg mt-2">{pullSheet.description}</p>
          )}
          <p className="text-gray-500 mt-2">
            {pullSheet.locations.length} location{pullSheet.locations.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Download Button */}
        <div className="mb-8">
          <button
            onClick={handleDownloadPDF}
            className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
          >
            Download PDF
          </button>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pullSheet.locations.map((location) => (
            <Link key={location.id} href={`/locations/${location.id}`}>
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative h-64 rounded-t-lg overflow-hidden bg-gray-200">
                  {location.images && location.images.length > 0 ? (
                    <img
                      src={location.images[0]}
                      alt={location.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm">{location.city}, {location.county}</p>
                  <h3 className="text-lg font-semibold text-black">{location.name}</h3>
                  <p className="text-gray-500 text-sm mt-1 capitalize">
                    {location.property_type}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center border-t border-gray-200 pt-8">
          <p className="text-gray-600 mb-4">Want to create your own location pull sheets?</p>
          <Link
            href="/auth/signup"
            className="inline-block bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
          >
            Sign Up for Free
          </Link>
        </div>
      </div>
    </div>
  );
}
