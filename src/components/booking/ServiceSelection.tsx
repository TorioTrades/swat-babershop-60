
import { useState } from 'react';
import { BookingData } from '../BookingDialog';

interface ServiceSelectionProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}

const services = [
  {
    id: '1',
    name: 'Sharp & Styled',
    price: 149,
    duration: 20,
    description: 'Modern / Classic Haircut'
  },
  {
    id: '2',
    name: 'Clean Cut Duo',
    price: 180,
    duration: 30,
    description: 'Haircut + Shave'
  },
  {
    id: '3',
    name: 'Korean Perms',
    price: 1100,
    duration: 120,
    description: 'Light Perm, Medium Perm, Afro Perm'
  },
  {
    id: '4',
    name: 'SWAT Signature Edge',
    price: 200,
    duration: 30,
    description: 'Haircut + Hair Art'
  },
  {
    id: '5',
    name: 'Little Trooper',
    price: 170,
    duration: 20,
    description: 'Kids Classic / Modern Haircuts'
  }
];

const koreanPermOptions = [
  { id: '3a', name: 'Light Perm', price: 850, duration: 120 },
  { id: '3b', name: 'Medium Perm', price: 950, duration: 120 },
  { id: '3c', name: 'Afro Perm', price: 1100, duration: 120 }
];

const ServiceSelection = ({ bookingData, setBookingData, onNext }: ServiceSelectionProps) => {
  const [showKoreanPermOptions, setShowKoreanPermOptions] = useState(false);

  const handleServiceSelect = (service: typeof services[0]) => {
    if (service.id === '3') {
      setShowKoreanPermOptions(true);
      return;
    }
    
    setBookingData({
      ...bookingData,
      service: {
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
      },
    });
    onNext();
  };

  const handleKoreanPermSelect = (permOption: typeof koreanPermOptions[0]) => {
    setBookingData({
      ...bookingData,
      service: {
        id: permOption.id,
        name: `Korean Perms - ${permOption.name}`,
        price: permOption.price,
        duration: permOption.duration,
      },
    });
    // Directly proceed to Date & Time selection
    onNext();
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-300 text-center">
        {showKoreanPermOptions ? 'Choose your Korean Perm type' : 'Select the service you would like to book'}
      </p>
      
      {showKoreanPermOptions ? (
        <div className="space-y-4">
          <button
            onClick={() => setShowKoreanPermOptions(false)}
            className="text-barbershop-gold hover:text-white transition-colors mb-4"
          >
            ← Back to services
          </button>
          
          <div className="grid grid-cols-1 gap-3">
            {koreanPermOptions.map((permOption) => (
              <div
                key={permOption.id}
                onClick={() => handleKoreanPermSelect(permOption)}
                className={`p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  bookingData.service?.id === permOption.id
                    ? 'border-barbershop-gold bg-barbershop-gold/10'
                    : 'border-gray-600 hover:border-barbershop-gold/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">
                    {permOption.name}
                  </h3>
                  <div className="text-right">
                    <p className="text-barbershop-gold font-bold text-lg">
                      ₱{permOption.price}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {permOption.duration} min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className={`p-2 md:p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                bookingData.service?.id === service.id
                  ? 'border-barbershop-gold bg-barbershop-gold/10'
                  : 'border-gray-600 hover:border-barbershop-gold/50'
              }`}
            >
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <h3 className="text-sm md:text-lg font-semibold text-white">
                  {service.name}
                </h3>
                <div className="text-right">
                  <p className="text-barbershop-gold font-bold text-sm md:text-lg">
                    {service.name === 'Korean Perms' ? '₱850 - ₱1100' : `₱${service.price}`}
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm">
                    {service.duration} min
                  </p>
                </div>
              </div>
              
              <p className="text-gray-300 text-xs md:text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
