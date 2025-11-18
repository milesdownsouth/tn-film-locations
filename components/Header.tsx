/**
 * Header Component - Matches Design Exactly
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { Logo } from './Logo';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Animate mobile menu
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (isMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      // Stagger the menu items
      const menuItems = mobileMenuRef.current.querySelectorAll('.mobile-menu-item');
      gsap.from(menuItems, {
        opacity: 0,
        x: -20,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
      });
    } else {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      });
    }
  }, [isMenuOpen]);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            <Link href="/" className="text-black hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm">
              HOME
            </Link>
            <Link href="/about" className="text-black hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm">
              ABOUT
            </Link>
            <Link href="/search" className="text-black hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm">
              LOCATION SEARCH
            </Link>
          </div>

          {/* Right Side - User Icon & Contact Button */}
          <div className="hidden md:flex items-center justify-end space-x-4">
            {/* User Icon */}
            <Link href="/account" className="text-black hover:text-[#C41E3A] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Contact Us Button */}
            <Link href="/contact">
              <button className="bg-[#C41E3A] text-white px-6 py-2.5 rounded hover:bg-[#a01729] transition-colors font-bold uppercase text-sm">
                CONTACT US
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden py-4 space-y-3 border-t overflow-hidden">
            <Link
              href="/"
              className="mobile-menu-item block text-black hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              HOME
            </Link>
            <Link
              href="/about"
              className="mobile-menu-item block text-black hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              href="/search"
              className="mobile-menu-item block text-black hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              LOCATION SEARCH
            </Link>
            <Link
              href="/account"
              className="mobile-menu-item block text-black hover:text-[#C41E3A] transition-colors font-medium uppercase text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              MY ACCOUNT
            </Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="mobile-menu-item block">
              <button className="w-full bg-[#C41E3A] text-white px-6 py-2.5 rounded hover:bg-[#a01729] transition-colors font-bold uppercase text-sm">
                CONTACT US
              </button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}