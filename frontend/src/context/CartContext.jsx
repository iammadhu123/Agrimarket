import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user || user.role !== 'buyer') return;
    try {
      const { data } = await API.get('/cart');
      setCart({ items: data.cart?.items || [], totalPrice: data.totalPrice || 0 });
    } catch {
      // silent fail
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return false;
    }
    setCartLoading(true);
    try {
      const { data } = await API.post('/cart/add', { productId, quantity });
      setCart({ items: data.cart?.items || [], totalPrice: data.totalPrice || 0 });
      toast.success('Added to cart!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
      return false;
    } finally {
      setCartLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setCartLoading(true);
    try {
      const { data } = await API.put('/cart/update', { productId, quantity });
      setCart({ items: data.cart?.items || [], totalPrice: data.totalPrice || 0 });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart');
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setCartLoading(true);
    try {
      const { data } = await API.delete(`/cart/remove/${productId}`);
      setCart({ items: data.cart?.items || [], totalPrice: data.totalPrice || 0 });
      toast.success('Removed from cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    } finally {
      setCartLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      await API.delete('/cart/clear');
      setCart({ items: [], totalPrice: 0 });
    } catch {
      // silent
    }
  };

  const cartItemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, cartLoading, cartItemCount, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
