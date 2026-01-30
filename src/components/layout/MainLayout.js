import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

import { useCart } from '../../contexts/CartContext';
import SearchOverlay from './SearchOverlay';
import toast, { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useCart();

  // Effet pour contrôler le header transparent/scrollé
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 60;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Effet pour fermer le tiroir du panier et la recherche lors du changement de page
  useEffect(() => {
    setCartOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Effet pour remonter en haut lors du changement de page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleCart = () => {
    setCartOpen(prev => !prev);
    if (searchOpen) setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(prev => !prev);
    if (cartOpen) setCartOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-300">
      {/* Header */}
      <Header
        toggleCart={toggleCart}
        toggleSearch={toggleSearch}
        cartItemsCount={cartItems.length}
        scrolled={scrolled}
      />

      {/* Page Content with Transitions */}
      <main className="flex-grow relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="min-h-[50vh]"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />



      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <SearchOverlay
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </div>
  );
};

export default MainLayout;