
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors, Zap, Sparkles, Crown, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import BookingDialog from './BookingDialog';

const Services = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  
  const services = [
  {
    icon: <Scissors className="h-6 w-6" />,
    title: "Sharp & Styled",
    description: "Modern / Classic Haircut",
    price: "₱149",
    duration: "45 min",
    image: "/lovable-uploads/7aee0ed7-6dba-4bc2-b815-74c6900bc1cd.png"
  }, {
    icon: <Zap className="h-6 w-6" />,
    title: "Clean Cut Duo",
    description: "Haircut + Shave",
    price: "₱180",
    duration: "60 min",
    image: "/lovable-uploads/2fb267ab-5d5f-455d-b2d1-29f551649058.png"
  }, {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Korean Perms",
    description: "Light Perm, Medium Perm, Afro Perm",
    price: "₱850 - ₱1,100",
    duration: "2-3 hours",
    image: "/lovable-uploads/02cc930e-d4a6-46f7-996f-8df9ff708feb.png"
  }, {
    icon: <Crown className="h-6 w-6" />,
    title: "SWAT Signature Edge",
    description: "Haircut + Hair Art",
    price: "₱200",
    duration: "90 min",
    image: "/lovable-uploads/2b8fde17-5e2e-4ad1-acb6-7f5b748372ec.png"
  }, {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Little Trooper",
    description: "Kids Classic / Modern Haircuts",
    price: "₱170",
    duration: "30 min",
    image: "/lovable-uploads/1435280c-843e-42e9-9ee3-290621dd7673.png"
  }];

  return (
    <section id="services" className="py-12 bg-barbershop-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-sans">SERVICES</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base">Elevate your style, elevate your life. Where modern men come to look their finest.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <Card key={service.title} className="bg-barbershop-black border-barbershop-gold/20 hover:border-barbershop-gold/40 transition-all duration-300 hover-scale group overflow-hidden h-full">
              {service.image ? (
                <div className="relative h-80 w-full overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover absolute inset-0" />
                  <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-4">
                    <div className="text-center">
                      <CardTitle className="text-white text-lg font-serif group-hover:text-barbershop-gold transition-colors">
                        {service.title}
                      </CardTitle>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-300 mb-1 leading-relaxed text-sm">
                        {service.description}
                      </p>
                      <div className="mb-0.5">
                        <span className="text-gray-400 text-xs">Duration: {service.duration}</span>
                      </div>
                      <div className="mb-1">
                        <span className="text-barbershop-gold font-semibold text-base">{service.price}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-barbershop-gold bg-barbershop-gold/20 text-barbershop-gold hover:bg-barbershop-gold hover:text-black backdrop-blur-sm font-bold" 
                        style={{ fontFamily: 'Arial, sans-serif' }}
                        onClick={() => setBookingOpen(true)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-80 flex flex-col">
                  <CardHeader className="text-center pb-1 flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-barbershop-gold/10 rounded-full mb-1 mx-auto group-hover:bg-barbershop-gold/20 transition-colors">
                      <div className="text-barbershop-gold">
                        {service.icon}
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg font-serif group-hover:text-barbershop-gold transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center flex-1 flex flex-col justify-between">
                    <p className="text-gray-400 mb-1 leading-relaxed text-sm">
                      {service.description}
                    </p>
                    <div className="mt-auto">
                      <div className="mb-0.5">
                        <span className="text-gray-500 text-xs">Duration: {service.duration}</span>
                      </div>
                      <div className="mb-1">
                        <span className="text-barbershop-gold font-semibold text-base">{service.price}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-barbershop-gold bg-barbershop-gold/20 text-barbershop-gold hover:bg-barbershop-gold hover:text-black backdrop-blur-sm font-bold" 
                        style={{ fontFamily: 'Arial, sans-serif' }}
                        onClick={() => setBookingOpen(true)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
      
      <BookingDialog 
        open={bookingOpen} 
        onOpenChange={setBookingOpen} 
      />
    </section>
  );
};

export default Services;
