import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, CreditCard, Truck, MapPin, AlertTriangle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from '../../services/firebaseService';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    // Shipping details
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    email: currentUser?.email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    city: userProfile?.city || '',
    state: userProfile?.state || '',
    zipCode: userProfile?.zipCode || '',
    country: userProfile?.country || 'US',
    
    // Payment details
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    
    // Shipping method
    shippingMethod: 'standard',
    
    // Order notes
    notes: ''
  });
  
  useEffect(() => {
    // Redirect if cart is empty
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you would process payment here
      // For demo purposes, we'll just create an order in Firestore
      
      const orderData = {
        userId: currentUser.uid,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.salePrice || item.price,
          quantity: item.quantity,
          options: item.selectedOptions || {},
          image: item.images?.[0] || null
        })),
        shipping: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          method: formData.shippingMethod
        },
        subtotal: getCartTotal(),
        tax: getCartTotal() * 0.1, // Example tax calculation
        shipping: formData.shippingMethod === 'express' ? 15 : 5,
        total: getCartTotal() + (getCartTotal() * 0.1) + (formData.shippingMethod === 'express' ? 15 : 5),
        status: 'pending',
        notes: formData.notes,
        createdAt: serverTimestamp()
      };
      
      const orderRef = await addDoc(collection('orders'), orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to success page
      navigate(`/account/orders/${orderRef.id}`, { 
        state: { 
          success: true,
          message: 'Your order has been placed successfully!' 
        } 
      });
      
    } catch (err) {
      console.error('Error processing order:', err);
      setError('Failed to process your order. Please try again.');
      setLoading(false);
    }
  };
  
  const nextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const calculateTotal = () => {
    const subtotal = getCartTotal();
    const tax = subtotal * 0.1; // Example tax calculation
    const shipping = formData.shippingMethod === 'express' ? 15 : 5;
    return subtotal + tax + shipping;
  };
  
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <>
      <Helmet>
        <title>Checkout | Your Ecommerce Store</title>
        <meta name="description" content="Complete your purchase" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          
          {/* Checkout steps */}
          <div className="flex justify-between items-center mb-8">
            <div className="hidden md:flex w-full">
              <div className={`flex-1 border-t-2 ${step >= 1 ? 'border-primary-500' : 'border-gray-300'}`}></div>
              <div className={`flex-1 border-t-2 ${step >= 2 ? 'border-primary-500' : 'border-gray-300'}`}></div>
              <div className={`flex-1 border-t-2 ${step >= 3 ? 'border-primary-500' : 'border-gray-300'}`}></div>
            </div>
            
            <div className="flex w-full justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > 1 ? <Check size={18} /> : 1}
                </div>
                <span className="mt-2 text-sm font-medium">Shipping</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > 2 ? <Check size={18} /> : 2}
                </div>
                <span className="mt-2 text-sm font-medium">Payment</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <span className="mt-2 text-sm font-medium">Review</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
            <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <motion.div
                  key="shipping"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={{ duration: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center mb-6">
                    <MapPin size={24} className="text-primary-500 mr-3" />
                    <h2 className="text-xl font-semibold">Shipping Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium mb-2">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium mb-2">State/Province</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium mb-2">ZIP/Postal Code</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium mb-2">Country</label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="flex items-center mb-6">
                      <Truck size={24} className="text-primary-500 mr-3" />
                      <h2 className="text-xl font-semibold">Shipping Method</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="flex p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={formData.shippingMethod === 'standard'}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <div className="ml-4">
                          <div className="font-medium">Standard Shipping</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Delivery in 3-5 business days</div>
                          <div className="font-medium mt-1">$5.00</div>
                        </div>
                      </label>
                      
                      <label className="flex p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={formData.shippingMethod === 'express'}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <div className="ml-4">
                          <div className="font-medium">Express Shipping</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Delivery in 1-2 business days</div>
                          <div className="font-medium mt-1">$15.00</div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Step 2: Payment Information */}
              {step === 2 && (
                <motion.div
                  key="payment"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={{ duration: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center mb-6">
                    <CreditCard size={24} className="text-primary-500 mr-3" />
                    <h2 className="text-xl font-semibold">Payment Information</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium mb-2">Name on Card</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium mb-2">Expiration Date</label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          required
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cardCvc" className="block text-sm font-medium mb-2">CVC</label>
                        <input
                          type="text"
                          id="cardCvc"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          required
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                        placeholder="Special instructions for delivery or any other notes"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-lg transition-colors"
                    >
                      Back to Shipping
                    </button>
                    
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Step 3: Review Order */}
              {step === 3 && (
                <motion.div
                  key="review"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={{ duration: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
                  
                  {/* Order items */}
                  <div className="mb-8">
                    <h3 className="font-medium mb-4">Items in Your Order</h3>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {cartItems.map((item) => (
                        <div key={`${item.id}-${JSON.stringify(item.selectedOptions)}`} className="py-4 flex">
                          <div className="flex-shrink-0 w-16 h-16">
                            <img
                              src={item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/150'}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <div className="flex justify-between mt-1">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Qty: {item.quantity}
                                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                  <span className="ml-2">
                                    ({Object.values(item.selectedOptions).join(', ')})
                                  </span>
                                )}
                              </div>
                              <div className="font-medium">
                                ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Shipping info */}
                  <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-medium mb-4">Shipping Information</h3>
                      <div className="text-sm space-y-2">
                        <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                        <p>{formData.country}</p>
                        <p>{formData.email}</p>
                        <p>{formData.phone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Payment Information</h3>
                      <div className="text-sm space-y-2">
                        <p className="font-medium">{formData.cardName}</p>
                        <p>Card ending in {formData.cardNumber.slice(-4)}</p>
                        <p>Expires {formData.cardExpiry}</p>
                      </div>
                      
                      <h3 className="font-medium mt-6 mb-4">Shipping Method</h3>
                      <p className="text-sm">
                        {formData.shippingMethod === 'express' ? 'Express Shipping (1-2 business days)' : 'Standard Shipping (3-5 business days)'}
                      </p>
                    </div>
                  </div>
                  
                  {formData.notes && (
                    <div className="mb-8">
                      <h3 className="font-medium mb-4">Order Notes</h3>
                      <p className="text-sm">{formData.notes}</p>
                    </div>
                  )}
                  
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-lg transition-colors"
                    >
                      Back to Payment
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center ${
                        loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
          
          {/* Order summary */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.selectedOptions)}`} className="flex justify-between">
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">${((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                  <span className="font-medium">${(getCartTotal() * 0.1).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium">${formData.shippingMethod === 'express' ? '15.00' : '5.00'}</span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;