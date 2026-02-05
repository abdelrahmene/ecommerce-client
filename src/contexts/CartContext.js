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

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const toggleCart = () => setCartOpen(prev => !prev);

  const addToCart = (product, quantity = 1, options = {}) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id &&
          JSON.stringify(item.selectedOptions || {}) === JSON.stringify(options)
      );

      let newItems;

      if (existingItemIndex >= 0) {
        newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
      } else {
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

      toast.success(`${product.name} ajouté au panier`);
      return newItems;
    });
  };

  const updateCartItem = (itemId, updates, optionsKey = null) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
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
        return item.id !== itemId ||
          (optionsKey && JSON.stringify(item.selectedOptions) !== optionsKey);
      })
    );
    toast.success('Article retiré du panier');
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Panier vidé');
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

  const processCashOnDeliveryOrder = async (orderData) => {
    try {
      console.log('📦 Traitement de la commande...');

      const yalidineInfo = orderData.yalidine || {};
      const customerInfo = orderData.customer || {};
      const shippingInfo = orderData.shipping || {};
      const productInfo = orderData.product || {};

      // Validation avec les bons noms de propriétés
      if (!yalidineInfo.toWilayaId || !yalidineInfo.toCommuneId) {
        toast.error('Informations de livraison incomplètes');
        return { success: false, error: 'Missing delivery information' };
      }

      if (!customerInfo.firstName || !customerInfo.phone) {
        toast.error('Informations client incomplètes');
        return { success: false, error: 'Missing customer information' };
      }

      if (!productInfo.id) {
        toast.error('Produit manquant');
        return { success: false, error: 'Missing product' };
      }

      // Format pour l'API
      const apiOrderData = {
        items: [{
          productId: productInfo.id,
          productVariantId: productInfo.selectedVariant?.variantId || productInfo.selectedVariant?.id || null,
          quantity: productInfo.quantity || 1,
        }],

        // Yalidine delivery - utiliser toWilayaId au lieu de wilayaId
        toWilayaId: yalidineInfo.toWilayaId,
        toWilayaName: yalidineInfo.toWilayaName,
        toCommuneId: yalidineInfo.toCommuneId,
        toCommuneName: yalidineInfo.toCommuneName,
        isStopDesk: false,
        stopDeskId: null,
        stopDeskName: null,

        // Fees
        deliveryFee: shippingInfo.deliveryFee || 0,
        shippingCost: shippingInfo.totalFee || shippingInfo.deliveryFee || 0,
        freeShipping: false,
        doInsurance: false,
        declaredValue: productInfo.price * (productInfo.quantity || 1),

        // Parcel
        parcelWeight: 1,
        parcelLength: 30,
        parcelWidth: 20,
        parcelHeight: 10,

        // Payment
        paymentMethod: 'COD',
        shippingMethod: 'standard',

        // Notes
        notes: customerInfo.notes || '',
        internalNotes: `E-commerce - ${new Date().toLocaleString('fr-DZ')}`
      };

      // Customer info
      apiOrderData.customer = {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName || '',
        phone: customerInfo.phone,
        email: customerInfo.email || `${customerInfo.phone}@temp.com`,
        address: customerInfo.address || 'Non fournie',
        wilaya: yalidineInfo.toWilayaName,
        commune: yalidineInfo.toCommuneName
      };

      console.log('📡 Envoi à l\'API:', apiOrderData);

      const result = await createOrder(apiOrderData);

      console.log('✅ Réponse API:', result);

      if (result && result.id) {
        toast.success(`Commande #${result.orderNumber} créée avec succès!`);
        clearCart();
        return { success: true, order: result };
      } else {
        toast.error('Erreur lors de la création de la commande');
        throw new Error('Format de réponse invalide');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      toast.error(`Erreur: ${error.message}`);
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
