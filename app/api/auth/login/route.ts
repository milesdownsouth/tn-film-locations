import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST - User login
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Sign in the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Login error:', authError);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!authData.user || !authData.session) {
      return NextResponse.json(
        { error: 'Failed to sign in' },
        { status: 500 }
      );
    }

    // Get user profile from public.users table
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    return NextResponse.json({
      message: 'Signed in successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: userProfile?.role || 'user',
      },
      session: authData.session,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
