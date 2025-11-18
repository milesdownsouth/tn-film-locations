/**
 * User Account Page
 * Dashboard for logged-in users
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/auth-middleware';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from './LogoutButton';

export default async function AccountPage() {
  const authCheck = await checkAuth();

  if (!authCheck.user) {
    redirect('/auth/login?redirect=/account');
  }

  const supabase = await createClient();
  const userId = authCheck.user.id;

  // Get saved locations count
  const { count: savedCount } = await supabase
    .from('saved_locations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Get pull sheets count
  const { count: pullSheetsCount } = await supabase
    .from('pull_sheets')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-semibold mb-2">My Account</h1>
          <p className="text-gray-600">{authCheck.user.email}</p>
          {authCheck.isAdmin && (
            <span className="inline-block mt-2 px-3 py-1 bg-[#C41E3A] text-white text-sm font-bold rounded">
              ADMIN
            </span>
          )}
        </div>
        <LogoutButton />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border-2 border-black p-6">
          <div className="text-3xl font-bold text-[#C41E3A]">{savedCount || 0}</div>
          <div className="text-gray-600 mt-1">Saved Locations</div>
        </div>
        <div className="bg-white border-2 border-black p-6">
          <div className="text-3xl font-bold text-[#C41E3A]">{pullSheetsCount || 0}</div>
          <div className="text-gray-600 mt-1">Pull Sheets</div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/account/saved"
          className="block bg-white border-2 border-black p-6 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">Saved Locations</h2>
          <p className="text-gray-600 text-sm">
            View and manage your saved film locations
          </p>
        </Link>

        <Link
          href="/account/pull-sheets"
          className="block bg-white border-2 border-black p-6 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">Pull Sheets</h2>
          <p className="text-gray-600 text-sm">
            Create and manage location collections
          </p>
        </Link>

        <Link
          href="/search"
          className="block bg-white border-2 border-black p-6 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">Browse Locations</h2>
          <p className="text-gray-600 text-sm">
            Discover new filming locations
          </p>
        </Link>

        {authCheck.isAdmin && (
          <>
            <Link
              href="/admin"
              className="block bg-[#C41E3A] text-white border-2 border-black p-6 hover:bg-[#a01729] transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
              <p className="text-white text-sm opacity-90">
                Manage locations and users
              </p>
            </Link>

            <Link
              href="/admin/locations"
              className="block bg-[#C41E3A] text-white border-2 border-black p-6 hover:bg-[#a01729] transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">Manage Locations</h2>
              <p className="text-white text-sm opacity-90">
                Add, edit, and delete locations
              </p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
