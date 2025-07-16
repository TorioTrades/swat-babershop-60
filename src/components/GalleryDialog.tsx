import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
interface GalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
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
const GalleryDialog = ({
  open,
  onOpenChange
}: GalleryDialogProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [beforeAfterPhotos, setBeforeAfterPhotos] = useState<BeforeAfterPair[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (open) {
      fetchGalleryImages();
    }
  }, [open]);
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
  const handleClose = () => {
    setCurrentIndex(0);
    setLoading(true);
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-barbershop-charcoal border-barbershop-gold/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-barbershop-gold text-center">
            Before & After Gallery
          </DialogTitle>
          <p className="text-gray-300 text-center mt-2">
            See the amazing transformations at SWAT Barber Shop
          </p>
        </DialogHeader>

        {loading ? <div className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-barbershop-gold mx-auto mb-4" />
            <p className="text-white">Loading gallery...</p>
          </div> : beforeAfterPhotos.length === 0 ? <div className="py-12 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">No Images Available</h3>
            <p className="text-gray-300">Gallery images will appear here once uploaded.</p>
          </div> : <Card className="bg-barbershop-charcoal border-barbershop-gold/20 mt-6">
            <CardContent className="p-4">
              <div className="text-center mb-6">
                
                
              </div>

              {/* Before & After Images */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Before */}
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-barbershop-gold text-center">BEFORE</h4>
                  <div className="relative aspect-[2/3] max-w-sm mx-auto overflow-hidden rounded-lg">
                    <img src={currentPhoto.before} alt="Before haircut" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      BEFORE
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-barbershop-gold text-center">AFTER</h4>
                  <div className="relative aspect-[2/3] max-w-sm mx-auto overflow-hidden rounded-lg">
                    <img src={currentPhoto.after} alt="After haircut" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      AFTER
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation (if multiple photos) */}
              {beforeAfterPhotos.length > 1 && <div className="flex justify-center items-center space-x-4 mb-6">
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
              <div className="text-center">
                <div className="bg-barbershop-gold/10 rounded-lg p-4 border border-barbershop-gold/20">
                  <h4 className="text-lg font-semibold text-white mb-2">Ready for Your Transformation?</h4>
                  <p className="text-gray-300 mb-4">Book your appointment today and experience the SWAT difference</p>
                  <Button onClick={handleClose} className="bg-barbershop-gold text-barbershop-black hover:bg-barbershop-gold/90 font-semibold">
                    Book Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>}
      </DialogContent>
    </Dialog>;
};
export default GalleryDialog;