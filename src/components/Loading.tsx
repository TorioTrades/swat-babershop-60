
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen bg-barbershop-black flex items-center justify-center">
      <div className="text-center animate-fade-in">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/0fe4806d-e81d-4af3-bd38-e731ba73bd3e.png" 
            alt="Swat Barbershop Logo" 
            className="h-32 w-32 mx-auto mb-6"
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">
          SWAT
        </h1>
        <div className="flex items-center justify-center mb-8">
          <div className="h-px bg-barbershop-gold w-16"></div>
          <span className="text-barbershop-gold text-sm font-medium mx-4 tracking-widest">
            BARBERS
          </span>
          <div className="h-px bg-barbershop-gold w-16"></div>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-barbershop-gold animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
