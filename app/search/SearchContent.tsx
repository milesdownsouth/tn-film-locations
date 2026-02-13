'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Location } from '@/types/database';
import gsap from 'gsap';
import CameraApertureLoader from '@/components/CameraApertureLoader';

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

const ITEMS_PER_PAGE = 24; // Load 24 items at a time for better UX

export default function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const headerRef = useRef<HTMLHeadingElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [county, setCounty] = useState(searchParams.get('county') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('property_type') || '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get('amenities')?.split(',').filter(Boolean) || []
  );
  const [currentPage, setCurrentPage] = useState(1);

  const [locations, setLocations] = useState<Location[]>([]);
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);
  const [availablePropertyTypes, setAvailablePropertyTypes] = useState<string[]>([]);
  const [availableCounties, setAvailableCounties] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [showAmenitiesFilter, setShowAmenitiesFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch available filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      // Fetch amenities
      const amenitiesResponse = await fetch('/api/amenities');
      if (amenitiesResponse.ok) {
        const amenitiesData = await amenitiesResponse.json();
        setAvailableAmenities(amenitiesData.amenities);
      }

      // Fetch other filter options
      const filtersResponse = await fetch('/api/filters');
      if (filtersResponse.ok) {
        const filtersData = await filtersResponse.json();
        setAvailablePropertyTypes(filtersData.propertyTypes);
        setAvailableCounties(filtersData.counties);
        setAvailableCities(filtersData.cities);
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  // Fetch locations from API
  const fetchLocations = useCallback(async (page: number, append: boolean = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (city) params.set('city', city);
      if (county) params.set('county', county);
      if (propertyType) params.set('property_type', propertyType);
      if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));
      params.set('page', page.toString());
      params.set('limit', ITEMS_PER_PAGE.toString());

      const response = await fetch(`/api/locations?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data: LocationsResponse = await response.json();

      if (append) {
        setLocations(prev => [...prev, ...data.locations]);
      } else {
        setLocations(data.locations);
      }

      setTotalCount(data.pagination.total);
      setHasMore(data.pagination.hasNext);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, city, county, propertyType, selectedAmenities]);

  // Initial fetch and refetch when filters change
  useEffect(() => {
    setLocations([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchLocations(1, false);
  }, [searchQuery, city, county, propertyType, selectedAmenities]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current || loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchLocations(currentPage + 1, true);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [currentPage, hasMore, loading, loadingMore, fetchLocations]);

  // Animations
  useEffect(() => {
    // Animate header on mount
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      });
    }

    // Animate filters on mount
    if (filtersRef.current) {
      const filters = filtersRef.current.children;
      gsap.from(filters, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3,
      });
    }
  }, []);

  // Animate new location cards when they load
  useEffect(() => {
    if (!loading && gridRef.current && locations.length > 0) {
      // Only animate newly added cards
      const cards = gridRef.current.querySelectorAll('.location-card:not(.animated)');
      if (cards.length > 0) {
        gsap.from(cards, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
          onComplete: () => {
            cards.forEach(card => card.classList.add('animated'));
          }
        });
      }
    }
  }, [locations, loading]);

  // Update URL with current filters
  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (city) params.set('city', city);
    if (county) params.set('county', county);
    if (propertyType) params.set('property_type', propertyType);
    if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));

    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL();
  };

  const handleFilterChange = (
    filterType: 'city' | 'county' | 'propertyType',
    value: string
  ) => {
    if (filterType === 'city') setCity(value);
    if (filterType === 'county') setCounty(value);
    if (filterType === 'propertyType') setPropertyType(value);
    updateURL();
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Manual load more button (backup for intersection observer)
  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchLocations(currentPage + 1, true);
    }
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 ref={headerRef} className="text-5xl font-semibold text-black text-center mb-12">
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
        <div ref={filtersRef} className="flex flex-wrap gap-4 mb-12">
          <select
            value={propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
          >
            <option value="">All Types</option>
            {availablePropertyTypes.map((type) => (
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
            {availableCounties.map((c) => (
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
            {availableCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Features Filter Button */}
          <button
            type="button"
            onClick={() => setShowAmenitiesFilter(!showAmenitiesFilter)}
            className={`px-4 py-2 border rounded font-medium transition-colors ${
              selectedAmenities.length > 0
                ? 'bg-[#C41E3A] text-white border-[#C41E3A]'
                : 'border-gray-300 text-gray-700 hover:border-[#C41E3A] hover:text-[#C41E3A]'
            }`}
          >
            Features {selectedAmenities.length > 0 && `(${selectedAmenities.length})`}
          </button>

          {(searchQuery || city || county || propertyType || selectedAmenities.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCity('');
                setCounty('');
                setPropertyType('');
                setSelectedAmenities([]);
                setCurrentPage(1);
                router.push('/search');
              }}
              className="px-4 py-2 text-[#C41E3A] hover:text-[#a01729] font-bold"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Features Dropdown */}
        {showAmenitiesFilter && availableAmenities.length > 0 && (
          <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-4">Filter by Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableAmenities.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 text-[#C41E3A] border-gray-300 rounded focus:ring-[#C41E3A] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Selected Amenities Tags */}
        {selectedAmenities.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {selectedAmenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 bg-[#C41E3A] text-white px-3 py-1 rounded-full text-sm"
              >
                {amenity}
                <button
                  onClick={() => handleAmenityToggle(amenity)}
                  className="hover:bg-[#a01729] rounded-full p-0.5 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="text-center mb-6 text-gray-600">
            {totalCount > 0 ? (
              <>
                Showing {locations.length} of {totalCount} location{totalCount !== 1 ? 's' : ''}
              </>
            ) : (
              '0 locations found'
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <CameraApertureLoader message="Loading locations..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 font-bold mb-2">Error: {error}</p>
            <button
              onClick={() => fetchLocations(1, false)}
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
              <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {locations.map((location) => (
                  <Link key={location.id} href={`/locations/${location.id}`}>
                    <div className="location-card bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative h-64 rounded-t-lg overflow-hidden bg-gray-200">
                        {location.images && location.images.length > 0 ? (
                          <img
                            src={location.images[0]}
                            alt={location.name}
                            loading="lazy"
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
                        <h3 className="text-lg font-semibold text-black">{location.name}</h3>
                        <p className="text-gray-500 text-sm mt-1 capitalize">
                          {location.property_type}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Infinite Scroll Trigger / Load More */}
            {hasMore && (
              <div ref={loadMoreRef} className="flex flex-col items-center gap-4 py-8">
                {loadingMore ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C41E3A]"></div>
                    <span className="text-gray-600">Loading more locations...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleLoadMore}
                    className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
                  >
                    LOAD MORE
                  </button>
                )}
              </div>
            )}

            {/* End of Results */}
            {!hasMore && locations.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                Showing all {totalCount} locations
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
