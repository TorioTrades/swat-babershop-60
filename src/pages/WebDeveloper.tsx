import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload, Image, Trash2, Loader2, LogOut, Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import WebDeveloperLogin from '@/components/WebDeveloperLogin';

interface GalleryImage {
  id: string;
  filename: string;
  image_type: 'before' | 'after' | 'about';
  storage_path: string;
  title?: string;
  description?: string;
  created_at: string;
  url?: string;
}

const WebDeveloper = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [beforeUrl, setBeforeUrl] = useState('');
  const [afterUrl, setAfterUrl] = useState('');
  const [aboutUrl, setAboutUrl] = useState('');
  const { toast } = useToast();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('webdev_authenticated');
      const authTimestamp = localStorage.getItem('webdev_auth_timestamp');
      
      if (authStatus === 'true' && authTimestamp) {
        // Check if authentication is still valid (24 hours)
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const now = Date.now();
        const authTime = parseInt(authTimestamp);
        
        if (now - authTime < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          // Clear expired authentication
          localStorage.removeItem('webdev_authenticated');
          localStorage.removeItem('webdev_auth_timestamp');
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('webdev_authenticated');
    localStorage.removeItem('webdev_auth_timestamp');
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out of the developer dashboard.",
    });
  };

  // Fetch existing images on component mount
  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map images and use storage_path as URL (since it now contains direct URLs)
      const imagesWithUrls: GalleryImage[] = (data || []).map((img) => ({
        id: img.id,
        filename: img.filename,
        image_type: img.image_type as 'before' | 'after' | 'about',
        storage_path: img.storage_path,
        title: img.title || undefined,
        description: img.description || undefined,
        created_at: img.created_at,
        url: img.storage_path // Use storage_path as URL since it contains the direct URL
      }));

      setGalleryImages(imagesWithUrls);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error",
        description: "Failed to fetch gallery images.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUrlUpload = async (url: string, type: 'before' | 'after' | 'about') => {
    if (!url.trim()) return;

    setUploading(true);

    try {
      // Validate URL format
      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
      if (!urlPattern.test(url)) {
        throw new Error('Please enter a valid image URL (jpg, jpeg, png, gif, webp)');
      }

      // Generate a filename from the URL
      const urlObject = new URL(url);
      const fileName = urlObject.pathname.split('/').pop() || `image-${Date.now()}.jpg`;
      
      // Save metadata to database with URL as storage_path
      const { data, error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          filename: fileName,
          image_type: type,
          storage_path: url, // Store the URL directly
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${fileName}`,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const newImage: GalleryImage = {
        id: data.id,
        filename: data.filename,
        image_type: data.image_type as 'before' | 'after' | 'about',
        storage_path: data.storage_path,
        title: data.title || undefined,
        description: data.description || undefined,
        created_at: data.created_at,
        url: data.storage_path // Use storage_path as URL since it contains the direct URL
      };

      setGalleryImages(prev => [newImage, ...prev]);

      toast({
        title: "Image added",
        description: `${type} image has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to add image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (image: GalleryImage) => {
    try {
      // Delete from database only (no storage deletion needed for URLs)
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      // Remove from local state
      setGalleryImages(prev => prev.filter(img => img.id !== image.id));
      
      toast({
        title: "Image removed",
        description: "Image has been removed from the gallery.",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearAboutImages = async () => {
    try {
      setUploading(true);
      
      // Delete all about images from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('image_type', 'about');

      if (dbError) throw dbError;

      // Remove from local state
      setGalleryImages(prev => prev.filter(img => img.image_type !== 'about'));
      
      toast({
        title: "About images cleared",
        description: "All about section images have been removed.",
      });
    } catch (error) {
      console.error('Error clearing about images:', error);
      toast({
        title: "Error",
        description: "Failed to clear about images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const clearAllImages = async () => {
    try {
      setUploading(true);
      
      // Delete from database only (no storage deletion needed for URLs)
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (dbError) throw dbError;

      setGalleryImages([]);
      toast({
        title: "Gallery cleared",
        description: "All images have been removed from the gallery.",
      });
    } catch (error) {
      console.error('Error clearing gallery:', error);
      toast({
        title: "Error",
        description: "Failed to clear gallery. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const beforeImages = galleryImages.filter(img => img.image_type === 'before');
  const afterImages = galleryImages.filter(img => img.image_type === 'after');
  const aboutImages = galleryImages.filter(img => img.image_type === 'about');

  if (loading) {
    return (
      <div className="min-h-screen bg-barbershop-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-barbershop-gold mx-auto mb-4" />
          <p className="text-white">Loading gallery...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <WebDeveloperLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-barbershop-black">
      {/* Header */}
      <div className="bg-barbershop-charcoal border-b border-barbershop-gold/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white font-serif">Web Developer Dashboard</h1>
              <p className="text-gray-300 text-sm">Manage gallery images and website content</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/gallery">
                <Button variant="ghost" size="sm" className="text-barbershop-gold hover:bg-barbershop-gold/10">
                  <Eye className="h-4 w-4 mr-2" />
                  View Gallery
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-400 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Link to="/">
                <Button variant="outline" size="sm" className="border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold hover:text-barbershop-black">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-barbershop-charcoal border border-barbershop-gold/20">
            <TabsTrigger value="upload" className="data-[state=active]:bg-barbershop-gold data-[state=active]:text-barbershop-black">
              <Plus className="h-4 w-4 mr-2" />
              Upload Images
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-barbershop-gold data-[state=active]:text-barbershop-black">
              <Image className="h-4 w-4 mr-2" />
              Manage Images
            </TabsTrigger>
            <TabsTrigger value="overview" className="data-[state=active]:bg-barbershop-gold data-[state=active]:text-barbershop-black">
              <Eye className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Before Images Upload */}
              <Card className="bg-barbershop-charcoal border-barbershop-gold/20 hover:border-barbershop-gold/40 transition-colors">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-white font-serif text-lg">Before Images</CardTitle>
                  <p className="text-gray-400 text-sm">Upload before haircut photos</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="before-url" className="text-gray-300 text-sm">
                      Image URL
                    </Label>
                    <Input
                      id="before-url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={beforeUrl}
                      onChange={(e) => setBeforeUrl(e.target.value)}
                      disabled={uploading}
                      className="bg-barbershop-black/50 border-barbershop-gold/30 text-white placeholder:text-gray-500"
                    />
                    <Button 
                      onClick={() => {
                        handleUrlUpload(beforeUrl, 'before');
                        setBeforeUrl('');
                      }}
                      disabled={uploading || !beforeUrl.trim()}
                      className="w-full bg-barbershop-gold text-barbershop-black hover:bg-barbershop-gold/90"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add Before Image
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Count: {beforeImages.length} images
                  </p>
                </CardContent>
              </Card>

              {/* After Images Upload */}
              <Card className="bg-barbershop-charcoal border-barbershop-gold/20 hover:border-barbershop-gold/40 transition-colors">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-white font-serif text-lg">After Images</CardTitle>
                  <p className="text-gray-400 text-sm">Upload after haircut photos</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="after-url" className="text-gray-300 text-sm">
                      Image URL
                    </Label>
                    <Input
                      id="after-url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={afterUrl}
                      onChange={(e) => setAfterUrl(e.target.value)}
                      disabled={uploading}
                      className="bg-barbershop-black/50 border-barbershop-gold/30 text-white placeholder:text-gray-500"
                    />
                    <Button 
                      onClick={() => {
                        handleUrlUpload(afterUrl, 'after');
                        setAfterUrl('');
                      }}
                      disabled={uploading || !afterUrl.trim()}
                      className="w-full bg-barbershop-gold text-barbershop-black hover:bg-barbershop-gold/90"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add After Image
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Count: {afterImages.length} images
                  </p>
                </CardContent>
              </Card>

              {/* About Collage Upload */}
              <Card className="bg-barbershop-charcoal border-barbershop-gold/20 hover:border-barbershop-gold/40 transition-colors">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-white font-serif text-lg">About Collage</CardTitle>
                  <p className="text-gray-400 text-sm">Upload for About section background</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="about-url" className="text-gray-300 text-sm">
                      Image URL
                    </Label>
                    <Input
                      id="about-url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={aboutUrl}
                      onChange={(e) => setAboutUrl(e.target.value)}
                      disabled={uploading}
                      className="bg-barbershop-black/50 border-barbershop-gold/30 text-white placeholder:text-gray-500"
                    />
                    <Button 
                      onClick={() => {
                        handleUrlUpload(aboutUrl, 'about');
                        setAboutUrl('');
                      }}
                      disabled={uploading || !aboutUrl.trim()}
                      className="w-full bg-barbershop-gold text-barbershop-black hover:bg-barbershop-gold/90"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add About Image
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Count: {aboutImages.length} images
                  </p>
                </CardContent>
              </Card>
            </div>

            {uploading && (
              <div className="mt-6 bg-barbershop-charcoal/50 rounded-lg p-4 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-barbershop-gold mx-auto mb-2" />
                <p className="text-white">Adding image...</p>
              </div>
            )}
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage">
            <div className="space-y-8">
              {/* Before Images */}
              <Card className="bg-barbershop-charcoal border-barbershop-gold/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white font-serif">Before Images ({beforeImages.length})</CardTitle>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => beforeImages.forEach(img => removeImage(img))}
                      disabled={beforeImages.length === 0 || uploading}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {beforeImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={() => removeImage(image)}
                          disabled={uploading}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {beforeImages.length === 0 && (
                      <div className="col-span-full text-center py-12 text-gray-400">
                        No before images uploaded yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* After Images */}
              <Card className="bg-barbershop-charcoal border-barbershop-gold/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white font-serif">After Images ({afterImages.length})</CardTitle>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => afterImages.forEach(img => removeImage(img))}
                      disabled={afterImages.length === 0 || uploading}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {afterImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={() => removeImage(image)}
                          disabled={uploading}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {afterImages.length === 0 && (
                      <div className="col-span-full text-center py-12 text-gray-400">
                        No after images uploaded yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* About Collage Images */}
              <Card className="bg-barbershop-charcoal border-barbershop-gold/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white font-serif">About Collage Images ({aboutImages.length})</CardTitle>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={clearAboutImages}
                      disabled={aboutImages.length === 0 || uploading}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear About Images
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {aboutImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={() => removeImage(image)}
                          disabled={uploading}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {aboutImages.length === 0 && (
                      <div className="col-span-full text-center py-12 text-gray-400">
                        No about collage images uploaded yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-barbershop-charcoal border-barbershop-gold/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-white font-serif">Before Images</CardTitle>
                  <div className="text-3xl font-bold text-barbershop-gold">{beforeImages.length}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm text-center">
                    Images showing before haircut results
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-barbershop-charcoal border-barbershop-gold/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-white font-serif">After Images</CardTitle>
                  <div className="text-3xl font-bold text-barbershop-gold">{afterImages.length}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm text-center">
                    Images showing after haircut results
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-barbershop-charcoal border-barbershop-gold/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-white font-serif">About Collage</CardTitle>
                  <div className="text-3xl font-bold text-barbershop-gold">{aboutImages.length}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm text-center">
                    Images for About section background
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 space-y-4">
              <Card className="bg-barbershop-charcoal border-barbershop-gold/20">
                <CardHeader>
                  <CardTitle className="text-white font-serif">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/gallery" className="block">
                    <Button className="w-full bg-barbershop-gold text-barbershop-black hover:bg-barbershop-gold/90">
                      <Eye className="h-4 w-4 mr-2" />
                      View Gallery
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={clearAllImages}
                    disabled={uploading || galleryImages.length === 0}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Clearing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All Images
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WebDeveloper;