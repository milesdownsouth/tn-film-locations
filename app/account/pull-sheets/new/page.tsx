/**
 * Create New Pull Sheet Page
 */

import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/auth-middleware';
import NewPullSheetForm from './NewPullSheetForm';

export default async function NewPullSheetPage() {
  // Check if user is authenticated
  const authCheck = await checkAuth();

  if (!authCheck.authenticated) {
    redirect('/auth/login?redirect=/account/pull-sheets/new');
  }

  return <NewPullSheetForm />;
}
