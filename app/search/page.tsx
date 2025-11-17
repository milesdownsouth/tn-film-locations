/**
 * Location Search Page - Matches Design Exactly
 */

'use client';

import { Suspense } from 'react';
import SearchContent from './SearchContent';
import LottieLoader from '@/components/LottieLoader';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LottieLoader message="Loading search..." size={150} />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
