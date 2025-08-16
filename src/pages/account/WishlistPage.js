import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Package, Heart, LogOut, ShoppingCart, Trash2, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const { currentUser, logout } = useAuth();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const handleRemoveItem = (productId) => {
    removeFromWishlist(productId);
  };
  
  const handleClearWishlist = () => {
    clearWishlist();
    toast.success('Wishlist cleared');
  };
  
  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>My Wishlist | Your Ecommerce Store</title>
        <meta name="description" content="View and manage your wishlist" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold flex items-center">
            <Heart className="mr-3" size={32} />
            My Wishlist
          </h1>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                    {currentUser?.email?.charAt(0) || 'U'}
                  </div>
                  <div className="ml-4">
                    <h2 className="font-semibold">
                      {currentUser?.displayName || 'User'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{currentUser?.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-2">
                <Link
                  to="/account"
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <User size={18} className="mr-3" />
                  Profile
                </Link>
                
                <Link
                  to="/account/orders"
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mt-1"
                >
                  <Package size={18} className="mr-3" />
                  Orders
                </Link>
                
                <Link
                  to="/wishlist"
                  className="flex items-center px-4 py-3 text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-300 rounded-lg mt-1"
                >
                  <Heart size={18} className="mr-3" />
                  Wishlist
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mt-1"
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </motion.div>
          
          {/* Main content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Saved Items ({wishlistItems.length})</h2>
                
                {wishlistItems.length > 0 && (
                  <button
                    onClick={handleClearWishlist}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Clear Wishlist
                  </button>
                )}
              </div>
              
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                  <Heart size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-6" />
                  <h3 className="text-xl font-medium mb-4">Your wishlist is empty</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Save items you love to your wishlist and find them here anytime.
                  </p>
                  <Link
                    to="/shop"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors inline-block"
                  >
                    Explore Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlistItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <X size={16} />
                      </button>
                      
                      <div className="flex flex-col md:flex-row">
                        <Link to={`/product/${item.id}`} className="md:w-1/3">
                          <div className="aspect-w-1 aspect-h-1">
                            <img
                              src={item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/150'}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>
                        
                        <div className="p-4 md:w-2/3">
                          <Link to={`/product/${item.id}`} className="block mb-2">
                            <h3 className="font-medium hover:text-primary-600 transition-colors">{item.name}</h3>
                          </Link>
                          
                          <div className="mb-4">
                            {item.salePrice ? (
                              <div className="flex items-center">
                                <span className="font-medium text-primary-600">${item.salePrice.toFixed(2)}</span>
                                <span className="ml-2 text-sm text-gray-500 line-through">${item.price.toFixed(2)}</span>
                              </div>
                            ) : (
                              <span className="font-medium">${item.price.toFixed(2)}</span>
                            )}
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="flex-1 flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                              <ShoppingCart size={16} className="mr-2" />
                              Add to Cart
                            </button>
                            
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 px-4 py-2 rounded-md transition-colors"
                              aria-label="Remove from wishlist"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default WishlistPage;