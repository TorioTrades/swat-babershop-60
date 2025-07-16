-- Check what image_type values are allowed by trying to insert test values
INSERT INTO gallery_images (filename, image_type, storage_path, title) 
VALUES ('test.jpg', 'before', 'https://example.com/test.jpg', 'Test Image');