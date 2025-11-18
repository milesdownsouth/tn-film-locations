/**
 * Public Pull Sheet View Page
 * Accessible via share token
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PublicPullSheetView from './PublicPullSheetView';

export default async function PublicPullSheetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();

  // Fetch pull sheet by share token
  const { data: pullSheet, error } = await supabase
    .from('pull_sheets')
    .select(`
      *,
      pull_sheet_locations(
        id,
        location_id,
        added_at,
        locations(*)
      )
    `)
    .eq('share_token', token)
    .eq('is_public', true)
    .single();

  if (error || !pullSheet) {
    redirect('/');
  }

  const locations = pullSheet.pull_sheet_locations?.map((psl: any) => psl.locations) || [];

  return <PublicPullSheetView pullSheet={{ ...pullSheet, locations }} />;
}
