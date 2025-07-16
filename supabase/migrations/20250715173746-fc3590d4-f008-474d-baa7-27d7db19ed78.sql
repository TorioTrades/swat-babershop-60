-- Add booking_id column to appointments table
ALTER TABLE public.appointments 
ADD COLUMN booking_id TEXT UNIQUE;

-- Create a function to generate sequential booking IDs
CREATE OR REPLACE FUNCTION public.generate_booking_id()
RETURNS TEXT AS $$
DECLARE
    next_id INTEGER;
    booking_id TEXT;
BEGIN
    -- Get the next sequential number
    SELECT COALESCE(MAX(CAST(SUBSTRING(booking_id FROM 'CLNT-(\d+)') AS INTEGER)), 0) + 1
    INTO next_id
    FROM public.appointments 
    WHERE booking_id IS NOT NULL AND booking_id ~ '^CLNT-\d+$';
    
    -- Generate the booking ID
    booking_id := 'CLNT-' || next_id;
    
    RETURN booking_id;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set booking_id on insert
CREATE OR REPLACE FUNCTION public.set_booking_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_id IS NULL THEN
        NEW.booking_id := public.generate_booking_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER set_booking_id_trigger
    BEFORE INSERT ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.set_booking_id();