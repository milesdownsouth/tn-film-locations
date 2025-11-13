/**
 * Admin Locations List Page
 * Shows all locations with edit/delete capabilities
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { checkAuth } from '@/lib/auth-middleware';
import type { Location } from '@/types/database';

export default async function AdminLocationsPage() {
  // Check if user is admin
  const authCheck = await checkAuth();

  if (!authCheck.authenticated) {
    redirect('/auth/login?redirect=/admin/locations');
  }

  if (!authCheck.isAdmin) {
    redirect('/');
  }

  // Fetch all locations (including inactive ones)
  const supabase = await createClient();
  const { data: locations, error } = await supabase
    .from('locations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching locations:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black">Manage Locations</h1>
            <p className="text-gray-600 mt-2">
              {locations?.length || 0} total locations
            </p>
          </div>
          <Link
            href="/admin/locations/new"
            className="bg-[#C41E3A] text-white px-6 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
          >
            + Add Location
          </Link>
        </div>

        {/* Locations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  City
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locations && locations.length > 0 ? (
                locations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 rounded overflow-hidden bg-gray-200">
                        {location.images && location.images.length > 0 ? (
                          <img
                            src={location.images[0]}
                            alt={location.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {location.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {location.county} County
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{location.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {location.property_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        location.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {location.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/locations/${location.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        target="_blank"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/locations/${location.id}/edit`}
                        className="text-[#C41E3A] hover:text-[#a01729]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${location.name}"?`)) {
                            // TODO: Implement delete
                            alert('Delete functionality will be implemented');
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No locations found. Add your first location to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Back to Admin Home */}
        <div className="mt-8">
          <Link
            href="/admin"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
