import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const CartPage = () => {
  const { cartItems, updateCartItem, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    
    updateCartItem(item.id, { quantity: newQuantity }, JSON.stringify(item.selectedOptions));
  };
  
  const handleRemoveItem = (item) => {
    removeFromCart(item.id, JSON.stringify(item.selectedOptions));
  };
  
  const handleClearCart = () => {
    clearCart();
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
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
        <title>Your Cart | Your Ecommerce Store</title>
        <meta name="description" content="View and manage your shopping cart" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold flex items-center">
            <ShoppingCart className="mr-3" size={32} />
            Your Cart
          </h1>
        </motion.div>
        
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-16"
          >
            <ShoppingBag size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Continue Shopping
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between">
                  <h2 className="text-xl font-semibold">Shopping Cart ({cartItems.length} items)</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Clear Cart
                  </button>
                </div>
                
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cartItems.map((item) => (
                    <motion.li
                      key={`${item.id}-${JSON.stringify(item.selectedOptions)}`}
                      variants={itemVariants}
                      className="p-6"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Product image */}
                        <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0">
                          <img
                            src={item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/150'}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        
                        {/* Product details */}
                        <div className="flex-1 sm:ml-6">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <h3 className="text-lg font-medium">
                                <Link to={`/product/${item.id}`} className="hover:text-primary-600 transition-colors">
                                  {item.name}
                                </Link>
                              </h3>
                              
                              {/* Product options */}
                              {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  {Object.entries(item.selectedOptions).map(([key, value]) => (
                                    <span key={key} className="mr-4">
                                      <span className="font-medium">{key}:</span> {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              {/* Price */}
                              <div className="mt-2">
                                <span className="font-medium">
                                  ${(item.salePrice || item.price).toFixed(2)}
                                </span>
                                {item.salePrice && (
                                  <span className="ml-2 text-sm text-gray-500 line-through">
                                    ${item.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
                              {/* Quantity */}
                              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                                <button
                                  onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                  className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="px-3 py-1 text-center w-10">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                  className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              
                              {/* Subtotal */}
                              <div className="mt-2 font-medium">
                                ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                              </div>
                              
                              {/* Remove button */}
                              <button
                                onClick={() => handleRemoveItem(item)}
                                className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
                              >
                                <Trash2 size={14} className="mr-1" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
            
            {/* Order summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                  
                  <div className="mt-6">
                    <Link
                      to="/shop"
                      className="text-primary-600 hover:text-primary-700 flex items-center justify-center"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;