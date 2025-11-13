/**
 * Edit Location Page
 * Server component that checks auth and fetches location before rendering form
 */

import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkAuth } from '@/lib/auth-middleware';
import EditLocationForm from './EditLocationForm';

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Check if user is admin
  const authCheck = await checkAuth();

  if (!authCheck.authenticated) {
    redirect('/auth/login?redirect=/admin/locations/${id}/edit');
  }

  if (!authCheck.isAdmin) {
    redirect('/');
  }

  // Fetch the location
  const supabase = await createClient();
  const { data: location, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !location) {
    notFound();
  }

  return <EditLocationForm location={location} />;
}
