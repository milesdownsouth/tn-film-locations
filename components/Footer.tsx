/**
 * Footer Component - Matches Design Exactly
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  isLoggedIn?: boolean;
}

export function Footer({ isLoggedIn = false }: FooterProps) {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo Centered */}
        <div className="flex justify-center mb-8">
          <Image
            src="/tfl-logo-white2.png"
            alt="TN Film Locations"
            width={200}
            height={48}
            className="h-12 w-auto"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-8">
          <Link href="/" className="text-white hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm">
            HOME
          </Link>
          <Link href="/about" className="text-white hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm">
            ABOUT
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
