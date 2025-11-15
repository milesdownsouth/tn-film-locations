/**
 * Location Search Page - Matches Design Exactly
 */

'use client';

import { Suspense } from 'react';
import SearchContent from './SearchContent';
import CameraApertureLoader from '@/components/CameraApertureLoader';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <CameraApertureLoader message="Loading search..." />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
