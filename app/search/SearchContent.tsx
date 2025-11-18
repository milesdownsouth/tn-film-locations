'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Location } from '@/types/database';
import { PROPERTY_TYPES, TN_COUNTIES } from '@/types/database';
import LottieLoader from '@/components/LottieLoader';

interface LocationsResponse {
  locations: Location[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    searchQuery: string;
    city: string;
    county: string;
    propertyType: string;
    amenities: string[];
  };
}

export default function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [county, setCounty] = useState(searchParams.get('county') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('property_type') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch locations from API
  const fetchLocations = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (city) params.set('city', city);
      if (county) params.set('county', county);
      if (propertyType) params.set('property_type', propertyType);
      params.set('page', currentPage.toString());
      params.set('limit', '12');

      const response = await fetch(`/api/locations?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data: LocationsResponse = await response.json();
      setLocations(data.locations);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch locations when filters or page changes
  useEffect(() => {
    fetchLocations();
  }, [searchQuery, city, county, propertyType, currentPage]);

  // Update URL with current filters
  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (city) params.set('city', city);
    if (county) params.set('county', county);
    if (propertyType) params.set('property_type', propertyType);
    if (currentPage > 1) params.set('page', currentPage.toString());

    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateURL();
  };

  const handleFilterChange = (
    filterType: 'city' | 'county' | 'propertyType',
    value: string
  ) => {
    setCurrentPage(1);
    if (filterType === 'city') setCity(value);
    if (filterType === 'county') setCounty(value);
    if (filterType === 'propertyType') setPropertyType(value);
    updateURL();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get unique cities from locations (in real app, this could come from API)
  const cities = Array.from(new Set(locations.map(loc => loc.city))).sort();

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-5xl font-bold text-black text-center mb-12">
          LOCATION SEARCH
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by location type, city, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
            />
            <button
              type="submit"
              className="bg-[#C41E3A] text-white px-8 py-4 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
            >
              SEARCH
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12">
          <select
            value={propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={county}
            onChange={(e) => handleFilterChange('county', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
          >
            <option value="">All Counties</option>
            {TN_COUNTIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {(searchQuery || city || county || propertyType) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCity('');
                setCounty('');
                setPropertyType('');
                setCurrentPage(1);
                router.push('/search');
              }}
              className="px-4 py-2 text-[#C41E3A] hover:text-[#a01729] font-bold"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="text-center mb-6 text-gray-600">
            {pagination.total} location{pagination.total !== 1 ? 's' : ''} found
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <LottieLoader message="Loading locations..." size={150} />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 font-bold mb-2">Error: {error}</p>
            <button
              onClick={fetchLocations}
              className="bg-[#C41E3A] text-white px-6 py-2 rounded hover:bg-[#a01729] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Location Grid */}
        {!loading && !error && (
          <>
            {locations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No locations found</p>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {locations.map((location) => (
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
                        <p className="text-gray-600 text-sm">{location.city}</p>
                        <h3 className="text-lg font-bold text-black">{location.name}</h3>
                        <p className="text-gray-500 text-sm mt-1 capitalize">
                          {location.property_type}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col items-center gap-6">
                {pagination.hasNext && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
                  >
                    NEXT PAGE
                  </button>
                )}
                <div className="flex gap-4">
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    // Show first 5 pages or pages around current page
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded ${
                          currentPage === pageNum
                            ? 'bg-[#C41E3A] text-white'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                        } font-bold transition-colors`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
