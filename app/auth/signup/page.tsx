/**
 * Signup Page
 * User registration with Supabase Auth
 */

import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/auth-middleware';
import SignupForm from './SignupForm';

export default async function SignupPage() {
  const authCheck = await checkAuth();

  // If already logged in, redirect to account page
  if (authCheck.user) {
    redirect('/account');
  }

  return <SignupForm />;
}
