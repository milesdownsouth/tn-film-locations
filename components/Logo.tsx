/**
 * Logo Component - Film Clapperboard Icon
 */

import React from 'react';

export function Logo({ className = "h-12" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2">
      {/* Film Clapperboard Icon */}
      <svg className={className} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Clapperboard body */}
        <rect x="5" y="15" width="40" height="30" fill="#C41E3A" stroke="#000" strokeWidth="1"/>
        {/* Clapperboard top */}
        <path d="M 5 15 L 10 5 L 50 5 L 45 15 Z" fill="#C41E3A" stroke="#000" strokeWidth="1"/>
        {/* Stripes on top */}
        <line x1="15" y1="5" x2="10" y2="15" stroke="#fff" strokeWidth="2"/>
        <line x1="25" y1="5" x2="20" y2="15" stroke="#fff" strokeWidth="2"/>
        <line x1="35" y1="5" x2="30" y2="15" stroke="#fff" strokeWidth="2"/>
        {/* Film holes */}
        <circle cx="12" cy="25" r="2" fill="#fff"/>
        <circle cx="38" cy="25" r="2" fill="#fff"/>
        <circle cx="12" cy="35" r="2" fill="#fff"/>
        <circle cx="38" cy="35" r="2" fill="#fff"/>
        {/* Center film symbol */}
        <circle cx="25" cy="30" r="8" fill="#fff"/>
        <circle cx="25" cy="30" r="5" fill="#C41E3A"/>
      </svg>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-[#C41E3A] leading-none">TN FILM</span>
        <span className="text-xl font-bold text-[#C41E3A] leading-none">LOCATIONS</span>
      </div>
    </div>
  );
}