
import { useState, useEffect } from 'react';
import { format, addDays, startOfToday, isToday, parse, isBefore } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { BookingData } from '../BookingDialog';
import { appointmentStore } from '@/lib/appointmentStore';
import { unavailabilityStore } from '@/lib/unavailabilityStore';

interface DateTimeSelectionProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}

const timeSlots = [
  '9:00 AM', '9:20 AM', '9:40 AM', '10:00 AM', '10:20 AM', '10:40 AM',
  '11:00 AM', '11:20 AM', '11:40 AM', '12:00 PM', '12:20 PM', '12:40 PM',
  '1:00 PM', '1:20 PM', '1:40 PM', '2:00 PM', '2:20 PM', '2:40 PM',
  '3:00 PM', '3:20 PM', '3:40 PM', '4:00 PM', '4:20 PM', '4:40 PM',
  '5:00 PM', '5:20 PM', '5:40 PM', '6:00 PM', '6:20 PM', '6:40 PM', 
  '7:00 PM', '7:20 PM', '7:40 PM', '8:00 PM', '8:20 PM', '8:40 PM', '9:00 PM'
];

const DateTimeSelection = ({ bookingData, setBookingData }: DateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(bookingData.date || undefined);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);
  const [isFullDayUnavailable, setIsFullDayUnavailable] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch booked appointments and unavailable slots
  const fetchBookedTimes = async () => {
    if (!selectedDate || !bookingData.barber) return;
    
    setLoading(true);
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      
      // Fetch booked appointments
      const appointments = await appointmentStore.getAppointmentsByBarber(bookingData.barber.name);
      const bookedForDate = appointments
        .filter(apt => apt.date === dateString && apt.status !== 'cancelled')
        .map(apt => apt.time);
      
      // Fetch unavailable slots
      const unavailableSlots = await unavailabilityStore.getUnavailableSlotsForDate(
        bookingData.barber.name, 
        dateString
      );
      
      // Check if the whole day is unavailable
      const fullDayUnavailable = unavailableSlots.some(slot => slot.isFullDay);
      setIsFullDayUnavailable(fullDayUnavailable);
      
      // Get specific unavailable times
      const unavailableTimesForDate = unavailableSlots
        .filter(slot => !slot.isFullDay && slot.time)
        .map(slot => slot.time!);
      
      setBookedTimes(bookedForDate);
      setUnavailableTimes(unavailableTimesForDate);
    } catch (error) {
      console.error('Error fetching booked times and unavailable slots:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch booked appointments when date or barber changes
  useEffect(() => {
    fetchBookedTimes();
  }, [selectedDate, bookingData.barber]);


  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setBookingData({
        ...bookingData,
        date,
        time: null, // Reset time when date changes
      });
    }
  };

  const handleTimeSelect = (time: string) => {
    // Prevent selection of booked times, unavailable times, or past times
    const isBooked = isTimeBooked(time);
    const isUnavailable = isTimeUnavailable(time);
    const isPast = isTimePassed(time);
    const isFullDay = isFullDayUnavailable;
    const hasConflict = checkDurationConflict(time);
    
    if (isBooked || isUnavailable || isPast || isFullDay || hasConflict) {
      return;
    }
    
    setBookingData({
      ...bookingData,
      time,
    });
  };

  // Check if the selected time slot has enough consecutive available slots for the service duration
  const checkDurationConflict = (selectedTime: string) => {
    if (!bookingData.service) return false;
    
    // No duration conflicts - each time slot is independent
    return false;
  };

  const isTimeBooked = (time: string) => bookedTimes.includes(time);
  const isTimeUnavailable = (time: string) => unavailableTimes.includes(time);
  
  const isTimePassed = (time: string) => {
    if (!selectedDate || !isToday(selectedDate)) return false;
    
    try {
      // Parse the time string (e.g., "2:00 PM") with today's date
      const timeDate = parse(time, 'h:mm a', new Date());
      const now = new Date();
      
      // Set the parsed time to today's date for comparison
      const todayTime = new Date();
      todayTime.setHours(timeDate.getHours(), timeDate.getMinutes(), 0, 0);
      
      return isBefore(todayTime, now);
    } catch (error) {
      console.error('Error parsing time:', error);
      return false;
    }
  };


  const today = startOfToday();
  const maxDate = addDays(today, 15);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Calendar Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <span className="w-6 h-6 rounded-full bg-barbershop-gold text-black text-sm flex items-center justify-center mr-2">
              1
            </span>
            Select Date
          </h3>
        </div>
        
        <div className="bg-barbershop-black/50 p-4 rounded-lg">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < today || date > maxDate}
            className="rounded-md border-0 pointer-events-auto"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center text-barbershop-gold",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-barbershop-gold hover:bg-barbershop-gold/20",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-barbershop-gold rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative text-white",
              day: "h-9 w-9 p-0 font-normal rounded-md",
              day_selected: "bg-barbershop-gold text-black hover:bg-barbershop-gold hover:text-black",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-gray-600 opacity-50",
              day_disabled: "text-gray-600 opacity-50",
            }}
          />
        </div>
        
        <div className="text-sm text-gray-400 space-y-1">
          <p>• Available appointments up to 15 days in advance</p>
          <p>• Select a date to view available time slots</p>
        </div>
      </div>

      {/* Time Slots Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <span className="w-6 h-6 rounded-full bg-barbershop-gold text-black text-sm flex items-center justify-center mr-2">
              2
            </span>
            Available Time
          </h3>
          <div className="flex items-center space-x-3">
            {selectedDate && (
              <span className="text-barbershop-gold text-sm">
                {format(selectedDate, 'EEEE, MMMM d')}
              </span>
            )}
            {selectedDate && bookingData.barber && (
              <Button
                onClick={fetchBookedTimes}
                disabled={loading}
                size="sm"
                variant="outline"
                className="border-barbershop-gold/50 text-barbershop-gold hover:bg-barbershop-gold/10"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>

         {selectedDate ? (
           <div className="max-h-96 overflow-y-auto space-y-2">
             {loading ? (
               <div className="flex items-center justify-center h-40">
                 <p className="text-gray-400">Loading available times...</p>
               </div>
             ) : isFullDayUnavailable ? (
               <div className="flex items-center justify-center h-40 border-2 border-dashed border-red-500 rounded-lg">
                 <p className="text-red-400">This day is unavailable for appointments</p>
               </div>
             ) : (
                  <div className="grid grid-cols-2 gap-3">
                     {timeSlots.map((time) => {
                       const isBooked = isTimeBooked(time);
                       const isBarberUnavailable = isTimeUnavailable(time);
                       const isPast = isTimePassed(time);
                       const hasDurationConflict = checkDurationConflict(time);
                       const isUnavailable = isBooked || isBarberUnavailable || isPast || hasDurationConflict;
                       const isSelected = bookingData.time === time;
                       
                       // Debug logging to help identify why slots are unavailable
                       if (isUnavailable && !isBooked) {
                         console.log(`Time ${time} is unavailable:`, {
                           isBooked,
                           isBarberUnavailable,
                           isPast,
                           hasDurationConflict,
                           isFullDayUnavailable,
                           selectedDate: selectedDate?.toISOString(),
                           currentTime: new Date().toISOString()
                         });
                       }
                      
                      return (
                         <button
                           key={time}
                           onClick={() => handleTimeSelect(time)}
                           disabled={isUnavailable}
                            className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center ${
                              isUnavailable
                                ? isBarberUnavailable
                                  ? 'border-red-500 bg-red-500/10 text-red-400 cursor-not-allowed'
                                  : 'border-gray-500 text-gray-500 cursor-not-allowed'
                                : isSelected
                                ? 'border-barbershop-gold bg-barbershop-gold text-black'
                                : 'border-gray-600 text-white hover:border-barbershop-gold/50'
                            }`}
                         >
                           <span className="font-medium">{time}</span>
                           {isBooked && (
                             <span className="text-xs opacity-70 ml-1">(Booked)</span>
                           )}
                           {isBarberUnavailable && (
                             <span className="text-xs opacity-70 ml-1">(Unavailable)</span>
                           )}
                         </button>
                      );
                    })}
                 </div>
             )}
           </div>
        ) : (
          <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-600 rounded-lg">
            <p className="text-gray-400">Please select a date first</p>
          </div>
        )}

        <div className="text-sm text-gray-400 space-y-1">
          <p>• Each appointment will be done not less than 20 minutes</p>
          <p>• Shop hours: 9:00 AM - 9:00 PM (Mon-Sun)</p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-barbershop-gold"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Unavailable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelection;
