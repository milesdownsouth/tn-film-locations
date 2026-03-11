import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/auth-middleware';
import PropertyTypesContent from './PropertyTypesContent';

export default async function PropertyTypesPage() {
  const authCheck = await checkAuth();

  if (!authCheck.authenticated) {
    redirect('/auth/login?redirect=/admin/property-types');
  }

  if (!authCheck.isAdmin) {
    redirect('/');
  }

  return <PropertyTypesContent />;
}
