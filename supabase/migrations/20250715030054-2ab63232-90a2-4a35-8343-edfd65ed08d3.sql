-- Create unavailable_slots table for managing barber unavailability
CREATE TABLE public.unavailable_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  reason TEXT,
  is_whole_day BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.unavailable_slots ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is admin functionality)
CREATE POLICY "Anyone can view unavailable slots" 
ON public.unavailable_slots 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create unavailable slots" 
ON public.unavailable_slots 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update unavailable slots" 
ON public.unavailable_slots 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete unavailable slots" 
ON public.unavailable_slots 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_unavailable_slots_updated_at
BEFORE UPDATE ON public.unavailable_slots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();