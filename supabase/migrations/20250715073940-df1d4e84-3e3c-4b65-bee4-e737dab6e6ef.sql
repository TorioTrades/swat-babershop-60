-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-images', 'gallery-images', true);

-- Create storage policies for gallery images
CREATE POLICY "Anyone can view gallery images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery-images');

CREATE POLICY "Anyone can upload gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY "Anyone can update gallery images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery-images');

CREATE POLICY "Anyone can delete gallery images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery-images');

-- Create table for gallery image metadata
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('before', 'after')),
  storage_path TEXT NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery images table
CREATE POLICY "Anyone can view gallery images" 
ON public.gallery_images 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create gallery images" 
ON public.gallery_images 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update gallery images" 
ON public.gallery_images 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete gallery images" 
ON public.gallery_images 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gallery_images_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();