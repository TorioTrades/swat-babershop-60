-- Fix the generate_booking_id function to resolve column ambiguity issue
CREATE OR REPLACE FUNCTION public.generate_booking_id()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    next_id INTEGER;
    booking_id TEXT;
BEGIN
    -- Get the next sequential number by explicitly referencing the table and column
    SELECT COALESCE(MAX(CAST(SUBSTRING(a.booking_id FROM 'CLNT-(\d+)') AS INTEGER)), 0) + 1
    INTO next_id
    FROM public.appointments a
    WHERE a.booking_id IS NOT NULL AND a.booking_id ~ '^CLNT-\d+$';
    
    -- Generate the booking ID
    booking_id := 'CLNT-' || next_id;
    
    RETURN booking_id;
END;
$function$