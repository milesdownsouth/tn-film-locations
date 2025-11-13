/**
 * Location Detail Page - Matches Design Exactly
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LocationDetailPage({ params }: { params: { id: string } }) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save to user's saved locations
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    console.log('Downloading PDF for location:', params.id);
  };

  const handleDownloadZIP = () => {
    // TODO: Implement ZIP download
    console.log('Downloading ZIP for location:', params.id);
  };

  // Placeholder data - will be fetched from Supabase
  const location = {
    id: params.id,
    name: 'THE BIG RED BARN',
    city: 'Franklin',
    state: 'TN',
    type: 'Barn',
    style: 'Rustic',
    attributes: ['Antique', 'Barn', 'Hay'],
    heroImage: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2000&auto=format&fit=crop',
  };

  // Placeholder gallery images
  const galleryImages = Array(12).fill(null);

  // Placeholder featured locations
  const featuredLocations = Array(4).fill(null).map((_, i) => ({
    id: i + 1,
    name: 'Barn House',
    city: 'Franklin',
    image: null
  }));

  return (
    <div className="bg-white">
      {/* Hero Section with Location Name */}
      <section
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${location.heroImage})`
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-12">
          <p className="text-white text-lg mb-2">{location.city}, {location.state}</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white">{location.name}</h1>
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
              <p className="text-sm font-bold text-black uppercase mb-2">TYPE</p>
              <p className="text-gray-700">{location.type}</p>
            </div>
            <div className="text-center md:border-r border-gray-300">
              <p className="text-sm font-bold text-black uppercase mb-2">STYLE</p>
              <p className="text-gray-700">{location.style}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-black uppercase mb-2">ATTRIBUTES</p>
              <p className="text-gray-700">{location.attributes.join(', ')}</p>
            </div>
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
              className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
            >
              DOWNLOAD ZIP
            </button>
          </div>
        </div>
      </section>

      {/* Photo Gallery - 12 Images in 3x4 Grid */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 h-64 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-black mb-12">
            FEATURED LOCATIONS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLocations.map((loc) => (
              <Link key={loc.id} href={`/locations/${loc.id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="bg-gray-200 h-64 rounded-t-lg"></div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm">{loc.city}</p>
                    <h3 className="text-lg font-bold text-black">{loc.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
