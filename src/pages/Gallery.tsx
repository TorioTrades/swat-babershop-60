import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
interface GalleryImage {
  id: string;
  filename: string;
  image_type: 'before' | 'after';
  storage_path: string;
  title?: string;
  description?: string;
  created_at: string;
  url: string;
}
interface BeforeAfterPair {
  id: string;
  title: string;
  before: string;
  after: string;
  description: string;
}
const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [beforeAfterPhotos, setBeforeAfterPhotos] = useState<BeforeAfterPair[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchGalleryImages();
  }, []);
  const fetchGalleryImages = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('gallery_images').select('*').order('created_at', {
        ascending: false
      });
      if (error) throw error;

      // Use storage_path directly as URL since it contains full URLs
      const imagesWithUrls: GalleryImage[] = (data || []).map(img => ({
        id: img.id,
        filename: img.filename,
        image_type: img.image_type as 'before' | 'after',
        storage_path: img.storage_path,
        title: img.title || undefined,
        description: img.description || undefined,
        created_at: img.created_at,
        url: img.storage_path // Use storage_path directly as it contains full URLs
      }));

      // Group images into before/after pairs
      const beforeImages = imagesWithUrls.filter(img => img.image_type === 'before');
      const afterImages = imagesWithUrls.filter(img => img.image_type === 'after');

      // Create pairs - for now, pair them by creation order
      const pairs: BeforeAfterPair[] = [];
      const maxPairs = Math.min(beforeImages.length, afterImages.length);
      for (let i = 0; i < maxPairs; i++) {
        pairs.push({
          id: `pair-${i}`,
          title: beforeImages[i].title || `Transformation ${i + 1}`,
          before: beforeImages[i].url,
          after: afterImages[i].url,
          description: beforeImages[i].description || 'Amazing transformation at SWAT Barbershop'
        });
      }

      // If there are extra before or after images, create individual entries
      if (beforeImages.length > afterImages.length) {
        for (let i = maxPairs; i < beforeImages.length; i++) {
          pairs.push({
            id: `before-${i}`,
            title: beforeImages[i].title || `Before ${i + 1}`,
            before: beforeImages[i].url,
            after: beforeImages[i].url,
            // Use same image for both
            description: beforeImages[i].description || 'Before haircut'
          });
        }
      } else if (afterImages.length > beforeImages.length) {
        for (let i = maxPairs; i < afterImages.length; i++) {
          pairs.push({
            id: `after-${i}`,
            title: afterImages[i].title || `After ${i + 1}`,
            before: afterImages[i].url,
            // Use same image for both
            after: afterImages[i].url,
            description: afterImages[i].description || 'After haircut'
          });
        }
      }
      setBeforeAfterPhotos(pairs);
    } catch (error) {
      console.error('Error fetching images:', error);
      // Fallback to default images if there's an error
      setBeforeAfterPhotos([{
        id: "1",
        title: "Modern Fade Transformation",
        before: "/lovable-uploads/40909bf9-06c3-4a40-8e82-d48b4bdf7c99.png",
        after: "/lovable-uploads/6819fdfb-084e-450b-994c-2d99b87745d0.png",
        description: "Clean modern fade with stylish finish"
      }]);
    } finally {
      setLoading(false);
    }
  };
  const nextPhoto = () => {
    setCurrentIndex(prev => (prev + 1) % beforeAfterPhotos.length);
  };
  const prevPhoto = () => {
    setCurrentIndex(prev => (prev - 1 + beforeAfterPhotos.length) % beforeAfterPhotos.length);
  };
  const currentPhoto = beforeAfterPhotos[currentIndex];
  if (loading) {
    return <div className="min-h-screen bg-barbershop-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-barbershop-gold mx-auto mb-4" />
          <p className="text-white">Loading gallery...</p>
        </div>
      </div>;
  }
  if (beforeAfterPhotos.length === 0) {
    return <div className="min-h-screen bg-barbershop-black">
        <div className="bg-barbershop-charcoal border-b border-barbershop-gold/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white font-serif">Before & After Gallery</h1>
                <p className="text-gray-300 mt-2">See the amazing transformations at SWAT Barber Shop</p>
              </div>
              <Link to="/">
                <Button variant="outline" className="border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold hover:text-barbershop-black">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="bg-barbershop-charcoal border-barbershop-gold/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4 font-serif">No Images Available</h2>
              
              <Link to="/web-developer">
                
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-barbershop-black">
      {/* Header */}
      <div className="bg-barbershop-charcoal border-b border-barbershop-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-serif">Before & After Gallery</h1>
              <p className="text-gray-300 mt-2">See the amazing transformations at SWAT Barber Shop</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/web-developer">
                
              </Link>
              <Link to="/">
                <Button variant="outline" className="border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold hover:text-barbershop-black">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-barbershop-charcoal border-barbershop-gold/20">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              
              
            </div>

            {/* Before & After Images */}
            <div className="grid grid-cols-2 gap-2 md:gap-8 mb-8">
              {/* Before */}
              <div className="space-y-1 md:space-y-4">
                <h3 className="text-sm md:text-xl font-semibold text-barbershop-gold text-center">BEFORE</h3>
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                  <img src={currentPhoto.before} alt="Before haircut" className="w-full h-full object-cover" />
                  <div className="absolute top-1 md:top-4 left-1 md:left-4 bg-red-600 text-white px-1 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-semibold">
                    BEFORE
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="space-y-1 md:space-y-4">
                <h3 className="text-sm md:text-xl font-semibold text-barbershop-gold text-center">AFTER</h3>
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                  <img src={currentPhoto.after} alt="After haircut" className="w-full h-full object-cover" />
                  <div className="absolute top-1 md:top-4 left-1 md:left-4 bg-green-600 text-white px-1 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-semibold">
                    AFTER
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation (if multiple photos) */}
            {beforeAfterPhotos.length > 1 && <div className="flex justify-center items-center space-x-4">
                <Button onClick={prevPhoto} variant="outline" className="border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold hover:text-barbershop-black">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <span className="text-white">
                  {currentIndex + 1} of {beforeAfterPhotos.length}
                </span>
                
                <Button onClick={nextPhoto} variant="outline" className="border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold hover:text-barbershop-black">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>}

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="bg-barbershop-gold/10 rounded-lg p-4 border border-barbershop-gold/20">
                <h3 className="text-xl font-semibold text-white mb-2">Ready for Your Transformation?</h3>
                <p className="text-gray-300 mb-4">Book your appointment today and experience the SWAT difference</p>
                <Link to="/">
                  <Button className="bg-barbershop-gold text-barbershop-black hover:bg-barbershop-gold/90 font-semibold">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Gallery;