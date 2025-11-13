/**
 * Footer Component - Matches Design Exactly
 */

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  isLoggedIn?: boolean;
}

export function Footer({ isLoggedIn = false }: FooterProps) {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo Centered */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {/* White version of logo for dark background */}
            <svg className="h-12" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="15" width="40" height="30" fill="#fff" stroke="#fff" strokeWidth="1"/>
              <path d="M 5 15 L 10 5 L 50 5 L 45 15 Z" fill="#fff" stroke="#fff" strokeWidth="1"/>
              <line x1="15" y1="5" x2="10" y2="15" stroke="#000" strokeWidth="2"/>
              <line x1="25" y1="5" x2="20" y2="15" stroke="#000" strokeWidth="2"/>
              <line x1="35" y1="5" x2="30" y2="15" stroke="#000" strokeWidth="2"/>
              <circle cx="12" cy="25" r="2" fill="#000"/>
              <circle cx="38" cy="25" r="2" fill="#000"/>
              <circle cx="12" cy="35" r="2" fill="#000"/>
              <circle cx="38" cy="35" r="2" fill="#000"/>
              <circle cx="25" cy="30" r="8" fill="#000"/>
              <circle cx="25" cy="30" r="5" fill="#fff"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-none">TN FILM</span>
              <span className="text-xl font-bold text-white leading-none">LOCATIONS</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-8">
          <Link href="/" className="text-white hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm">
            HOME
          </Link>
          <Link href="/about" className="text-white hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm">
            ABOUT
          </Link>
          <Link href="/services" className="text-white hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm">
            SERVICES
          </Link>
          <Link href="/search" className="text-white hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm">
            LOCATION SEARCH
          </Link>
          {isLoggedIn ? (
            <Link href="/account" className="text-white hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm">
              ACCOUNT
            </Link>
          ) : (
            <Link href="/auth/login" className="text-white hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm">
              LOGIN
            </Link>
          )}
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          © 2025 TN FILM LOCATIONS LLC. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
