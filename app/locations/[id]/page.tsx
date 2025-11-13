/**
 * Location Detail Page - Matches Design Exactly
 */

'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Location } from '@/types/database';
import { generateLocationsPDF } from '@/lib/pdf-generator';
import { downloadLocationImagesAsZip } from '@/lib/zip-generator';

interface LocationDetailResponse {
  location: Location;
  relatedLocations: Partial<Location>[];
}

export default function LocationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isSaved, setIsSaved] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [relatedLocations, setRelatedLocations] = useState<Partial<Location>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch location data
  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/locations/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Location not found');
          }
          throw new Error('Failed to fetch location');
        }

        const data: LocationDetailResponse = await response.json();
        setLocation(data.location);
        setRelatedLocations(data.relatedLocations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching location:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save to user's saved locations via API
  };

  const handleDownloadPDF = async () => {
    if (!location) return;

    try {
      generateLocationsPDF([location], 'guest@tnfilmlocations.com');
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleDownloadZIP = async () => {
    if (!location) return;

    try {
      await downloadLocationImagesAsZip(location.name, location.images || []);
    } catch (err) {
      console.error('Error downloading ZIP:', err);
      alert('Failed to download images. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C41E3A]"></div>
          <p className="mt-4 text-gray-600">Loading location...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !location) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 font-bold text-xl mb-4">
            {error || 'Location not found'}
          </p>
          <Link
            href="/search"
            className="bg-[#C41E3A] text-white px-6 py-3 rounded hover:bg-[#a01729] transition-colors"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const heroImage = location.images && location.images.length > 0
    ? location.images[0]
    : 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2000&auto=format&fit=crop';

  return (
    <div className="bg-white">
      {/* Hero Section with Location Name */}
      <section
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${heroImage}')`
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-12">
          <p className="text-white text-lg mb-2">{location.city}, {location.county}</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white uppercase">{location.name}</h1>
        </div>

        {/* Save Button - Top Right */}
        <button
          onClick={handleSave}
          className="absolute top-8 right-8 bg-white text-black px-8 py-3 rounded hover:bg-gray-100 transition-colors font-bold uppercase"
        >
          {isSaved ? 'SAVED' : 'SAVE'}
        </button>
      </section>

      {/* Info Bar */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:border-r border-gray-300">
              <p className="text-sm font-bold text-black uppercase mb-2">CITY</p>
              <p className="text-gray-700">{location.city}</p>
            </div>
            <div className="text-center md:border-r border-gray-300">
              <p className="text-sm font-bold text-black uppercase mb-2">COUNTY</p>
              <p className="text-gray-700">{location.county}</p>
            </div>
            <div className="text-center md:border-r border-gray-300">
              <p className="text-sm font-bold text-black uppercase mb-2">TYPE</p>
              <p className="text-gray-700 capitalize">{location.property_type}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-black uppercase mb-2">SIZE</p>
              <p className="text-gray-700">
                {location.square_footage ? `${location.square_footage.toLocaleString()} sq ft` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      {location.description && (
        <section className="bg-white py-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-black mb-4">DESCRIPTION</h2>
            <p className="text-gray-700 leading-relaxed">{location.description}</p>
          </div>
        </section>
      )}

      {/* Amenities */}
      {location.amenities && location.amenities.length > 0 && (
        <section className="bg-white py-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-black mb-4">AMENITIES</h2>
            <div className="flex flex-wrap gap-2">
              {location.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional Info */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {location.year_built && (
              <div>
                <p className="text-sm font-bold text-black uppercase mb-2">YEAR BUILT</p>
                <p className="text-gray-700">{location.year_built}</p>
              </div>
            )}
            {location.parking && (
              <div>
                <p className="text-sm font-bold text-black uppercase mb-2">PARKING</p>
                <p className="text-gray-700">{location.parking}</p>
              </div>
            )}
            {location.address && (
              <div>
                <p className="text-sm font-bold text-black uppercase mb-2">ADDRESS</p>
                <p className="text-gray-700">{location.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Download Buttons */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDownloadPDF}
              className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
            >
              DOWNLOAD PDF
            </button>
            <button
              onClick={handleDownloadZIP}
              disabled={!location.images || location.images.length === 0}
              className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              DOWNLOAD ZIP
            </button>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      {location.images && location.images.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-black mb-6">PHOTO GALLERY</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {location.images.map((image, index) => (
                <div
                  key={index}
                  className="bg-gray-200 h-64 rounded-lg hover:opacity-90 transition-opacity cursor-pointer overflow-hidden"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${location.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Locations */}
      {relatedLocations.length > 0 && (
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-black mb-12">
              RELATED LOCATIONS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedLocations.map((loc) => (
                <Link key={loc.id} href={`/locations/${loc.id}`}>
                  <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-64 rounded-t-lg overflow-hidden bg-gray-200">
                      {loc.images && loc.images.length > 0 ? (
                        <img
                          src={loc.images[0]}
                          alt={loc.name || 'Location'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 text-sm">{loc.city}</p>
                      <h3 className="text-lg font-bold text-black">{loc.name}</h3>
                      {loc.property_type && (
                        <p className="text-gray-500 text-sm mt-1 capitalize">
                          {loc.property_type}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
