import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  
  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
        setWishlistItems([]);
      }
    }
  }, []);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);
  
  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      // Check if the product is already in the wishlist
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        toast.error(`${product.name} is already in your wishlist`);
        return prevItems;
      } else {
        toast.success(`${product.name} added to wishlist`);
        return [...prevItems, { ...product, addedAt: new Date().toISOString() }];
      }
    });
  };
  
  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      toast.success('Item removed from wishlist');
      return newItems;
    });
  };
  
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };
  
  const clearWishlist = () => {
    setWishlistItems([]);
    toast.success('Wishlist cleared');
  };
  
  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  };
  
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}