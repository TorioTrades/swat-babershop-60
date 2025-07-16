import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Scissors, Star, Award } from 'lucide-react';
import BookingDialog from './BookingDialog';
const Hero = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  return <>
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 md:pt-24">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-no-repeat" style={{
        backgroundImage: window.innerWidth < 768 ? 'url(/lovable-uploads/b657fc07-b1a7-4c01-a23d-9d62a3519722.png)' : 'url(/lovable-uploads/a0bd62e6-3f45-42d5-8df1-0f339afe1331.png)',
        backgroundPosition: window.innerWidth < 768 ? 'right bottom' : 'top'
      }}>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/75"></div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 transform -rotate-12">
            <Scissors className="h-32 w-32 text-barbershop-gold" />
          </div>
          <div className="absolute top-3/4 right-1/4 transform rotate-12">
            <Scissors className="h-24 w-24 text-barbershop-gold" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            {/* Badge - Properly spaced from navigation bar */}
            <div className="inline-flex items-center space-x-2 bg-barbershop-gold/10 border border-barbershop-gold/20 rounded-full px-2 py-1 sm:px-4 sm:py-2 mb-6 mt-4">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 text-barbershop-gold" />
              <span className="text-barbershop-gold text-xs sm:text-sm font-medium">Premium Haircut Since 2022</span>
            </div>

            {/* Logo */}
            <div className="mb-8">
              <img src="/lovable-uploads/0fe4806d-e81d-4af3-bd38-e731ba73bd3e.png" alt="Swat Barbershop Logo" className="h-48 w-48 md:h-64 md:w-64 mx-auto" />
            </div>

            {/* Main Heading - Updated with EXPERIENCE image - Made smaller on mobile */}
            <div className="mb-6">
              <img src="/lovable-uploads/ae1709a2-f6ae-4079-964f-d4824a149961.png" alt="EXPERIENCE" className="mx-auto max-w-full h-24 sm:h-32 object-scale-down" />
            </div>

            {/* Subheading - Made even smaller on mobile */}
            <p className="text-base text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed md:text-xl">Master barbers. Modern techniques. Premium results.
Elevate your style with our skilled professionals.</p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={() => setIsBookingOpen(true)} className="bg-barbershop-gold hover:bg-barbershop-bronze text-black font-semibold px-8 py-4 text-lg animate-pulse-zoom">
                Book Your Appointment
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-row justify-center items-center gap-2 sm:gap-4 md:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-barbershop-gold/20">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <Star className="h-4 w-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 text-barbershop-gold mr-1 sm:mr-2" />
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">5k+</span>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-400">Happy Clients</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <Award className="h-4 w-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 text-barbershop-gold mr-1 sm:mr-2" />
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">3+</span>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-400">Years Experience</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <Scissors className="h-4 w-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 text-barbershop-gold mr-1 sm:mr-2" />
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">3</span>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-400">Master Barbers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingDialog open={isBookingOpen} onOpenChange={setIsBookingOpen} />
    </>;
};
export default Hero;