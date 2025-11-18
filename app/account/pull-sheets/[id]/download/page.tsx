/**
 * Download Pull Sheet Page
 * Client component that downloads pull sheet as PDF
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Location } from '@/types/database';

interface PullSheet {
  id: string;
  name: string;
  description: string | null;
  locations: Location[];
}

export default function DownloadPullSheetPage() {
  const params = useParams();
  const pullSheetId = params.id as string;
  const [status, setStatus] = useState<'loading' | 'downloading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    downloadPullSheet();
  }, [pullSheetId]);

  const downloadPullSheet = async () => {
    try {
      setStatus('loading');

      // Fetch user info first
      const authResponse = await fetch('/api/debug/auth');
      let userEmail = 'TN Film Locations User';
      if (authResponse.ok) {
        const authData = await authResponse.json();
        if (authData.user && authData.user.email) {
          userEmail = authData.user.email;
        }
      }

      // Fetch pull sheet data
      const response = await fetch(`/api/pull-sheets/${pullSheetId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Pull sheet not found');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to download this pull sheet');
        }
        throw new Error('Failed to fetch pull sheet');
      }

      const data = await response.json();
      const pullSheet: PullSheet = data.pull_sheet;

      if (!pullSheet.locations || pullSheet.locations.length === 0) {
        throw new Error('This pull sheet has no locations');
      }

      setStatus('downloading');

      // Generate and download PDF
      const { downloadLocationsPDF } = await import('@/lib/pdf-generator');
      await downloadLocationsPDF(
        pullSheet.locations,
        userEmail,
        `${pullSheet.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
      );

      setStatus('success');
    } catch (err) {
      console.error('Error downloading pull sheet:', err);
      setError(err instanceof Error ? err.message : 'Failed to download pull sheet');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-[#C41E3A] mb-4"></div>
              <h1 className="text-3xl font-semibold text-black mb-2">Preparing Download</h1>
              <p className="text-gray-600">Loading pull sheet data...</p>
            </>
          )}

          {status === 'downloading' && (
            <>
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-[#C41E3A] mb-4"></div>
              <h1 className="text-3xl font-semibold text-black mb-2">Generating PDF</h1>
              <p className="text-gray-600">Your download should start automatically...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-semibold text-black mb-2">Download Complete</h1>
              <p className="text-gray-600 mb-8">
                Your pull sheet PDF has been downloaded successfully!
              </p>
              <div className="space-y-3">
                <button
                  onClick={downloadPullSheet}
                  className="block w-full bg-[#C41E3A] text-white px-6 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
                >
                  Download Again
                </button>
                <Link
                  href="/account/pull-sheets"
                  className="block w-full text-center text-gray-600 hover:text-gray-900 px-6 py-3"
                >
                  Back to Pull Sheets
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-3xl font-semibold text-black mb-2">Download Failed</h1>
              <p className="text-red-600 font-medium mb-8">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={downloadPullSheet}
                  className="block w-full bg-[#C41E3A] text-white px-6 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
                >
                  Try Again
                </button>
                <Link
                  href="/account/pull-sheets"
                  className="block w-full text-center text-gray-600 hover:text-gray-900 px-6 py-3"
                >
                  Back to Pull Sheets
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
