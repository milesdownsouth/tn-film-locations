/**
 * Location Search Page - Matches Design Exactly
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  // Placeholder location data
  const locations = Array(12).fill(null).map((_, i) => ({
    id: i + 1,
    name: 'Barn House',
    city: 'Franklin',
    image: null
  }));

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
          <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]">
            <option>Type</option>
            <option>Barn</option>
            <option>Mansion</option>
            <option>Warehouse</option>
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]">
            <option>Architecture</option>
            <option>Modern</option>
            <option>Historic</option>
            <option>Industrial</option>
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]">
            <option>City</option>
            <option>Nashville</option>
            <option>Franklin</option>
            <option>Memphis</option>
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]">
            <option>Attributes</option>
            <option>Parking</option>
            <option>Natural Light</option>
            <option>Historic</option>
          </select>
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {locations.map((location) => (
            <Link key={location.id} href={`/locations/${location.id}`}>
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                <div className="bg-gray-200 h-64 rounded-t-lg"></div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm">{location.city}</p>
                  <h3 className="text-lg font-bold text-black">{location.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center gap-6">
          <button className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase">
            NEXT PAGE
          </button>
          <div className="flex gap-4">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded ${
                  currentPage === page
                    ? 'bg-[#C41E3A] text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                } font-bold transition-colors`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
