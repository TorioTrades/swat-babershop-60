import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookingData } from '../BookingDialog';
interface CustomerInfoProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}
const CustomerInfo = ({
  bookingData,
  setBookingData
}: CustomerInfoProps) => {
  const handleCustomerInfoChange = (field: keyof BookingData['customerInfo'], value: string) => {
    setBookingData({
      ...bookingData,
      customerInfo: {
        ...bookingData.customerInfo,
        [field]: value
      }
    });
  };
  return <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">Your Information</h3>
        <p className="text-gray-400">Please fill in your details to complete the booking</p>
      </div>

      <div className="bg-barbershop-black/50 p-6 rounded-lg space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-barbershop-gold">
            Full Name *
          </Label>
          <Input id="name" type="text" placeholder="Enter your full name" value={bookingData.customerInfo.name} onChange={e => handleCustomerInfoChange('name', e.target.value)} className="bg-barbershop-charcoal border-gray-600 text-white placeholder:text-gray-400 focus:border-barbershop-gold" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-barbershop-gold">Contact Number *</Label>
          <Input id="phone" type="tel" placeholder="e.g. 09123456789" value={bookingData.customerInfo.phone} onChange={e => handleCustomerInfoChange('phone', e.target.value)} className="bg-barbershop-charcoal border-gray-600 text-white placeholder:text-gray-400 focus:border-barbershop-gold" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-barbershop-gold">
            Email Address *
          </Label>
          <Input id="email" type="email" placeholder="your.email@example.com" value={bookingData.customerInfo.email} onChange={e => handleCustomerInfoChange('email', e.target.value)} className="bg-barbershop-charcoal border-gray-600 text-white placeholder:text-gray-400 focus:border-barbershop-gold" />
        </div>
      </div>

      <div className="text-sm text-gray-400 space-y-1 text-center">
        <p>• All fields are required to complete your booking</p>
        
        <p>• Your phone number is used for important updates</p>
      </div>
    </div>;
};
export default CustomerInfo;