import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Mail, 
  Phone,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Animation variants for hover effect
  const socialIconVariants = {
    hover: {
      scale: 1.1,
      y: -2,
      transition: { duration: 0.2 }
    }
  };
  
  // Handle newsletter subscription
  const handleNewsletter = (e) => {
    e.preventDefault();
    // Implement newsletter subscription logic
    // For now, just reset the form
    e.target.reset();
  };
  
  return (
    <footer className="bg-secondary-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand / About Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-stone-600">BIRK & SHOES</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Votre destination shopping en ligne en Algérie. Des produits de qualité, livrés rapidement à votre porte.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover="hover"
                variants={socialIconVariants}
                className="bg-secondary-800 hover:bg-primary-600 p-2 rounded-full transition-colors duration-300"
              >
                <Facebook size={18} />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover="hover"
                variants={socialIconVariants}
                className="bg-secondary-800 hover:bg-primary-600 p-2 rounded-full transition-colors duration-300"
              >
                <Instagram size={18} />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover="hover"
                variants={socialIconVariants}
                className="bg-secondary-800 hover:bg-primary-600 p-2 rounded-full transition-colors duration-300"
              >
                <Twitter size={18} />
              </motion.a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/shop" 
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm inline-block"
                >
                  Boutique
                </Link>
              </li>
              <li>
                <Link 
                  to="/collections" 
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm inline-block"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm inline-block"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm inline-block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm inline-block"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">123 Rue des Boutiques, Alger, Algérie</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+213 XX XX XX XX</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm">contact@votreboutique.dz</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Inscrivez-vous pour recevoir les dernières offres et nouveautés.
            </p>
            <form onSubmit={handleNewsletter} className="relative">
              <input 
                type="email" 
                placeholder="Votre email" 
                required
                className="w-full bg-secondary-800 text-white placeholder-gray-500 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 p-2 rounded-md transition-colors duration-200"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
        
        {/* Copyright section */}
        <div className="border-t border-secondary-800 mt-12 pt-6 flex justify-center items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} BIRK & SHOES. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;