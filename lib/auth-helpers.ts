/**
 * Authentication Helper Functions (Client-Side Only)
 * For server-side auth, import directly from @/lib/supabase/server
 */

import { createClient as createBrowserClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { UserRole } from '@/types/database';

/**
 * Get the current user (client-side)
 */
export async function getCurrentUser(): Promise<SupabaseUser | null> {
  const supabase = createBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current user with role (client-side)
 */
export async function getCurrentUserWithRole(): Promise<(SupabaseUser & { role?: UserRole }) | null> {
  const supabase = createBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch user role from database
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return {
    ...user,
    role: userData?.role as UserRole,
  };
}

/**
 * Check if user is admin (client-side)
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUserWithRole();
  return user?.role === 'admin';
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = createBrowserClient();
  await supabase.auth.signOut();
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient();
  return await supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string) {
  const supabase = createBrowserClient();
  return await supabase.auth.signUp({ email, password });
}
