/**
 * Authentication Middleware Utilities
 * For protecting routes and checking user roles
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { User } from '@/types/database';

export interface AuthCheckResult {
  authenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  error?: string;
}

/**
 * Check if the current user is authenticated and get their role
 */
export async function checkAuth(): Promise<AuthCheckResult> {
  try {
    const supabase = await createClient();

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return {
        authenticated: false,
        isAdmin: false,
        user: null,
        error: 'Not authenticated'
      };
    }

    // Get user profile with role
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileError || !userProfile) {
      return {
        authenticated: true,
        isAdmin: false,
        user: null,
        error: 'User profile not found'
      };
    }

    return {
      authenticated: true,
      isAdmin: userProfile.role === 'admin',
      user: userProfile as User
    };
  } catch (error) {
    console.error('Auth check error:', error);
    return {
      authenticated: false,
      isAdmin: false,
      user: null,
      error: 'Authentication check failed'
    };
  }
}

/**
 * Require authentication - returns user or redirects
 */
export async function requireAuth() {
  const authCheck = await checkAuth();

  if (!authCheck.authenticated) {
    return {
      redirect: '/auth/login',
      user: null
    };
  }

  return {
    redirect: null,
    user: authCheck.user
  };
}

/**
 * Require admin role - returns user or error response
 */
export async function requireAdmin() {
  const authCheck = await checkAuth();

  if (!authCheck.authenticated) {
    return {
      error: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
      user: null
    };
  }

  if (!authCheck.isAdmin) {
    return {
      error: NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      ),
      user: null
    };
  }

  return {
    error: null,
    user: authCheck.user
  };
}

/**
 * Check if user owns a resource (for user-specific routes)
 */
export async function checkResourceOwnership(resourceUserId: string): Promise<boolean> {
  const authCheck = await checkAuth();

  if (!authCheck.authenticated || !authCheck.user) {
    return false;
  }

  // Admins can access all resources
  if (authCheck.isAdmin) {
    return true;
  }

  // Regular users can only access their own resources
  return authCheck.user.id === resourceUserId;
}
