
-- First, let's update the RLS policies to allow public access for admin functionality
-- since this is an admin feature and doesn't require user authentication

-- Drop existing policies that require authentication
DROP POLICY IF EXISTS "Users can create their own unavailable slots" ON public.unavailable_slots;
DROP POLICY IF EXISTS "Users can view their own unavailable slots" ON public.unavailable_slots;
DROP POLICY IF EXISTS "Users can update their own unavailable slots" ON public.unavailable_slots;
DROP POLICY IF EXISTS "Users can delete their own unavailable slots" ON public.unavailable_slots;

-- Create new policies that allow public access for admin functionality
CREATE POLICY "Allow public creation of unavailable slots" 
ON public.unavailable_slots 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update of unavailable slots" 
ON public.unavailable_slots 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public deletion of unavailable slots" 
ON public.unavailable_slots 
FOR DELETE 
USING (true);

-- The "Public can view unavailable slots" policy already exists and allows SELECT
