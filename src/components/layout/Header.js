import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Search,
  User,
  Heart,
  Menu,
  ChevronDown,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

// Composant de lien de navigation animé
const NavLinkWithAnimation = ({ to, label, end = false }) => {
  return (
    <motion.div
      className="relative px-3 py-2"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <NavLink
        to={to}
        className={({ isActive }) =>
          `relative text-base font-medium tracking-wide transition-all duration-300 ${isActive
            ? 'text-black dark:text-white font-semibold'
            : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'}`
        }
        end={end}
      >
        {({ isActive }) => (
          <>
            {label}
            {isActive && (
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black dark:bg-white rounded-full"
                layoutId="navIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </>
        )}
      </NavLink>
    </motion.div>
  );
};

const Header = ({ toggleCart, toggleSearch, cartItemsCount, scrolled }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Animation variants for dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    exit: {
      opacity: 0,
      y: -5,
      height: 0,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDropdown && !e.target.closest('.user-menu')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Close dropdown and mobile menu when changing page
  useEffect(() => {
    setShowDropdown(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-lg py-2 border-b border-gray-100/10 dark:border-white/5'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.span
                className="text-2xl font-bold text-black dark:text-white tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-stone-700 dark:from-amber-400 dark:to-stone-500 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                BIRK & SHOES
              </motion.span>
            </Link>

            {/* Desktop Navigation - hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavLinkWithAnimation to="/" label="Accueil" end={true} />
              <NavLinkWithAnimation to="/men" label="Hommes" />
              <NavLinkWithAnimation to="/women" label="Femmes" />
              <NavLinkWithAnimation to="/kids" label="Enfant" />
              <NavLinkWithAnimation to="/contact" label="Contact" />
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors"
                aria-label={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 hover:text-white transition-colors">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 hover:text-black transition-colors">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  </svg>
                )}
              </button>

              {/* Search Button */}
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors"
                aria-label="Rechercher"
              >
                <Search size={20} className="text-gray-700 dark:text-gray-300" />
              </button>

              {/* Wishlist - Desktop only */}
              <Link
                to="/wishlist"
                className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors"
                aria-label="Liste de souhaits"
              >
                <Heart size={20} className="text-gray-700 dark:text-gray-300" />
              </Link>

              {/* User Menu - Desktop */}
              <div className="hidden sm:block relative user-menu">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors flex items-center"
                  aria-label="Menu utilisateur"
                >
                  <User size={20} className="text-gray-700 dark:text-gray-300" />
                  <ChevronDown size={16} className={`ml-1 text-gray-700 dark:text-gray-300 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-lg shadow-lg overflow-hidden z-50"
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-secondary-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Connecté en tant que</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{user.email}</p>
                          </div>
                          <Link
                            to="/account"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-700"
                          >
                            Mon compte
                          </Link>
                          <Link
                            to="/account/orders"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-700"
                          >
                            Mes commandes
                          </Link>
                          <Link
                            to="/wishlist"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-700"
                          >
                            Ma liste de souhaits
                          </Link>
                          <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-secondary-700"
                          >
                            Déconnexion
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-700"
                          >
                            Connexion
                          </Link>
                          <Link
                            to="/register"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-700"
                          >
                            Inscription
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button - visible only on mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors"
                aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                <Menu size={24} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Slide in from right - Moved outside header for better z-index handling */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              style={{ position: 'fixed' }}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white dark:bg-gray-900 shadow-xl z-[9999] md:hidden overflow-y-auto"
              style={{ position: 'fixed' }}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <span className="font-bold text-lg text-gray-900 dark:text-white">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={20} className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              <nav className="p-4 flex flex-col space-y-2">
                <Link
                  to="/"
                  className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  to="/men"
                  className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hommes
                </Link>
                <Link
                  to="/women"
                  className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Femmes
                </Link>
                <Link
                  to="/kids"
                  className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Enfant
                </Link>

                <Link
                  to="/contact"
                  className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                <div className="border-t border-gray-200 dark:border-gray-800 my-2 pt-2">
                  {user ? (
                    <>
                      <Link
                        to="/account"
                        className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User size={18} className="mr-2" />
                        Mon compte
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium text-left flex items-center"
                      >
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Connexion
                      </Link>
                      <Link
                        to="/register"
                        className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Inscription
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;