/**
 * Admin Contacts Page
 * View and manage contact form submissions
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ContactsContent from './ContactsContent';

export default async function AdminContactsPage() {
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

  return <ContactsContent />;
}
