/**
 * Login Page
 * User authentication with Supabase Auth
 */

import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/auth-middleware';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const authCheck = await checkAuth();

  // If already logged in, redirect to account page
  if (authCheck.user) {
    redirect('/account');
  }

  return <LoginForm />;
}
