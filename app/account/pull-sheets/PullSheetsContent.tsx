/**
 * Pull Sheets Content
 * Client component for managing pull sheets
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PullSheet {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  share_token: string | null;
  location_count: number;
  created_at: string;
  updated_at: string;
}

export default function PullSheetsContent() {
  const router = useRouter();
  const [pullSheets, setPullSheets] = useState<PullSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPullSheets();
  }, []);

  const fetchPullSheets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pull-sheets');

      if (!response.ok) {
        throw new Error('Failed to fetch pull sheets');
      }

      const data = await response.json();
      setPullSheets(data.pull_sheets);
    } catch (err) {
      console.error('Error fetching pull sheets:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/pull-sheets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete pull sheet');
      }

      // Remove from state
      setPullSheets(prev => prev.filter(sheet => sheet.id !== id));
    } catch (err) {
      console.error('Error deleting pull sheet:', err);
      alert('Failed to delete pull sheet. Please try again.');
    }
  };

  const copyShareLink = (shareToken: string) => {
    const shareUrl = `${window.location.origin}/pull-sheets/${shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-black">MY PULL SHEETS</h1>
            <p className="text-gray-600 mt-2">
              {pullSheets.length} pull sheet{pullSheets.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/account/pull-sheets/new"
            className="bg-[#C41E3A] text-white px-6 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
          >
            + New Pull Sheet
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C41E3A]"></div>
            <p className="mt-4 text-gray-600">Loading pull sheets...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 font-bold mb-2">Error: {error}</p>
            <button
              onClick={fetchPullSheets}
              className="bg-[#C41E3A] text-white px-6 py-2 rounded hover:bg-[#a01729] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Pull Sheets List */}
        {!loading && !error && (
          <>
            {pullSheets.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg mb-4">You haven't created any pull sheets yet</p>
                <p className="text-gray-500 mb-6">
                  Pull sheets let you organize locations and share them with others
                </p>
                <Link
                  href="/account/pull-sheets/new"
                  className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase inline-block"
                >
                  Create Your First Pull Sheet
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pullSheets.map((sheet) => (
                  <div key={sheet.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-black">{sheet.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sheet.is_public
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {sheet.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>

                    {sheet.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {sheet.description}
                      </p>
                    )}

                    <div className="text-sm text-gray-500 mb-4">
                      {sheet.location_count} location{sheet.location_count !== 1 ? 's' : ''}
                    </div>

                    <div className="space-y-2">
                      <Link
                        href={`/account/pull-sheets/${sheet.id}/edit`}
                        className="block w-full text-center bg-gray-100 text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors font-medium"
                      >
                        Edit
                      </Link>

                      {sheet.is_public && sheet.share_token && (
                        <button
                          onClick={() => copyShareLink(sheet.share_token!)}
                          className="w-full text-center bg-blue-100 text-blue-800 px-4 py-2 rounded hover:bg-blue-200 transition-colors font-medium"
                        >
                          Copy Share Link
                        </button>
                      )}

                      <Link
                        href={`/account/pull-sheets/${sheet.id}/download`}
                        className="block w-full text-center bg-[#C41E3A] text-white px-4 py-2 rounded hover:bg-[#a01729] transition-colors font-medium"
                      >
                        Download
                      </Link>

                      <button
                        onClick={() => handleDelete(sheet.id, sheet.name)}
                        className="w-full text-center text-red-600 hover:text-red-900 px-4 py-2 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/account"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Account
          </Link>
        </div>
      </div>
    </div>
  );
}
