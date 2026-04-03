import React from 'react';
import { Link } from 'react-router-dom';
import { Flower2, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 text-2xl font-display font-bold text-primary mb-4">
              <Flower2 className="text-gold" />
              Flowers<span className="text-gold">World</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Bringing beauty to your doorstep with fresh, handcrafted floral arrangements since 2010.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-gray-300 hover:text-primary transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-300 hover:text-primary transition-colors">Shop Now</Link></li>
              <li><Link to="/account/orders" className="text-gray-300 hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <Phone size={18} className="text-gold" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail size={18} className="text-gold" />
                <span>hello@flowersworld.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <MapPin size={18} className="text-gold" />
                <span>123 Flower Lane, Garden City, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Flowers World. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
