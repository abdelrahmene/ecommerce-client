import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Your Ecommerce Store</title>
        <meta name="description" content="The page you are looking for does not exist" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="w-32 h-32 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto"
            >
              <span className="text-6xl font-bold text-primary-600">404</span>
            </motion.div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/"
              className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              <Home size={18} className="mr-2" />
              Home
            </Link>
            
            <Link
              to="/shop"
              className="flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors"
            >
              <ShoppingBag size={18} className="mr-2" />
              Shop
            </Link>
            
            <Link
              to="/contact"
              className="flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors"
            >
              <Search size={18} className="mr-2" />
              Search
            </Link>
          </div>
          
          <div className="mt-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If you believe this is an error, please <Link to="/contact" className="text-primary-600 hover:text-primary-700">contact us</Link>.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;