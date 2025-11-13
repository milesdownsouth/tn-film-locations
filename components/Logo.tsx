/**
 * Logo Component - TN Film Locations Logo
 */

import React from 'react';
import Image from 'next/image';

export function Logo({ className = "h-12" }: { className?: string }) {
  return (
    <div className="flex items-center">
      <Image
        src="/TN-Film-Locations_red.png"
        alt="TN Film Locations"
        width={200}
        height={48}
        className={className}
        priority
      />
    </div>
  );
}