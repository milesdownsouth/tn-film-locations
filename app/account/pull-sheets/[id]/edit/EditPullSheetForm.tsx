/**
 * Edit Pull Sheet Form
 * Client component for editing an existing pull sheet
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Location } from '@/types/database';

interface PullSheet {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  share_token: string | null;
  locations: Location[];
}

interface EditPullSheetFormProps {
  pullSheetId: string;
}

export default function EditPullSheetForm({ pullSheetId }: EditPullSheetFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [pullSheet, setPullSheet] = useState<PullSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [pullSheetId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch pull sheet data
      const pullSheetResponse = await fetch(`/api/pull-sheets/${pullSheetId}`);
      if (!pullSheetResponse.ok) {
        if (pullSheetResponse.status === 404) {
          throw new Error('Pull sheet not found');
        } else if (pullSheetResponse.status === 403) {
          throw new Error('You do not have permission to edit this pull sheet');
        }
        throw new Error('Failed to fetch pull sheet');
      }

      const pullSheetData = await pullSheetResponse.json();
      const sheet = pullSheetData.pull_sheet;
      setPullSheet(sheet);
      setName(sheet.name);
      setDescription(sheet.description || '');
      setIsPublic(sheet.is_public);
      setSelectedLocationIds(sheet.locations.map((loc: Location) => loc.id));

      // Fetch all saved locations
      const savedResponse = await fetch('/api/saved-locations');
      if (!savedResponse.ok) throw new Error('Failed to fetch saved locations');

      const savedData = await savedResponse.json();
      setSavedLocations(savedData.locations || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
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
      const response = await fetch(`/api/pull-sheets/${pullSheetId}`, {
        method: 'PATCH',
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
        throw new Error(data.error || 'Failed to update pull sheet');
      }

      // Success - redirect to pull sheets list
      router.push('/account/pull-sheets');
    } catch (err) {
      console.error('Error updating pull sheet:', err);
      alert(err instanceof Error ? err.message : 'Failed to update pull sheet');
      setSubmitting(false);
    }
  };

  const copyShareLink = () => {
    if (!pullSheet?.share_token) return;
    const shareUrl = `${window.location.origin}/pull-sheets/${pullSheet.share_token}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-semibold text-black mb-2">EDIT PULL SHEET</h1>
          <p className="text-gray-600">
            Update details and manage locations in your pull sheet
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C41E3A]"></div>
            <p className="mt-4 text-gray-600">Loading pull sheet...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 font-bold mb-4">{error}</p>
            <Link
              href="/account/pull-sheets"
              className="text-[#C41E3A] hover:underline"
            >
              Back to Pull Sheets
            </Link>
          </div>
        )}

        {/* Form */}
        {!loading && !error && pullSheet && (
          <form onSubmit={handleSubmit}>
            {/* Pull Sheet Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-black mb-4">Details</h2>

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

                {/* Share Link */}
                {isPublic && pullSheet.share_token && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-4">
                    <p className="text-sm font-bold text-gray-700 mb-2">Share Link</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/pull-sheets/${pullSheet.share_token}`}
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={copyShareLink}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Selection */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-black">
                  Locations ({selectedLocationIds.length} selected)
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

              {savedLocations.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No saved locations available</p>
                  <Link
                    href="/search"
                    className="text-[#C41E3A] hover:underline mt-2 inline-block"
                  >
                    Browse Locations
                  </Link>
                </div>
              ) : (
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
                        <h3 className="text-sm font-semibold text-black line-clamp-1">
                          {location.name}
                        </h3>
                        <p className="text-xs text-gray-500 capitalize mt-1">
                          {location.property_type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
