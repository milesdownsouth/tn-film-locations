-- Fix Contact Submissions RLS Policy
-- This allows public (anonymous) form submissions

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

-- Recreate policy with explicit anonymous access
CREATE POLICY "Allow anonymous contact form submissions" ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure proper grants for anonymous users
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.contact_submissions TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
