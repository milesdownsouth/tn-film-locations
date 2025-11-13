import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth-middleware';

export async function GET() {
  const authCheck = await checkAuth();

  return NextResponse.json({
    authenticated: authCheck.authenticated,
    isAdmin: authCheck.isAdmin,
    user: authCheck.user,
    error: authCheck.error
  });
}
