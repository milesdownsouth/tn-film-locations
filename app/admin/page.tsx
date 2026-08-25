/**
 * Admin Dashboard
 * Main admin panel with links to manage locations and view stats
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { checkAuth } from '@/lib/auth-middleware';

export default async function AdminPage() {
  // Check if user is admin
  const authCheck = await checkAuth();

  if (!authCheck.authenticated) {
    redirect('/auth/login?redirect=/admin');
  }

  if (!authCheck.isAdmin) {
    redirect('/');
  }

  // Fetch stats
  const supabase = await createClient();

  const { count: totalLocations } = await supabase
    .from('locations')
    .select('*', { count: 'exact', head: true });

  const { count: activeLocations } = await supabase
    .from('locations')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-black">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {authCheck.user?.email}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase">Total Locations</div>
            <div className="mt-2 text-3xl font-bold text-black">{totalLocations || 0}</div>
            <div className="mt-1 text-sm text-gray-600">
              {activeLocations || 0} active
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase">Total Users</div>
            <div className="mt-2 text-3xl font-bold text-black">{totalUsers || 0}</div>
            <div className="mt-1 text-sm text-gray-600">
              Registered accounts
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase">Quick Actions</div>
            <div className="mt-4 space-y-2">
              <Link
                href="/admin/locations/new"
                className="block text-[#C41E3A] hover:text-[#a01729] font-medium"
              >
                + Add Location
              </Link>
              <Link
                href="/search"
                className="block text-blue-600 hover:text-blue-800"
              >
                View Public Site
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/locations">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold text-black mb-2">Manage Locations</h2>
              <p className="text-gray-600">
                View, edit, and delete film locations. Upload images and update details.
              </p>
              <div className="mt-4 text-[#C41E3A] font-bold uppercase">
                Manage Locations →
              </div>
            </div>
          </Link>

          <Link href="/admin/contacts">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold text-black mb-2">Contact Submissions</h2>
              <p className="text-gray-600">
                View and manage contact form submissions. Update status and add notes.
              </p>
              <div className="mt-4 text-[#C41E3A] font-bold uppercase">
                View Contacts →
              </div>
            </div>
          </Link>

          <Link href="/admin/property-types">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold text-black mb-2">Property Types</h2>
              <p className="text-gray-600">
                Add, edit, or remove property types available when creating locations.
              </p>
              <div className="mt-4 text-[#C41E3A] font-bold uppercase">
                Manage Types →
              </div>
            </div>
          </Link>

          <Link href="/admin/settings">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold text-black mb-2">Site Settings</h2>
              <p className="text-gray-600">
                Configure site settings including contact email notifications.
              </p>
              <div className="mt-4 text-[#C41E3A] font-bold uppercase">
                Configure Settings →
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow p-6 opacity-60">
            <h2 className="text-2xl font-semibold text-black mb-2">Manage Users</h2>
            <p className="text-gray-600">
              View users, manage roles, and monitor pull sheet activity.
            </p>
            <div className="mt-4 text-gray-400 font-bold uppercase">
              Coming Soon
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Recent Updates</h2>
          <div className="text-gray-600">
            Recent activity will be displayed here...
          </div>
        </div>
      </div>
    </div>
  );
}
