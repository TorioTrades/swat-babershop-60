import { format } from 'date-fns';
import { User, Scissors, Calendar, Clock, DollarSign } from 'lucide-react';
import { BookingData } from '../BookingDialog';
import { appointmentStore } from '@/lib/appointmentStore';
import { forwardRef, useImperativeHandle } from 'react';

interface BookingConfirmationProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}

export interface BookingConfirmationRef {
  handleConfirm: () => Promise<void>;
}

const BookingConfirmation = forwardRef<BookingConfirmationRef, BookingConfirmationProps>(
  ({ bookingData, setBookingData, onNext }, ref) => {
    useImperativeHandle(ref, () => ({
      async handleConfirm() {
        // Save appointment to store with duration-based slot blocking
        if (bookingData.barber && bookingData.service && bookingData.date && bookingData.time) {
          console.log('Saving appointment:', {
            barberName: bookingData.barber.name,
            customerName: bookingData.customerInfo.name,
            service: bookingData.service.name,
            date: format(bookingData.date, 'yyyy-MM-dd'),
            time: bookingData.time,
            status: 'pending',
            price: bookingData.service.price + 20,
            duration: bookingData.service.duration,
          });
          
          // Calculate the number of 20-minute slots needed
          const slotsNeeded = Math.ceil(bookingData.service.duration / 20);
          const timeSlots = [
            '9:00 AM', '9:20 AM', '9:40 AM', '10:00 AM', '10:20 AM', '10:40 AM',
            '11:00 AM', '11:20 AM', '11:40 AM', '12:00 PM', '12:20 PM', '12:40 PM',
            '1:00 PM', '1:20 PM', '1:40 PM', '2:00 PM', '2:20 PM', '2:40 PM',
            '3:00 PM', '3:20 PM', '3:40 PM', '4:00 PM', '4:20 PM', '4:40 PM',
            '5:00 PM', '5:20 PM', '5:40 PM', '6:00 PM', '6:20 PM', '6:40 PM', '7:00 PM'
          ];
          
          // Find the starting slot index
          const startIndex = timeSlots.indexOf(bookingData.time);
          
          // Create appointment entries for all required slots
          const appointmentPromises = [];
          for (let i = 0; i < slotsNeeded && (startIndex + i) < timeSlots.length; i++) {
            const slotTime = timeSlots[startIndex + i];
            const isMainAppointment = i === 0;
            
            appointmentPromises.push(
              appointmentStore.addAppointment({
                barberName: bookingData.barber.name,
                customerName: bookingData.customerInfo.name,
                customerPhone: bookingData.customerInfo.phone,
                customerEmail: bookingData.customerInfo.email,
                service: isMainAppointment 
                  ? bookingData.service.name 
                  : `${bookingData.service.name} (Duration Block)`,
                date: format(bookingData.date, 'yyyy-MM-dd'),
                time: slotTime,
                status: 'pending',
                price: isMainAppointment ? bookingData.service.price + 20 : 0,
              })
            );
          }
          
          try {
            const results = await Promise.all(appointmentPromises);
            console.log('All appointment slots saved:', results);
            
            if (results.every(result => result !== null)) {
              // Get the booking ID from the first main appointment
              const mainAppointment = results.find(result => result !== null);
              if (mainAppointment) {
                setBookingData({
                  ...bookingData,
                  bookingId: mainAppointment.id
                });
              }
              onNext();
            } else {
              console.error('Some appointment slots failed to save');
            }
          } catch (error) {
            console.error('Error saving appointment slots:', error);
          }
        }
      }
    }));

    return (
      <div className="space-y-4">
        <p className="text-gray-300 text-center text-xs md:text-sm">
          Please review your booking details before confirming
        </p>

        <div className="bg-barbershop-black/50 rounded-lg p-1.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {/* Barber Info */}
            <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-barbershop-charcoal/50 rounded-lg">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-barbershop-gold">
                <img
                  src={bookingData.barber?.image}
                  alt={bookingData.barber?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <User className="h-2.5 w-2.5 md:h-3 md:w-3 text-barbershop-gold" />
                  <span className="text-white font-medium text-xs md:text-sm">Your Barber</span>
                </div>
                <p className="text-barbershop-gold text-xs md:text-sm">
                  {bookingData.barber?.name}
                </p>
              </div>
            </div>

            {/* Service Info */}
            <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-barbershop-charcoal/50 rounded-lg">
              <Scissors className="h-4 w-4 md:h-5 md:w-5 text-barbershop-gold" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-xs md:text-sm">Service</p>
                    <p className="text-barbershop-gold text-xs md:text-sm">
                      {bookingData.service?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-barbershop-gold font-bold text-xs md:text-sm">
                        ₱{bookingData.service?.price}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 md:space-x-2 mt-1">
                      <Clock className="h-2.5 w-2.5 md:h-3 md:w-3 text-gray-400" />
                      <span className="text-gray-400 text-xs">
                        {bookingData.service?.duration} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time Info */}
            <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-barbershop-charcoal/50 rounded-lg">
              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-barbershop-gold" />
              <div className="flex-1">
                <p className="text-white font-medium text-xs md:text-sm">Date & Time</p>
                <p className="text-barbershop-gold text-xs md:text-sm">
                  {bookingData.date && format(bookingData.date, 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-barbershop-gold text-xs md:text-sm">
                  {bookingData.time}
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-barbershop-charcoal/50 rounded-lg">
              <User className="h-4 w-4 md:h-5 md:w-5 text-barbershop-gold" />
              <div className="flex-1">
                <p className="text-white font-medium text-xs md:text-sm">Customer Information</p>
                <p className="text-barbershop-gold text-xs md:text-sm">
                  {bookingData.customerInfo.name}
                </p>
                <p className="text-gray-400 text-xs">
                  {bookingData.customerInfo.phone}
                </p>
                <p className="text-gray-400 text-xs">
                  {bookingData.customerInfo.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-barbershop-gold/10 border border-barbershop-gold/30 rounded-lg p-2 md:p-3">
          <h3 className="text-barbershop-gold font-medium mb-2 text-xs md:text-sm">Booking Summary</h3>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs md:text-sm">Service Price:</span>
              <span className="text-white text-xs md:text-sm">₱{bookingData.service?.price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs md:text-sm">Priority Fee:</span>
              <span className="text-white text-xs md:text-sm">₱20</span>
            </div>
            <hr className="border-barbershop-gold/30" />
            <div className="flex justify-between items-center">
              <span className="text-white font-medium text-xs md:text-sm">Total Amount:</span>
              <span className="text-barbershop-gold font-bold text-sm md:text-lg">
                ₱{(bookingData.service?.price || 0) + 20}
              </span>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            • Priority fee ensures faster service for online bookings<br />
            • Payment will be collected at the barbershop
          </p>
        </div>
      </div>
    );
  }
);

BookingConfirmation.displayName = 'BookingConfirmation';

export default BookingConfirmation;