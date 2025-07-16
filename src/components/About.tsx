import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Award, Users, Clock, Star, Images, Facebook } from 'lucide-react';
import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { supabase } from '@/integrations/supabase/client';
import GalleryDialog from './GalleryDialog';

const About = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [galleryImages, setGalleryImages] = useState<Array<{src: string; alt: string}>>([]);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch about images from Supabase
  useEffect(() => {
    const fetchAboutImages = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('image_type', 'about')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          // Use storage_path directly as it now contains URLs
          const imagesWithUrls = data.map((img) => ({
            src: img.storage_path, // storage_path now contains the direct URL
            alt: img.title || img.filename || 'Barbershop image'
          }));
          setGalleryImages(imagesWithUrls);
        } else {
          // Use empty array if no about images uploaded - no fallback
          setGalleryImages([]);
        }
      } catch (error) {
        console.error('Error fetching about images:', error);
        // Use empty array on error
        setGalleryImages([]);
      }
    };

    fetchAboutImages();
  }, []);

  const features = [{
    icon: <Award className="h-6 w-6" />,
    title: "Master Craftsmen",
    description: "Our barbers are trained in classical techniques and modern styles"
  }, {
    icon: <Star className="h-6 w-6" />,
    title: "Premium Products",
    description: "We use only the finest grooming products and tools"
  }, {
    icon: <Clock className="h-6 w-6" />,
    title: "Timeless Tradition",
    description: "Combining old-school barbering with contemporary convenience"
  }, {
    icon: <Users className="h-6 w-6" />,
    title: "Personalized Service",
    description: "Every client receives individual attention and care"
  }];
  
  // Default fallback images
  const defaultImages = [{
    src: "/lovable-uploads/1976d168-0d0e-4f74-8c5c-a6ae50bf04c0.png",
    alt: "Barber working with client in modern barbershop"
  }, {
    src: "/lovable-uploads/650aa3b3-e5b0-4806-8e65-8a495cebc163.png",
    alt: "Professional haircut result"
  }, {
    src: "/lovable-uploads/de6728fa-50af-483a-af6e-ebee7a924f42.png",
    alt: "Luxury barbershop interior"
  }, {
    src: "/lovable-uploads/37a86fb8-d562-4b0f-bf65-09151afd010c.png",
    alt: "Busy barbershop atmosphere"
  }, {
    src: "/lovable-uploads/60e33eca-65d7-40ce-b70f-19f8d93f00c8.png",
    alt: "Professional barbershop service"
  }];

  // Group images into pairs for desktop collage
  const imageCollages = [];
  for (let i = 0; i < galleryImages.length; i += 2) {
    imageCollages.push(galleryImages.slice(i, i + 2));
  }

  return <section id="about" className="relative overflow-hidden">
      {/* Show background carousel only if there are images */}
      {galleryImages.length > 0 && (
        <div className="absolute inset-0 z-0">
          <Carousel plugins={[Autoplay({
          delay: 4000,
          stopOnInteraction: false
        })]} opts={{
          align: "start",
          loop: true
        }} className="w-full h-full">
            <CarouselContent className="h-full">
              {isMobile ? (
                // Mobile: Single image per slide
                galleryImages.map((image, index) => (
                  <CarouselItem key={index} className="h-full">
                    <div className="relative w-full h-screen">
                      <img 
                        src={image.src} 
                        alt={image.alt} 
                        className="w-full h-full object-cover object-center" 
                      />
                      <div className="absolute inset-0 bg-barbershop-black/70" />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                // Desktop: Collage with 2 images per slide
                imageCollages.map((imagePair, index) => (
                  <CarouselItem key={index} className="h-full">
                    <div className="relative w-full h-screen">
                      <div className="grid grid-cols-2 h-full gap-0">
                        {imagePair.map((image, imgIndex) => (
                          <div key={imgIndex} className="relative h-full w-full">
                            <img 
                              src={image.src} 
                              alt={image.alt} 
                              className="w-full h-full object-cover object-center" 
                            />
                          </div>
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-barbershop-black/70" />
                    </div>
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
          </Carousel>
        </div>
      )}

      {/* Content Overlay */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col justify-between ${
        galleryImages.length === 0 ? 'bg-barbershop-black' : ''
      }`}>
        {/* Open Gallery Button - Top */}
        <div className="pt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => setGalleryDialogOpen(true)}
            className="bg-barbershop-gold/90 border-barbershop-gold text-barbershop-black hover:bg-barbershop-gold hover:text-barbershop-black backdrop-blur-sm font-semibold animate-pulse-zoom"
          >
            <Images className="h-4 w-4 mr-2" />
            OPEN GALLERY
          </Button>
        </div>

        {/* Why Choose Elite Section - Very Bottom */}
        <div className="pb-8 mb-0 mt-auto pt-16 lg:pt-64">
          <div className="max-w-sm mx-auto">
            <Card className="p-3 bg-transparent border-none shadow-none">
              <CardContent className="p-0">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2 font-serif">Why Choose SWAT Barber Shop?</h3>
                  <p className="text-gray-300 text-xs">
                    We're more than just a barbershop – we're a destination for the modern gentleman.
                  </p>
                  
                  {/* Facebook Button */}
                  <div className="mt-4 text-center">
                    <a 
                      href="https://www.facebook.com/profile.php?id=61566710077999" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-barbershop-gold/10 hover:bg-barbershop-gold/20 text-barbershop-gold border border-barbershop-gold/30 hover:border-barbershop-gold/50 px-4 py-2 rounded-lg transition-all duration-300 group"
                    >
                      <Facebook className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Follow us on Facebook</span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Gallery Dialog */}
      <GalleryDialog 
        open={galleryDialogOpen} 
        onOpenChange={setGalleryDialogOpen} 
      />
    </section>;
};

export default About;
