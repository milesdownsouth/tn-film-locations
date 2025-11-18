/**
 * Homepage - Matches Design Exactly
 */

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import HomeContent from './HomeContent';
import type { Location } from '@/types/database';

export default async function Home() {
  // Fetch featured locations
  const supabase = await createClient();
  const { data: featuredLocations } = await supabase
    .from('locations')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  return <HomeContent featuredLocations={featuredLocations || []} />;
}
