/**
 * Saved Locations Content
 * Client component for managing saved locations
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Location } from '@/types/database';
import CameraApertureLoader from '@/components/CameraApertureLoader';

export default function SavedLocationsContent() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedLocations();
  }, []);

  const fetchSavedLocations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/saved-locations');

      if (!response.ok) {
        throw new Error('Failed to fetch saved locations');
      }

      const data = await response.json();
      setLocations(data.locations);
    } catch (err) {
      console.error('Error fetching saved locations:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (locationId: string) => {
    if (!confirm('Remove this location from your saved list?')) {
      return;
    }

    try {
      const response = await fetch(`/api/saved-locations?location_id=${locationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to unsave location');
      }

      // Remove from state
      setLocations(prev => prev.filter(loc => loc.id !== locationId));
    } catch (err) {
      console.error('Error unsaving location:', err);
      alert('Failed to remove location. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-black text-center mb-4">
            SAVED LOCATIONS
          </h1>
          <p className="text-center text-gray-600">
            {locations.length} saved location{locations.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <CameraApertureLoader message="Loading saved locations..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 font-bold mb-2">Error: {error}</p>
            <button
              onClick={fetchSavedLocations}
              className="bg-[#C41E3A] text-white px-6 py-2 rounded hover:bg-[#a01729] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Locations Grid */}
        {!loading && !error && (
          <>
            {locations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">You haven't saved any locations yet</p>
                <Link
                  href="/search"
                  className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase inline-block"
                >
                  Browse Locations
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {locations.map((location) => (
                  <div key={location.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <Link href={`/locations/${location.id}`}>
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
                    </Link>
                    <div className="p-4">
                      <Link href={`/locations/${location.id}`}>
                        <p className="text-gray-600 text-sm">{location.city}</p>
                        <h3 className="text-lg font-bold text-black hover:text-[#C41E3A]">{location.name}</h3>
                        <p className="text-gray-500 text-sm mt-1 capitalize">
                          {location.property_type}
                        </p>
                      </Link>
                      <button
                        onClick={() => handleUnsave(location.id)}
                        className="mt-3 w-full text-sm text-red-600 hover:text-red-900 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pull Sheets Link */}
            {locations.length > 0 && (
              <div className="text-center py-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-4">Create a Pull Sheet</h2>
                <p className="text-gray-600 mb-6">
                  Organize your saved locations into pull sheets that you can share and download.
                </p>
                <Link
                  href="/account/pull-sheets/new"
                  className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase inline-block"
                >
                  Create Pull Sheet
                </Link>
              </div>
            )}
          </>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/account"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Account
          </Link>
        </div>
      </div>
    </div>
  );
}
