/**
 * Homepage with Hero Section
 * Features Peerspace-style animations: background fade-in, text roll-up, search box slide-in
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';

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
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background Image with Fade-in Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2000)',
          }}
        />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center">
        {/* Main Heading with Roll-up Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="mb-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Discover Tennessee's
            <br />
            Perfect Film Locations
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            From historic mansions to modern cityscapes, find the ideal setting
            for your next production
          </p>
        </motion.div>

        {/* Search Box with Slide-in Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
          className="w-full max-w-2xl"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by city, property type, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              size="lg"
              className="sm:w-auto whitespace-nowrap px-8"
            >
              Search Locations
            </Button>
          </form>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5, ease: 'easeOut' }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white"
        >
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">100+</div>
            <div className="text-gray-200">Premium Locations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">95</div>
            <div className="text-gray-200">Tennessee Counties</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">50</div>
            <div className="text-gray-200">Photos Per Location</div>
          </div>
        </motion.div>
      </div>

      {/* Featured Locations Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="relative z-10 bg-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">
            Explore By Property Type
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Browse our diverse collection of film-ready locations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: 'Mansions', image: 'photo-1613490493576-7fde63acd811' },
              { type: 'Warehouses', image: 'photo-1586023492125-27b2c045efd7' },
              { type: 'Urban', image: 'photo-1449824913935-59a10b8d2000' },
              { type: 'Nature', image: 'photo-1511497584788-876760111969' },
            ].map((category, index) => (
              <motion.div
                key={category.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.2 + index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => router.push(`/search?type=${category.type.toLowerCase()}`)}
              >
                <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(https://images.unsplash.com/${category.image}?w=400&h=400&fit=crop)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">
                      {category.type}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
