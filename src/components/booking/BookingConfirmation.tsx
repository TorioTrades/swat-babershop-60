
import { forwardRef, useImperativeHandle } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Scissors, DollarSign, Phone, Mail } from 'lucide-react';
import { BookingData } from '../BookingDialog';
import { appointmentStore } from '@/lib/appointmentStore';
import { toast } from 'sonner';

interface BookingConfirmationProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}

const BookingConfirmation = forwardRef<{ handleConfirm: () => Promise<void> }, BookingConfirmationProps>(
  ({ bookingData, setBookingData, onNext }, ref) => {
    const generateTimeSlots = (startTime: string, duration: number) => {
      console.log('Generating time slots for:', { startTime, duration });
      
      if (duration <= 20) {
        console.log('Single slot for duration <= 20 minutes');
        return [startTime];
      }

      const slots = [];
      const [timeStr, period] = startTime.split(' ');
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) {
        hour24 = hours + 12;
      } else if (period === 'AM' && hours === 12) {
        hour24 = 0;
      }

      let currentHour = hour24;
      let currentMinute = minutes;
      
      const numberOfSlots = Math.ceil(duration / 20);
      console.log('Number of slots needed:', numberOfSlots);

      for (let i = 0; i < numberOfSlots; i++) {
        let displayHour = currentHour;
        let displayPeriod = 'AM';
        
        if (displayHour >= 12) {
          displayPeriod = 'PM';
          if (displayHour > 12) {
            displayHour = displayHour - 12;
          }
        } else if (displayHour === 0) {
          displayHour = 12;
        }

        const timeSlot = `${displayHour}:${currentMinute.toString().padStart(2, '0')} ${displayPeriod}`;
        slots.push(timeSlot);
        console.log(`Generated slot ${i + 1}:`, timeSlot);

        // Add 20 minutes for next slot
        currentMinute += 20;
        if (currentMinute >= 60) {
          currentHour += 1;
          currentMinute -= 60;
        }
      }

      return slots;
    };

    const handleConfirm = async () => {
      if (!bookingData.barber || !bookingData.service || !bookingData.date || !bookingData.time) {
        toast.error('Missing booking information');
        return;
      }

      try {
        console.log('Creating appointment with booking data:', bookingData);
        
        const timeSlots = generateTimeSlots(bookingData.time, bookingData.service.duration);
        console.log('Time slots to book:', timeSlots);

        const appointmentPromises = timeSlots.map(async (timeSlot, index) => {
          const serviceName = timeSlots.length > 1 && index > 0 
            ? `${bookingData.service!.name} (Duration Block ${index + 1} of ${timeSlots.length})`
            : bookingData.service!.name;

          const appointmentData = {
            barberName: bookingData.barber!.name,
            customerName: bookingData.customerInfo.name,
            customerPhone: bookingData.customerInfo.phone,
            customerEmail: bookingData.customerInfo.email,
            service: serviceName,
            date: format(bookingData.date!, 'yyyy-MM-dd'),
            time: timeSlot, // Make sure this is the actual time string, not undefined
            status: 'pending' as const,
            price: index === 0 ? bookingData.service!.price + 20 : 0, // Only first slot has price + priority fee
          };

          console.log('Saving appointment:', appointmentData);
          return await appointmentStore.addAppointment(appointmentData);
        });

        const results = await Promise.all(appointmentPromises);
        console.log('All appointment slots saved:', results);

        const hasFailedSlots = results.some(result => result === null);
        if (hasFailedSlots) {
          console.error('Some appointment slots failed to save');
          toast.error('Failed to create some appointment slots. Please try again.');
          return;
        }

        // Use the first successful appointment's ID as the main booking ID
        const mainAppointment = results[0];
        if (mainAppointment) {
          setBookingData({
            ...bookingData,
            bookingId: mainAppointment.id,
          });
          
          toast.success('Appointment booked successfully!');
          onNext();
        } else {
          toast.error('Failed to create appointment. Please try again.');
        }
      } catch (error) {
        console.error('Error confirming booking:', error);
        toast.error('Failed to create appointment. Please try again.');
      }
    };

    useImperativeHandle(ref, () => ({
      handleConfirm,
    }));

    const totalPrice = bookingData.service ? bookingData.service.price + 20 : 0; // Include priority fee

    return (
      <div className="space-y-6">
        {/* Booking Summary */}
        <Card className="bg-barbershop-black/50 border-barbershop-gold/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-barbershop-gold mb-4">Booking Summary</h3>
            
            <div className="space-y-4">
              {/* Barber */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-barbershop-gold/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-barbershop-gold" />
                </div>
                <div>
                  <p className="text-white font-medium">{bookingData.barber?.name}</p>
                  <p className="text-gray-400 text-sm">Professional Barber</p>
                </div>
              </div>

              {/* Service */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-barbershop-gold/20 flex items-center justify-center">
                  <Scissors className="h-5 w-5 text-barbershop-gold" />
                </div>
                <div>
                  <p className="text-white font-medium">{bookingData.service?.name}</p>
                  <p className="text-gray-400 text-sm">{bookingData.service?.duration} minutes</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-barbershop-gold/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-barbershop-gold" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {bookingData.date && format(bookingData.date, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <p className="text-gray-400 text-sm">{bookingData.time}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2 pt-2 border-t border-barbershop-gold/20">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-barbershop-gold" />
                  <p className="text-white">{bookingData.customerInfo.name}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-barbershop-gold" />
                  <p className="text-white">{bookingData.customerInfo.phone}</p>
                </div>
                {bookingData.customerInfo.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-barbershop-gold" />
                    <p className="text-white">{bookingData.customerInfo.email}</p>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between pt-4 border-t border-barbershop-gold/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-barbershop-gold/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-barbershop-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Total Amount</p>
                    <p className="text-gray-400 text-sm">Including ₱20 priority fee</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-barbershop-gold">₱{totalPrice}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="bg-barbershop-black/30 border-barbershop-gold/10">
          <CardContent className="p-6">
            <h4 className="text-barbershop-gold font-medium mb-3">Important Notes:</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Please arrive 5 minutes before your appointment time</li>
              <li>• Show this booking confirmation to our staff upon arrival</li>
              <li>• Payment can be made at the shop after service completion</li>
              <li>• The ₱20 priority fee ensures your slot is reserved</li>
              <li>• Cancellations must be made at least 2 hours in advance</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }
);

BookingConfirmation.displayName = 'BookingConfirmation';

export default BookingConfirmation;
