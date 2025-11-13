/**
 * New Pull Sheet Form
 * Client component for creating a new pull sheet
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Location } from '@/types/database';

export default function NewPullSheetForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedLocations();
  }, []);

  const fetchSavedLocations = async () => {
    try {
      const response = await fetch('/api/saved-locations');
      if (!response.ok) throw new Error('Failed to fetch saved locations');

      const data = await response.json();
      setSavedLocations(data.locations || []);
    } catch (err) {
      console.error('Error fetching saved locations:', err);
      setError('Failed to load saved locations');
    } finally {
      setLoading(false);
    }
  };

  const toggleLocation = (locationId: string) => {
    setSelectedLocationIds(prev =>
      prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  const selectAll = () => {
    setSelectedLocationIds(savedLocations.map(loc => loc.id));
  };

  const deselectAll = () => {
    setSelectedLocationIds([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a name for your pull sheet');
      return;
    }

    if (selectedLocationIds.length === 0) {
      alert('Please select at least one location');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/pull-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          is_public: isPublic,
          location_ids: selectedLocationIds,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create pull sheet');
      }

      // Success - redirect to pull sheets list
      router.push('/account/pull-sheets');
    } catch (err) {
      console.error('Error creating pull sheet:', err);
      alert(err instanceof Error ? err.message : 'Failed to create pull sheet');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-black mb-2">CREATE PULL SHEET</h1>
          <p className="text-gray-600">
            Select locations from your saved list to create a pull sheet
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C41E3A]"></div>
            <p className="mt-4 text-gray-600">Loading saved locations...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 font-bold mb-4">{error}</p>
            <Link
              href="/account/saved"
              className="text-[#C41E3A] hover:underline"
            >
              Go to Saved Locations
            </Link>
          </div>
        )}

        {/* Form */}
        {!loading && !error && (
          <>
            {savedLocations.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg mb-4">
                  You don't have any saved locations yet
                </p>
                <p className="text-gray-500 mb-6">
                  Save some locations first, then create a pull sheet
                </p>
                <Link
                  href="/search"
                  className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase inline-block"
                >
                  Browse Locations
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Pull Sheet Details */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-black mb-4">Details</h2>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                        placeholder="e.g., Downtown Nashville Locations"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                        placeholder="Optional description for this pull sheet"
                      />
                    </div>

                    {/* Public Toggle */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_public"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="w-4 h-4 text-[#C41E3A] border-gray-300 rounded focus:ring-[#C41E3A]"
                      />
                      <label htmlFor="is_public" className="ml-2 text-sm text-gray-700">
                        Make this pull sheet public (anyone with the link can view it)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Location Selection */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-black">
                      Select Locations ({selectedLocationIds.length} selected)
                    </h2>
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={selectAll}
                        className="text-sm text-[#C41E3A] hover:underline"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={deselectAll}
                        className="text-sm text-gray-600 hover:underline"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedLocations.map((location) => (
                      <div
                        key={location.id}
                        onClick={() => toggleLocation(location.id)}
                        className={`cursor-pointer rounded-lg border-2 transition-all ${
                          selectedLocationIds.includes(location.id)
                            ? 'border-[#C41E3A] bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="relative h-40 rounded-t-lg overflow-hidden bg-gray-200">
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
                          {selectedLocationIds.includes(location.id) && (
                            <div className="absolute top-2 right-2 bg-[#C41E3A] text-white rounded-full w-6 h-6 flex items-center justify-center">
                              ✓
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-500">{location.city}</p>
                          <h3 className="text-sm font-bold text-black line-clamp-1">
                            {location.name}
                          </h3>
                          <p className="text-xs text-gray-500 capitalize mt-1">
                            {location.property_type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <Link
                    href="/account/pull-sheets"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting || selectedLocationIds.length === 0}
                    className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Creating...' : 'Create Pull Sheet'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
