-- Add is_featured column to locations table
-- This allows marking locations to be featured on the home page

ALTER TABLE public.locations
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Add index for faster queries of featured locations
CREATE INDEX IF NOT EXISTS idx_locations_is_featured
ON public.locations(is_featured)
WHERE is_featured = true;

COMMENT ON COLUMN public.locations.is_featured IS 'Whether this location should be featured on the home page';
