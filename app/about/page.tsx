/**
 * About Page - Matches Design Exactly
 */

'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const fredSectionRef = useRef<HTMLDivElement>(null);

  // Hero animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate hero text
      if (heroTextRef.current) {
        gsap.from(heroTextRef.current.children, {
          opacity: 0,
          y: 40,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          delay: 0.2,
        });
      }

      // Animate overlapping photos
      if (photosRef.current) {
        const photos = photosRef.current.querySelectorAll('.photo-card');
        gsap.from(photos, {
          opacity: 0,
          y: 60,
          rotation: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.5,
        });
      }

      // Animate Fred Jove section
      if (fredSectionRef.current) {
        gsap.from(fredSectionRef.current.children, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: fredSectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div>
      {/* Hero Section - Black Background */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div ref={heroTextRef}>
              <h1 className="text-4xl md:text-5xl font-semibold mb-8">
                WE HELP YOU FIND THE<br />RIGHT FILM LOCATION
              </h1>
              <p className="text-gray-300 mb-8">
                Tennessee's film industry is booming, and finding the perfect location should not slow you down. Tennessee Film Locations (TFL) is a full-service location company based in the greater Nashville area. We are your one stop shop for all your location needs. We offer location scouting, management, and a comprehensive film library with venue spaces and film locations for your next event, photo shoot or film project. With decades of experience and deep roots across the state, we connect production teams with distinctive venues that bring stories to life. From historic landmarks to modern spaces, we know Tennessee's hidden gems—and we are here to make your location scouting effortless.
              </p>
              <Link href="/search">
                <button className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase">
                  GET STARTED
                </button>
              </Link>
            </div>

            {/* Right Side - Overlapping Photos */}
            <div ref={photosRef} className="relative h-[400px] hidden lg:block">
              {/* Photo 1 - Back */}
              <div className="photo-card absolute top-0 right-20 w-64 h-72 bg-gray-700 rounded-lg shadow-2xl transform rotate-6">
                <div className="w-full h-full bg-cover bg-center rounded-lg" style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=500&fit=crop)'
                }}></div>
              </div>

              {/* Photo 2 - Middle */}
              <div className="photo-card absolute top-20 right-40 w-64 h-72 bg-gray-600 rounded-lg shadow-2xl transform -rotate-3">
                <div className="w-full h-full bg-cover bg-center rounded-lg" style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=400&h=500&fit=crop)'
                }}></div>
              </div>

              {/* Photo 3 - Front */}
              <div className="photo-card absolute bottom-0 right-0 w-64 h-72 bg-gray-500 rounded-lg shadow-2xl">
                <div className="w-full h-full bg-cover bg-center rounded-lg" style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=500&fit=crop)'
                }}></div>
              </div>
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
            <div ref={fredSectionRef}>
              <h2 className="text-4xl font-semibold mb-2">FRED JOVE</h2>
              <p className="text-sm mb-6 opacity-90">Founder, Location Manager & Scout</p>
              <p className="text-white mb-4">
                With over 25 years in the film industry, Fred founded Tennessee Film Locations (TFL) to solve a problem he saw repeatedly; production teams spending valuable time and resources searching for the right location.
              </p>
              <p className="text-white mb-4">
                What started as a personal network of trusted locations has grown into a reliable film location database. Today, we work with productions of all sizes from independent filmmakers to major studios helping them discover spaces that exceed expectations and stay within budget.
              </p>
              <p className="text-white">
                Our mission is simple: make location scouting in Tennessee seamless, efficient, and inspiring.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
