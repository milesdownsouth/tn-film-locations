/**
 * Homepage - Matches Design Exactly
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

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
      {/* Hero Section */}
      <section className="relative h-[500px] bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2000&auto=format&fit=crop)'
      }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
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
              className="flex-1 px-6 py-4 rounded text-lg focus:outline-none"
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
              {/* Heading 1 */}
              <div>
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">HEADING 1</h3>
                <p className="text-sm text-gray-400">This is the subtext line</p>
                <p className="text-sm text-gray-300 mt-4">
                  Lorem ipsum dolor sit amet consectetur. Elementum at nulla fermentum lorem. Interdum
                  diam quisque id convallis non in facilisis. Odio vulputate phasellus semper ac sed.
                  A in amet et id habitant urna. Gravida nisi urna consectetur vitae.
                </p>
              </div>

              {/* Heading 3 */}
              <div>
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">HEADING 3</h3>
                <p className="text-sm text-gray-400">This is the subtext line</p>
                <p className="text-sm text-gray-300 mt-4">
                  Lorem ipsum dolor sit amet consectetur. Elementum at nulla fermentum lorem. Interdum
                  diam quisque id convallis non in facilisis. Odio vulputate phasellus semper ac sed.
                  A in amet et id habitant urna. Gravida nisi urna consectetur vitae.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* Heading 2 */}
              <div>
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">HEADING 2</h3>
                <p className="text-sm text-gray-400">This is the subtext line</p>
                <p className="text-sm text-gray-300 mt-4">
                  Lorem ipsum dolor sit amet consectetur. Elementum at nulla fermentum lorem. Interdum
                  diam quisque id convallis non in facilisis. Odio vulputate phasellus semper ac sed.
                  A in amet et id habitant urna. Gravida nisi urna consectetur vitae.
                </p>
              </div>

              {/* Red CTA Box */}
              <div className="bg-[#C41E3A] p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">
                  NOT SURE HOW TO GET STARTED?
                </h3>
                <p className="text-sm mb-6">
                  Lorem ipsum dolor sit amet consectetur. Vulputate erat ut diam volutpat elementum
                  ullamcorper vel nisl tincidunt. Integer volutpat auctor habitasse et eget.
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
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
