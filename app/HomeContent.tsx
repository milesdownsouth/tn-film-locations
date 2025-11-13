/**
 * Home Content - Client Component
 * Handles search functionality and displays featured locations
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Location } from '@/types/database';

interface HomeContentProps {
  featuredLocations: Location[];
}

export default function HomeContent({ featuredLocations }: HomeContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure video plays on mount and handle fade effect on loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start playing the video
    video.play().catch((error) => {
      console.log('Video autoplay failed:', error);
    });

    // Handle fade effect near end of video
    const handleTimeUpdate = () => {
      if (!video) return;

      const timeLeft = video.duration - video.currentTime;

      // Fade out in the last 0.5 seconds
      if (timeLeft <= 0.5 && timeLeft > 0) {
        const opacity = timeLeft / 0.5;
        video.style.opacity = opacity.toString();
      }
      // Fade back in at the start
      else if (video.currentTime < 0.5) {
        const opacity = video.currentTime / 0.5;
        video.style.opacity = opacity.toString();
      }
      // Normal opacity in the middle
      else {
        video.style.opacity = '1';
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <div>
      {/* Hero Section with Video Background */}
      <section className="relative h-[500px] overflow-hidden">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-[2]"
          style={{ pointerEvents: 'none', transition: 'opacity 0.3s ease-in-out' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-[3]"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-8">
            VENUE AND FILM LOCATIONS IN TENNESSEE
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-3xl flex gap-4">
            <input
              type="text"
              placeholder="Search by location type, city, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-4 rounded text-lg bg-white text-black focus:outline-none placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="bg-[#C41E3A] text-white px-8 py-4 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
            >
              SEARCH
            </button>
          </form>
        </div>
      </section>

      {/* Who Is It For Section - Black Background */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C41E3A] mb-4 uppercase text-sm font-medium">Who Is It For</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            TAILORED LOCATIONS FOR<br />EVERY TYPE OF NEED.
          </h2>

          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-12">
              {/* Film & TV Productions */}
              <div>
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">FILM & TV PRODUCTIONS</h3>
                <p className="text-sm text-gray-400">Find your perfect scene</p>
                <p className="text-sm text-gray-300 mt-4">
                  From urban streetscapes to rolling countryside, discover locations that bring your script to life. Our curated database includes detailed amenities, permitting information, and high-resolution photos to streamline your location scouting process.
                </p>
              </div>

              {/* Event Professionals */}
              <div>
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">EVENT PROFESSIONALS</h3>
                <p className="text-sm text-gray-400">Memorable spaces for every occasion</p>
                <p className="text-sm text-gray-300 mt-4">
                  Whether you're planning a corporate event, wedding, or special production, explore Tennessee's most distinctive venues. Filter by capacity, style, and amenities to find spaces that exceed your client's expectations.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* Commercial & Photo Shoots */}
              <div>
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">COMMERCIAL & PHOTO SHOOTS</h3>
                <p className="text-sm text-gray-400">Stunning backdrops for any vision</p>
                <p className="text-sm text-gray-300 mt-4">
                  Access unique Tennessee venues perfect for commercials, product photography, and brand content. Each location includes comprehensive details about access, lighting conditions, and available facilities to ensure your shoot runs smoothly.
                </p>
              </div>

              {/* Red CTA Box */}
              <div className="bg-[#C41E3A] p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">
                  NOT SURE HOW TO GET STARTED?
                </h3>
                <p className="text-sm mb-6">
                  Our team is here to help you find the perfect location for your project. Get personalized recommendations based on your specific needs, budget, and timeline.
                </p>
                <Link href="/contact">
                  <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors font-bold uppercase">
                    CONTACT US
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Locations - White Background */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-black mb-12">
            FEATURED LOCATIONS
          </h2>

          {featuredLocations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLocations.map((location) => (
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
                      <h3 className="text-lg font-bold text-black">{location.name}</h3>
                      <p className="text-gray-500 text-sm mt-1 capitalize">
                        {location.property_type}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No featured locations yet. Check back soon!</p>
              <Link href="/search" className="text-[#C41E3A] hover:underline mt-2 inline-block">
                Browse all locations →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works - Red Background */}
      <section className="bg-[#C41E3A] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            HOW IT WORKS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">SEARCH</h3>
              <p className="text-sm">
                Browse our collection of film friendly locations across Tennessee.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">SELECT</h3>
              <p className="text-sm">
                Create a pull file of the locations that match your creative vision
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">BOOK</h3>
              <p className="text-sm">
                Contact us to reserve your location and make the needed arrangements
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/search">
              <button className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors font-bold uppercase">
                GET STARTED
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
