
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, ChevronDown, ChevronUp } from 'lucide-react';

const Footer = () => {
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer className="bg-barbershop-black border-t border-barbershop-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Link to="/web-developer">
                <img src="/lovable-uploads/2a38f175-44b4-4f55-b321-b5ec3ee92bdf.png" alt="Swat Barbershop" className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity" />
              </Link>
            </div>
            <span className="text-xl font-bold text-white font-serif">SWAT BARBERSHOP</span>
            <p className="text-gray-400 mt-4 max-w-md mx-auto text-sm">
              Where traditional craftsmanship meets modern style. Experience the finest in men's haircut 
              with our master barbers and premium services.
            </p>
          </div>

          {/* Quick Links Collapsible */}
          <div className="border-b border-barbershop-gold/20 mb-4">
            <button
              onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
              className="w-full flex justify-between items-center py-4 text-white font-semibold text-left"
            >
              QUICK LINKS
              {isQuickLinksOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {isQuickLinksOpen && (
              <div className="pb-4">
                <ul className="space-y-3">
                  <li><a href="#home" className="text-gray-400 hover:text-barbershop-gold transition-colors block py-1">Home</a></li>
                  <li><a href="#services" className="text-gray-400 hover:text-barbershop-gold transition-colors block py-1">Services</a></li>
                  <li><a href="#about" className="text-gray-400 hover:text-barbershop-gold transition-colors block py-1">About</a></li>
                  <li><a href="#contact" className="text-gray-400 hover:text-barbershop-gold transition-colors block py-1">Contact</a></li>
                </ul>
              </div>
            )}
          </div>

          {/* Contact Collapsible */}
          <div className="border-b border-barbershop-gold/20 mb-8">
            <button
              onClick={() => setIsContactOpen(!isContactOpen)}
              className="w-full flex justify-between items-center py-4 text-white font-semibold text-left"
            >
              CONTACT
              {isContactOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {isContactOpen && (
              <div className="pb-4">
                <ul className="space-y-3 text-gray-400">
                  <li>202 Don Pepe St., Maingate</li>
                  <li>Marisol Village</li>
                  <li>(Infront of fresh options)</li>
                  <li className="pt-2">
                    <a href="tel:09555672389" className="hover:text-barbershop-gold transition-colors">
                      09555672389
                    </a>
                  </li>
                  <li>
                    <a href="mailto:swatbarbershop22@gmail.com" className="hover:text-barbershop-gold transition-colors">
                      swatbarbershop22@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Social Media */}
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-gray-400 hover:text-barbershop-gold transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61566710077999" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-barbershop-gold transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-barbershop-gold transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">© 2025 Swat Barbershop. All rights reserved.</p>
            <p className="text-gray-400 text-sm mt-2">
              Crafted with precision and pride.
            </p>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Link to="/web-developer">
                <img src="/lovable-uploads/2a38f175-44b4-4f55-b321-b5ec3ee92bdf.png" alt="Swat Barbershop" className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity" />
              </Link>
              <span className="text-xl font-bold text-white font-serif">Swat Barbershop</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Where traditional craftsmanship meets modern style. Experience the finest in men's haircut 
              with our master barbers and premium services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-barbershop-gold transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61566710077999" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-barbershop-gold transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-barbershop-gold transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-barbershop-gold transition-colors">Home</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-barbershop-gold transition-colors">Services</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-barbershop-gold transition-colors">About</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-barbershop-gold transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>202 Don Pepe St., Maingate</li>
              <li>Marisol Village</li>
              <li>(Infront of fresh options)</li>
              <li className="pt-2">
                <a href="tel:09555672389" className="hover:text-barbershop-gold transition-colors">
                  09555672389
                </a>
              </li>
              <li>
                <a href="mailto:swatbarbershop22@gmail.com" className="hover:text-barbershop-gold transition-colors">
                  swatbarbershop22@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop Bottom Section */}
        <div className="hidden md:block border-t border-barbershop-gold/20 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Swat Barbershop. All rights reserved.</p>
            <p className="text-gray-400 text-sm mt-4 sm:mt-0">
              Crafted with precision and pride.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
