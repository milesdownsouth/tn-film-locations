-- Final comprehensive fix for contact_submissions table
-- This completely resets all permissions and policies

-- Step 1: Drop all existing policies
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow anonymous contact form submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;

-- Step 2: Disable RLS to reset
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;

-- Step 3: Revoke existing permissions
REVOKE ALL ON public.contact_submissions FROM anon, authenticated, service_role;

-- Step 4: Grant base permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;

-- Step 5: Grant sequence permissions for ID generation
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Step 6: Re-enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Step 7: Create simplified policies
-- Policy 1: Allow anyone (anon + authenticated) to insert
CREATE POLICY "allow_insert_contact"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Allow authenticated users to read (for admins)
CREATE POLICY "allow_select_contact"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Policy 3: Allow authenticated users to update (for admins)
CREATE POLICY "allow_update_contact"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Verify the changes
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'contact_submissions';
