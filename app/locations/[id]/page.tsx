/**
 * Location Detail Page - Matches Design Exactly
 */

'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { Location } from '@/types/database';
import { generateLocationsPDF } from '@/lib/pdf-generator';
import { downloadLocationImagesAsZip } from '@/lib/zip-generator';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CameraApertureLoader from '@/components/CameraApertureLoader';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LocationDetailResponse {
  location: Location;
  relatedLocations: Partial<Location>[];
}

interface PullSheet {
  id: string;
  name: string;
  location_count: number;
}

export default function LocationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isSaved, setIsSaved] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [relatedLocations, setRelatedLocations] = useState<Partial<Location>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showPullSheetModal, setShowPullSheetModal] = useState(false);
  const [pullSheets, setPullSheets] = useState<PullSheet[]>([]);
  const [loadingPullSheets, setLoadingPullSheets] = useState(false);

  // Animation refs
  const heroRef = useRef<HTMLDivElement>(null);
  const infoBarRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLElement>(null);
  const amenitiesRef = useRef<HTMLElement>(null);
  const additionalInfoRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const relatedRef = useRef<HTMLElement>(null);

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

  // Check if location is saved on load
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const response = await fetch('/api/saved-locations');
        if (response.ok) {
          const data = await response.json();
          const savedIds = data.savedLocationIds || [];
          setIsSaved(savedIds.includes(id));
        }
      } catch (err) {
        console.error('Error checking saved status:', err);
      }
    };

    checkIfSaved();
  }, [id]);

  const handleSave = async () => {
    try {
      if (isSaved) {
        // Unsave the location
        const response = await fetch(`/api/saved-locations?location_id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setIsSaved(false);
        } else {
          const data = await response.json();
          if (response.status === 401) {
            alert('Please log in to save locations');
            window.location.href = '/auth/login';
          } else {
            alert(data.error || 'Failed to unsave location');
          }
        }
      } else {
        // Save the location
        const response = await fetch('/api/saved-locations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ location_id: id }),
        });

        if (response.ok) {
          setIsSaved(true);
        } else {
          const data = await response.json();
          if (response.status === 401) {
            alert('Please log in to save locations');
            window.location.href = '/auth/login';
          } else {
            alert(data.error || 'Failed to save location');
          }
        }
      }
    } catch (err) {
      console.error('Error toggling save:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    if (!location) return;

    try {
      // Check authentication before allowing download
      const authCheck = await fetch('/api/saved-locations');
      if (authCheck.status === 401) {
        alert('Please log in to download PDFs');
        window.location.href = '/auth/login';
        return;
      }

      const { downloadLocationsPDF } = await import('@/lib/pdf-generator');
      downloadLocationsPDF([location], 'guest@tnfilmlocations.com');
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleDownloadZIP = async () => {
    if (!location) return;

    try {
      // Check authentication before allowing download
      const authCheck = await fetch('/api/saved-locations');
      if (authCheck.status === 401) {
        alert('Please log in to download images');
        window.location.href = '/auth/login';
        return;
      }

      await downloadLocationImagesAsZip(location.name, location.images || []);
    } catch (err) {
      console.error('Error downloading ZIP:', err);
      alert('Failed to download images. Please try again.');
    }
  };

  const handleAddToPullSheet = async () => {
    setLoadingPullSheets(true);
    setShowPullSheetModal(true);

    try {
      const response = await fetch('/api/pull-sheets');
      if (response.status === 401) {
        alert('Please log in to add locations to pull sheets');
        window.location.href = '/auth/login';
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch pull sheets');
      }

      const data = await response.json();
      setPullSheets(data.pull_sheets || []);
    } catch (err) {
      console.error('Error fetching pull sheets:', err);
      alert('Failed to load pull sheets. Please try again.');
      setShowPullSheetModal(false);
    } finally {
      setLoadingPullSheets(false);
    }
  };

  const handleSelectPullSheet = async (pullSheetId: string) => {
    try {
      // Get the pull sheet data
      const response = await fetch(`/api/pull-sheets/${pullSheetId}`);
      if (!response.ok) throw new Error('Failed to fetch pull sheet');

      const data = await response.json();
      const pullSheet = data.pull_sheet;

      // Check if location is already in the pull sheet
      const locationIds = pullSheet.locations.map((loc: Location) => loc.id);
      if (locationIds.includes(id)) {
        alert('This location is already in that pull sheet');
        return;
      }

      // Add the location to the pull sheet
      const updateResponse = await fetch(`/api/pull-sheets/${pullSheetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location_ids: [...locationIds, id],
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to add location to pull sheet');
      }

      alert('Location added to pull sheet!');
      setShowPullSheetModal(false);
    } catch (err) {
      console.error('Error adding to pull sheet:', err);
      alert('Failed to add location to pull sheet. Please try again.');
    }
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    if (!location?.images) return;
    setSelectedImageIndex((prev) => (prev + 1) % location.images.length);
  };

  const prevImage = () => {
    if (!location?.images) return;
    setSelectedImageIndex((prev) => (prev - 1 + location.images.length) % location.images.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, location]);

  // Animations
  useEffect(() => {
    if (loading || !location) return;

    const ctx = gsap.context(() => {
      // Animate hero section
      if (heroRef.current) {
        gsap.from(heroRef.current.children, {
          opacity: 0,
          y: 40,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.2,
        });
      }

      // Animate info bar
      if (infoBarRef.current) {
        const items = infoBarRef.current.children;
        gsap.from(items, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: infoBarRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Animate description section
      if (descriptionRef.current) {
        gsap.from(descriptionRef.current.children, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Animate amenities section
      if (amenitiesRef.current) {
        const tags = amenitiesRef.current.querySelectorAll('.amenity-tag');
        gsap.from(amenitiesRef.current.querySelector('h2'), {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: amenitiesRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
        gsap.from(tags, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: amenitiesRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Animate additional info section
      if (additionalInfoRef.current) {
        const items = additionalInfoRef.current.children;
        gsap.from(items, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: additionalInfoRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Animate download buttons
      if (buttonsRef.current) {
        const buttons = buttonsRef.current.children;
        gsap.from(buttons, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: buttonsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Animate related locations
      if (relatedRef.current && relatedLocations.length > 0) {
        const cards = relatedRef.current.querySelectorAll('.related-card');
        const title = relatedRef.current.querySelector('h2');

        if (title) {
          gsap.from(title, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: relatedRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        }

        if (cards.length > 0) {
          gsap.from(cards, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: relatedRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        }
      }
    });

    return () => ctx.revert();
  }, [loading, location, relatedLocations]);

  // Simple gallery animation on mount
  useEffect(() => {
    if (loading || !location || !location.images || location.images.length === 0) return;
    if (!galleryRef.current) return;

    const ctx = gsap.context(() => {
      const title = galleryRef.current?.querySelector('h2');
      const photos = galleryRef.current?.querySelectorAll('.gallery-photo');

      // Simple fade in for title
      if (title) {
        gsap.to(title, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        });
      }

      // Simple fade in for photos
      if (photos && photos.length > 0) {
        gsap.to(photos, {
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
        });
      }
    }, galleryRef);

    return () => ctx.revert();
  }, [loading, location]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <CameraApertureLoader message="Loading location..." />
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
        <div ref={heroRef} className="absolute inset-0 flex flex-col justify-end px-8 pb-12">
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
          <div ref={infoBarRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
        <section ref={descriptionRef} className="bg-white py-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-black mb-4">DESCRIPTION</h2>
            <p className="text-gray-700 leading-relaxed">{location.description}</p>
          </div>
        </section>
      )}

      {/* Amenities */}
      {location.amenities && location.amenities.length > 0 && (
        <section ref={amenitiesRef} className="bg-white py-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-black mb-4">AMENITIES</h2>
            <div className="flex flex-wrap gap-2">
              {location.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="amenity-tag bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm"
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
          <div ref={additionalInfoRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <div ref={buttonsRef} className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <button
              onClick={handleDownloadPDF}
              className="bg-[#C41E3A] text-white px-4 py-2 md:px-8 md:py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase text-sm md:text-base"
            >
              DOWNLOAD PDF
            </button>
            <button
              onClick={handleDownloadZIP}
              disabled={!location.images || location.images.length === 0}
              className="bg-[#C41E3A] text-white px-4 py-2 md:px-8 md:py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              DOWNLOAD ZIP
            </button>
            <button
              onClick={handleAddToPullSheet}
              className="bg-gray-800 text-white px-4 py-2 md:px-8 md:py-3 rounded hover:bg-gray-900 transition-colors font-bold uppercase text-sm md:text-base col-span-2 md:col-span-1"
            >
              ADD TO PULL SHEET
            </button>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      {location.images && location.images.length > 0 && (
        <section ref={galleryRef} className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-black mb-6" style={{ opacity: 0 }}>PHOTO GALLERY</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {location.images.map((image, index) => (
                <div
                  key={index}
                  className="gallery-photo bg-gray-200 h-64 rounded-lg hover:opacity-90 transition-opacity cursor-pointer overflow-hidden"
                  style={{ opacity: 0 }}
                  onClick={() => openLightbox(index)}
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
        <section ref={relatedRef} className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-black mb-12">
              RELATED LOCATIONS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedLocations.map((loc) => (
                <Link key={loc.id} href={`/locations/${loc.id}`}>
                  <div className="related-card bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
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

      {/* Lightbox Modal */}
      {isLightboxOpen && location?.images && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
            aria-label="Close lightbox"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          {location.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-50"
              aria-label="Previous image"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-7xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={location.images[selectedImageIndex]}
              alt={`${location.name} - Image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <div className="text-white text-center mt-4">
              {selectedImageIndex + 1} / {location.images.length}
            </div>
          </div>

          {/* Next Button */}
          {location.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-50"
              aria-label="Next image"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Pull Sheet Modal */}
      {showPullSheetModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={() => setShowPullSheetModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Add to Pull Sheet</h2>
                <button
                  onClick={() => setShowPullSheetModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {loadingPullSheets ? (
                <div className="text-center py-12">
                  <CameraApertureLoader message="Loading pull sheets..." />
                </div>
              ) : pullSheets.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">You don't have any pull sheets yet</p>
                  <Link
                    href="/account/pull-sheets/new"
                    className="inline-block bg-[#C41E3A] text-white px-6 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
                  >
                    Create Pull Sheet
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {pullSheets.map((sheet) => (
                    <button
                      key={sheet.id}
                      onClick={() => handleSelectPullSheet(sheet.id)}
                      className="w-full text-left p-4 border border-gray-200 rounded hover:border-[#C41E3A] hover:bg-red-50 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-black">{sheet.name}</h3>
                          <p className="text-sm text-gray-600">
                            {sheet.location_count} location{sheet.location_count !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </button>
                  ))}

                  <div className="pt-4 border-t border-gray-200 mt-6">
                    <Link
                      href="/account/pull-sheets/new"
                      className="block w-full text-center bg-gray-100 text-black px-6 py-3 rounded hover:bg-gray-200 transition-colors font-bold uppercase"
                    >
                      Create New Pull Sheet
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
