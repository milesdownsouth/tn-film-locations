/**
 * Add New Location Page
 * Server component that checks auth before rendering form
 */

import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/auth-middleware';
import AddLocationForm from './AddLocationForm';

export default async function NewLocationPage() {
  // Check if user is admin
  const authCheck = await checkAuth();

  if (!authCheck.authenticated) {
    redirect('/auth/login?redirect=/admin/locations/new');
  }

  if (!authCheck.isAdmin) {
    redirect('/');
  }

  return <AddLocationForm />;
}
