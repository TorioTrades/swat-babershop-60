-- Allow 'about' as a valid image_type by adding/updating the constraint
ALTER TABLE gallery_images DROP CONSTRAINT IF EXISTS gallery_images_image_type_check;

-- Add a new constraint that includes 'about'
ALTER TABLE gallery_images ADD CONSTRAINT gallery_images_image_type_check 
CHECK (image_type IN ('before', 'after', 'about'));