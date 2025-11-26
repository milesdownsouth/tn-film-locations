/**
 * Logo Component - TN Film Locations Logo
 */

import React from 'react';
import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center w-full h-[60px]">
      <Image
        src="/tfl-logo-red4.png"
        alt="TN Film Locations"
        width={200}
        height={60}
        className="w-full h-[60px] object-contain"
        priority
      />
    </div>
  );
}