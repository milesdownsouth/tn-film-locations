/**
 * Pull Sheets List Page
 * Shows user's pull sheets
 */

import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/auth-middleware';
import PullSheetsContent from './PullSheetsContent';

export default async function PullSheetsPage() {
  // Check if user is authenticated
  const authCheck = await checkAuth();

  if (!authCheck.authenticated) {
    redirect('/auth/login?redirect=/account/pull-sheets');
  }

  return <PullSheetsContent />;
}
