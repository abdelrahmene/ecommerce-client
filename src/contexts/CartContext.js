import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { createOrder } from '../services/orderService';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        setCartItems([]);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const toggleCart = () => setCartOpen(prev => !prev);
  
  const addToCart = (product, quantity = 1, options = {}) => {
    setCartItems(prevItems => {
      // Check if the product is already in the cart
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && 
        JSON.stringify(item.selectedOptions || {}) === JSON.stringify(options)
      );
      
      let newItems;
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already exists
        newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if product doesn't exist in cart
        newItems = [
          ...prevItems, 
          { 
            ...product, 
            quantity, 
            selectedOptions: options,
            addedAt: new Date().toISOString()
          }
        ];
      }
      
      toast.success(`${product.name} added to cart`);
      return newItems;
    });
  };
  
  const updateCartItem = (itemId, updates, optionsKey = null) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        // Match by ID and options if optionsKey is provided
        if (item.id === itemId && 
            (!optionsKey || JSON.stringify(item.selectedOptions) === optionsKey)) {
          return { ...item, ...updates };
        }
        return item;
      })
    );
  };
  
  const removeFromCart = (itemId, optionsKey = null) => {
    setCartItems(prevItems => 
      prevItems.filter(item => {
        // Remove only if ID matches and options match (if optionsKey provided)
        return item.id !== itemId || 
          (optionsKey && JSON.stringify(item.selectedOptions) !== optionsKey);
      })
    );
    toast.success('Item removed from cart');
  };
  
  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };
  
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };
  
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  
  // Fonction pour traiter les commandes avec paiement à la livraison
  const processCashOnDeliveryOrder = async (orderData) => {
    try {
      // Préparer les données de la commande pour Firebase
      const firebaseOrderData = {
        // Informations du produit
        product: orderData.product,
        
        // Informations de livraison
        deliveryInfo: orderData.deliveryInfo,
        
        // Informations de paiement
        paymentMethod: 'cash-on-delivery',
        paymentStatus: 'pending',
        
        // Statut de la commande
        status: 'pending',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date().toISOString(),
            note: 'Commande créée avec paiement à la livraison'
          }
        ],
        
        // Montant total
        totalAmount: orderData.product.price * orderData.product.quantity,
        
        // Dates
        orderDate: new Date().toISOString(),
      };
      
      // Enregistrer la commande dans Firebase
      console.log('Enregistrement de la commande dans Firebase:', firebaseOrderData);
      const result = await createOrder(firebaseOrderData);
      
      if (result.success) {
        toast.success(`Commande #${result.orderId} enregistrée avec succès!`);
        return result;
      } else {
        toast.error('Erreur lors de l\'enregistrement de la commande');
        throw new Error(result.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la commande:', error);
      return { success: false, error: error.message };
    }
  };
  
  const value = {
    cartItems,
    cartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    processCashOnDeliveryOrder
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}