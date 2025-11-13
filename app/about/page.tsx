/**
 * About Page - Matches Design Exactly
 */

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section - Black Background */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-8">
                WE HELP YOU FIND THE<br />RIGHT FILM LOCATION
              </h1>
              <p className="text-gray-300 mb-8">
                Lorem ipsum dolor sit amet consectetur. Elementum at nulla fermentum lorem. Interdum
                diam quisque id convallis non in facilisis. Odio vulputate phasellus semper ac sed.
                A in amet et id habitant urna. Gravida nisi urna consectetur vitae.
              </p>
              <Link href="/search">
                <button className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase">
                  GET STARTED
                </button>
              </Link>
            </div>

            {/* Right Side - Overlapping Photos */}
            <div className="relative h-[400px] hidden lg:block">
              {/* Photo 1 - Back */}
              <div className="absolute top-0 right-20 w-64 h-72 bg-gray-700 rounded-lg shadow-2xl transform rotate-6">
                <div className="w-full h-full bg-cover bg-center rounded-lg" style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=500&fit=crop)'
                }}></div>
              </div>

              {/* Photo 2 - Middle */}
              <div className="absolute top-20 right-40 w-64 h-72 bg-gray-600 rounded-lg shadow-2xl transform -rotate-3">
                <div className="w-full h-full bg-cover bg-center rounded-lg" style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=400&h=500&fit=crop)'
                }}></div>
              </div>

              {/* Photo 3 - Front */}
              <div className="absolute bottom-0 right-0 w-64 h-72 bg-gray-500 rounded-lg shadow-2xl">
                <div className="w-full h-full bg-cover bg-center rounded-lg" style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=500&fit=crop)'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Numbers Section - White Background */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-black mb-16">THE NUMBERS</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="text-center border-r border-gray-300 last:border-r-0">
              <div className="text-5xl md:text-6xl font-bold text-black mb-2">150+</div>
              <div className="text-gray-600">Locations</div>
            </div>

            {/* Stat 2 */}
            <div className="text-center border-r border-gray-300 last:border-r-0">
              <div className="text-5xl md:text-6xl font-bold text-black mb-2">40</div>
              <div className="text-gray-600">City's</div>
            </div>

            {/* Stat 3 */}
            <div className="text-center border-r border-gray-300 last:border-r-0">
              <div className="text-5xl md:text-6xl font-bold text-black mb-2">30+</div>
              <div className="text-gray-600">Yrs of Scouting<br />Experience</div>
            </div>

            {/* Stat 4 */}
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-black mb-2">100</div>
              <div className="text-gray-600">Yearly Bookings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Fred Jove Section - Red Background */}
      <section className="bg-[#C41E3A] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <div className="bg-gray-300 h-96 rounded-lg"></div>

            {/* Right Side - Bio */}
            <div>
              <h2 className="text-4xl font-bold mb-6">FRED JOVE</h2>
              <p className="text-white">
                Lorem ipsum dolor sit amet consectetur. Elementum at nulla fermentum lorem. Interdum
                diam quisque id convallis non in facilisis. Odio vulputate phasellus semper ac sed.
                A in amet et id habitant urna. Gravida nisi urna consectetur vitae.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
