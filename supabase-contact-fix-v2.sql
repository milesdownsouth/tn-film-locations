-- Fix Contact Submissions RLS Policy (Version 2)
-- More aggressive fix for anonymous submissions

-- Drop all existing policies on the table
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow anonymous contact form submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;

-- Disable RLS temporarily to test
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create a new permissive policy for inserts
CREATE POLICY "Public can insert contact submissions"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Recreate admin read policy
CREATE POLICY "Admins can read contact submissions" ON public.contact_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Recreate admin update policy
CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Grant explicit permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT INSERT ON public.contact_submissions TO anon, authenticated, service_role;
GRANT SELECT, UPDATE ON public.contact_submissions TO authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
