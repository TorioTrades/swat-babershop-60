import { format } from 'date-fns';
import { CheckCircle, MapPin, Phone, Clock, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { BookingData } from '../BookingDialog';
interface BookingSuccessProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}
const BookingSuccess = ({
  bookingData,
  onClose
}: BookingSuccessProps) => {
  const { toast } = useToast();
  const bookingId = bookingData.bookingId || 'CLNT-1';

  const downloadBookingConfirmation = async () => {
    try {
      // Create a temporary element with the booking confirmation
      const element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.background = 'white';
      element.style.padding = '40px';
      element.style.width = '600px';
      element.style.fontFamily = 'Arial, sans-serif';
      
      element.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000000; font-size: 32px; margin: 0; font-weight: bold;">Booking Confirmed!</h1>
          <p style="color: #000000; margin: 10px 0 0 0; font-size: 16px;">Your appointment has been successfully booked</p>
        </div>
        
        <div style="border: 3px solid #000000; border-radius: 15px; padding: 40px; background: linear-gradient(135deg, #fafafa, #f5f5f5);">
          <div style="display: grid; gap: 25px;">
            <div style="text-align: center; border-bottom: 2px solid #000000; padding-bottom: 20px;">
              <h2 style="color: #000000; margin: 0 0 10px 0; font-size: 20px;">Booking ID</h2>
              <p style="font-family: monospace; font-size: 18px; font-weight: bold; color: #000000; background: #f9f9f9; padding: 10px; border-radius: 5px;">${bookingId}</p>
            </div>
            
            <div style="border-bottom: 1px solid #eee; padding-bottom: 20px;">
              <h3 style="color: #000000; margin: 0 0 15px 0; font-size: 18px;">Customer Information</h3>
              <p style="margin: 8px 0; font-size: 16px; color: #000000;"><strong>Name:</strong> ${bookingData.customerInfo.name}</p>
              <p style="margin: 8px 0; font-size: 16px; color: #000000;"><strong>Phone:</strong> ${bookingData.customerInfo.phone}</p>
              <p style="margin: 8px 0; font-size: 16px; color: #000000;"><strong>Email:</strong> ${bookingData.customerInfo.email}</p>
            </div>
            
            <div style="border-bottom: 1px solid #eee; padding-bottom: 20px;">
              <h3 style="color: #000000; margin: 0 0 15px 0; font-size: 18px;">Appointment Details</h3>
              <p style="margin: 8px 0; font-size: 16px; color: #000000;"><strong>Date:</strong> ${bookingData.date ? format(bookingData.date, 'MMMM d, yyyy') : 'N/A'}</p>
              <p style="margin: 8px 0; font-size: 16px; color: #000000;"><strong>Time:</strong> ${bookingData.time || 'N/A'}</p>
              <p style="margin: 8px 0; font-size: 16px; color: #000000;"><strong>Barber:</strong> ${bookingData.barber?.name || 'N/A'}</p>
            </div>
            
            <div>
              <h3 style="color: #000000; margin: 0 0 15px 0; font-size: 18px;">Service Information</h3>
              <p style="margin: 8px 0; font-size: 16px; color: #000000;"><strong>Service:</strong> ${bookingData.service?.name || 'N/A'}</p>
              <p style="margin: 8px 0; font-size: 16px; color: #000000;"><strong>Duration:</strong> ${bookingData.service?.duration || 'N/A'} minutes</p>
              <p style="margin: 8px 0; font-size: 16px; color: #000000;"><strong>Price:</strong> ₱${bookingData.service?.price || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f8f8; border-radius: 10px;">
          <h3 style="color: #000000; margin: 0 0 15px 0;">Important Reminders</h3>
          <ul style="list-style: none; padding: 0; margin: 0; text-align: left; max-width: 400px; margin: 0 auto;">
            <li style="margin: 8px 0; font-size: 14px; color: #000000;">• Please arrive 10 minutes before your appointment time</li>
            <li style="margin: 8px 0; font-size: 14px; color: #000000;">• Payment is due at the time of service</li>
            <li style="margin: 8px 0; font-size: 14px; color: #000000;">• Late arrivals may result in shortened service time</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #000000; font-size: 12px;">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      `;
      
      document.body.appendChild(element);
      
      // Generate the canvas
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      // Remove the temporary element
      document.body.removeChild(element);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `booking-confirmation-${bookingData.customerInfo.name.replace(/\s+/g, '-')}-${bookingId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Download Complete",
        description: "Booking confirmation has been downloaded",
      });
    } catch (error) {
      console.error('Error downloading booking confirmation:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download booking confirmation",
        variant: "destructive",
      });
    }
  };
  return <div className="text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>

      {/* Success Message */}
      <div>
        <h2 className="text-lg font-serif text-barbershop-gold mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-sm text-gray-300">
          Your appointment has been successfully booked
        </p>
        <p className="text-barbershop-gold font-mono text-xs mt-2">
          Booking ID: {bookingId}
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-barbershop-gold/10 border border-barbershop-gold/30 rounded-lg p-4 space-y-3 text-left">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-barbershop-gold/80 text-xs font-medium">Barber</p>
            <p className="text-barbershop-gold font-semibold text-sm">{bookingData.barber?.name}</p>
          </div>
          <div>
            <p className="text-barbershop-gold/80 text-xs font-medium">Service</p>
            <p className="text-barbershop-gold font-semibold text-sm">{bookingData.service?.name}</p>
          </div>
          <div>
            <p className="text-barbershop-gold/80 text-xs font-medium">Date</p>
            <p className="text-barbershop-gold font-semibold text-sm">
              {bookingData.date && format(bookingData.date, 'MMMM d, yyyy')}
            </p>
          </div>
          <div>
            <p className="text-barbershop-gold/80 text-xs font-medium">Time</p>
            <p className="text-barbershop-gold font-semibold text-sm">{bookingData.time}</p>
          </div>
        </div>
        
        {/* Customer Information */}
        <div className="border-t border-barbershop-gold/20 pt-3 mt-3">
          <p className="text-barbershop-gold/80 text-xs font-medium mb-2">Customer Information</p>
          <div className="space-y-1">
            <p className="text-barbershop-gold text-sm"><span className="text-barbershop-gold/80">Name:</span> {bookingData.customerInfo.name}</p>
            <p className="text-barbershop-gold text-sm"><span className="text-barbershop-gold/80">Phone:</span> {bookingData.customerInfo.phone}</p>
            <p className="text-barbershop-gold text-sm"><span className="text-barbershop-gold/80">Email:</span> {bookingData.customerInfo.email}</p>
          </div>
        </div>
      </div>

      {/* Important Reminders */}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-left">
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <h3 className="text-orange-500 font-semibold text-sm">Important Reminders</h3>
        </div>
        <ul className="space-y-1 text-xs text-gray-300">
          <li className="flex items-start space-x-2">
            <span className="text-orange-500 mt-1">•</span>
            <span>Please arrive 10 minutes before your appointment time</span>
          </li>
          
          <li className="flex items-start space-x-2">
            <span className="text-orange-500 mt-1">•</span>
            <span>Payment is due at the time of service</span>
          </li>
          
          <li className="flex items-start space-x-2">
            <span className="text-orange-500 mt-1">•</span>
            <span>Late arrivals may result in shortened service time</span>
          </li>
        </ul>
      </div>

      {/* Contact Information */}
      

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={downloadBookingConfirmation}
          variant="outline"
          className="w-full border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold hover:text-black"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Confirmation
        </Button>
        
        <Button onClick={onClose} className="w-full bg-barbershop-gold hover:bg-barbershop-bronze text-black font-semibold">
          Close
        </Button>
      </div>
    </div>;
};
export default BookingSuccess;