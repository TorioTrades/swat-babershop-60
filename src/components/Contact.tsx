import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Clock, Mail, Calendar } from 'lucide-react';
import BookingDialog from './BookingDialog';

const Contact = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleMapClick = () => {
    // Open Google Maps directions to Swat Barbershop - Angeles Branch
    window.open('https://www.google.com/maps/dir//Swat+Barbershop+-Angeles+Branch/@15.15314522703422,120.59130502259913,17z', '_blank');
  };

  const handleBookingClick = () => {
    setIsBookingOpen(true);
  };

  return (
    <>
      <section id="contact" className="bg-barbershop-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Visit Our Shop
            </h2>
            <p className="text-base text-gray-300 max-w-2xl mx-auto">
              Ready to experience the Elite difference? Book your appointment today or stop by our shop 
              in the heart of downtown.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            {/* Left Column - Contact Information */}
            <div className="lg:col-span-2 space-y-4">
              {/* Location */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-barbershop-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="h-3 w-3 text-barbershop-gold" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">Location</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    202 Don Pepe St., Maingate<br />
                    Marisol Village<br />
                    (Infront of fresh options)
                  </p>
                </div>
              </div>

              {/* Shop Hours */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-barbershop-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="h-3 w-3 text-barbershop-gold" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">Shop Hours</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Monday to Sunday: 9:00 AM - 7:00 PM
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-barbershop-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="h-3 w-3 text-barbershop-gold" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">Contact</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Phone: <a href="tel:09555672389" className="hover:text-barbershop-gold transition-colors">09555672389</a><br />
                    Email: <a href="mailto:swatbarbershop22@gmail.com" className="hover:text-barbershop-gold transition-colors">swatbarbershop22@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Google Maps - Wider on desktop */}
            <div className="lg:col-span-3">
              <Card className="bg-barbershop-black border-barbershop-gold/20 overflow-hidden">
                <div className="w-full h-[300px] relative cursor-pointer group" onClick={handleMapClick}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d963.6951293659436!2d120.59130502259913!3d15.15314522703422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f3848a06ec2d%3A0xc40227f13e1f1a15!2sSwat%20Barbershop%20-Angeles%20Branch!5e0!3m2!1sen!2sph!4v1752142342646!5m2!1sen!2sph" width="100%" height="100%" style={{
                    border: 0
                  }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="rounded-lg transition-opacity group-hover:opacity-90"></iframe>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg pointer-events-none"></div>
                  <div className="absolute bottom-3 left-3 bg-barbershop-gold text-black px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Click for directions
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Ready to Schedule Your Visit Section - Full Width */}
        <div className="w-full">
          <div className="bg-gradient-to-r from-barbershop-gold to-barbershop-bronze py-3 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-xl md:text-2xl font-bold text-black mb-2">Quick Booking</h3>
              <p className="text-sm text-black/80 mb-4 max-w-xl mx-auto">Take the first step towards a fresh new look and premium haircut experience today.</p>
              <Button onClick={handleBookingClick} className="bg-barbershop-black hover:bg-barbershop-charcoal text-barbershop-gold font-semibold text-sm px-5 py-2 h-auto border-2 border-barbershop-black hover:border-barbershop-charcoal transition-all duration-300">
                <Calendar className="h-3 w-3 mr-2" />
                Book Now - It's Easy!
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BookingDialog 
        open={isBookingOpen} 
        onOpenChange={setIsBookingOpen} 
      />
    </>
  );
};

export default Contact;
