/**
 * Admin Settings Page
 * Configure site settings including contact email
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SettingsContent from './SettingsContent';

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/signin');
  }

  // Check if user is admin
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!userData || userData.role !== 'admin') {
    redirect('/');
  }

  return <SettingsContent />;
}
