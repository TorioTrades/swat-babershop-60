import { BookingData } from '../BookingDialog';

interface BarberSelectionProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}

const barbers = [{
  id: '1',
  name: 'Kean',
  image: '/lovable-uploads/2a38f175-44b4-4f55-b321-b5ec3ee92bdf.png',
  specialties: ['Classic Cuts', 'Beard Styling', 'Hot Towel Shave'],
  experience: 'Expert',
  expertise: 'Classic cuts & hot towel shaves'
}, {
  id: '2',
  name: 'Pao',
  image: '/lovable-uploads/2a38f175-44b4-4f55-b321-b5ec3ee92bdf.png',
  specialties: ['Modern Styles', 'Fade Cuts', 'Hair Washing'],
  experience: 'Skilled',
  expertise: 'Modern styles & precision fades'
}, {
  id: '3',
  name: 'Gelo',
  image: '/lovable-uploads/2a38f175-44b4-4f55-b321-b5ec3ee92bdf.png',
  specialties: ['Traditional Cuts', 'Mustache Grooming', 'Scalp Treatment'],
  experience: 'Skilled',
  expertise: 'Traditional cuts & scalp treatments'
}];

const BarberSelection = ({
  bookingData,
  setBookingData,
  onNext
}: BarberSelectionProps) => {
  const handleBarberSelect = (barber: typeof barbers[0]) => {
    setBookingData({
      ...bookingData,
      barber: {
        id: barber.id,
        name: barber.name,
        image: barber.image
      }
    });
    onNext();
  };
  return <div className="space-y-6">
      <p className="text-gray-300 text-center">
        Choose your preferred barber for your appointment
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {barbers.map(barber => <div key={barber.id} onClick={() => handleBarberSelect(barber)} className={`p-4 md:p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${bookingData.barber?.id === barber.id ? 'border-barbershop-gold bg-barbershop-gold/10' : 'border-gray-600 hover:border-barbershop-gold/50'}`}>
            <div className="flex md:flex-col md:text-center items-center md:items-center gap-4 md:gap-0">
              <div className="w-24 h-24 md:w-40 md:h-40 md:mx-auto md:mb-4 rounded-full overflow-hidden border-2 border-barbershop-gold flex-shrink-0">
                <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 md:flex-none">
                <h3 className="text-lg md:text-xl font-serif text-white mb-1 md:mb-2">
                  {barber.name}
                </h3>
                
                <p className="text-barbershop-gold text-sm mb-2">
                  {barber.experience}
                </p>
                
                <p className="text-gray-300 text-xs leading-relaxed">
                  {barber.expertise}
                </p>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};

export default BarberSelection;
