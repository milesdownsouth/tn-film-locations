/**
 * Saved Locations Page
 * Shows user's favorite/saved locations
 */

import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/auth-middleware';
import SavedLocationsContent from './SavedLocationsContent';

export default async function SavedLocationsPage() {
  // Check if user is authenticated
  const authCheck = await checkAuth();

  if (!authCheck.authenticated) {
    redirect('/auth/login?redirect=/account/saved');
  }

  return <SavedLocationsContent />;
}
