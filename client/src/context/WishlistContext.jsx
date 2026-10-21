import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuthContext } from './AuthContext';
import { useToastContext } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuthContext();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToastContext();

  const loadWishlist = useCallback(async () => {
    if (!currentUser) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const items = await wishlistService.getWishlist(currentUser.id);
      setWishlist(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const toggleWishlist = async (productId, productName = 'Item') => {
    if (!currentUser) return;
    try {
      const res = await wishlistService.toggle(currentUser.id, productId);
      setWishlist(res.wishlist);
      if (res.isWishlisted) {
        toast.success(`Saved "${productName}" to your wishlist!`);
      } else {
        toast.info(`Removed "${productName}" from your wishlist.`);
      }
      return res.isWishlisted;
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlist.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  }
  return context;
};
