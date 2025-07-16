-- Remove booking ID system

-- Drop the trigger that automatically generates booking IDs
DROP TRIGGER IF EXISTS set_booking_id_trigger ON public.appointments;

-- Drop the functions related to booking ID generation
DROP FUNCTION IF EXISTS public.set_booking_id();
DROP FUNCTION IF EXISTS public.generate_booking_id();

-- Remove the booking_id column from appointments table
ALTER TABLE public.appointments DROP COLUMN IF EXISTS booking_id;