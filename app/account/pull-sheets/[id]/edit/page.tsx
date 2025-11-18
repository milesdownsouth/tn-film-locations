/**
 * Edit Pull Sheet Page
 */

import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/auth-middleware';
import EditPullSheetForm from './EditPullSheetForm';

export default async function EditPullSheetPage({ params }: { params: Promise<{ id: string }> }) {
  // Check if user is authenticated
  const authCheck = await checkAuth();

  if (!authCheck.authenticated) {
    const { id } = await params;
    redirect(`/auth/login?redirect=/account/pull-sheets/${id}/edit`);
  }

  const { id } = await params;
  return <EditPullSheetForm pullSheetId={id} />;
}
