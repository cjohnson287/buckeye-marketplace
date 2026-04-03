/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, type ReactNode, useEffect } from 'react';
import type { CartState, CartAction } from '../types/cart';
import { cartReducer, initialCartState } from '../reducers/cartReducer';
import * as cartAPI from '../api/cart';

interface CartContextType {
  state: CartState;
  dispatch: (action: CartAction) => void;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Load cart from API on mount
  const refreshCart = async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const cart = await cartAPI.fetchCart();
      dispatch({ type: 'LOAD_SUCCESS', payload: cart });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load cart';
      dispatch({ type: 'LOAD_ERROR', payload: message });
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: number, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM_START' });
    try {
      const updatedCart = await cartAPI.addToCart(productId, quantity);
      dispatch({ type: 'ADD_ITEM_SUCCESS', payload: updatedCart });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add item to cart';
      dispatch({ type: 'ADD_ITEM_ERROR', payload: message });
      throw error;
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY_START' });
    try {
      const updatedCart = await cartAPI.updateCartItemQuantity(cartItemId, quantity);
      dispatch({ type: 'UPDATE_QUANTITY_SUCCESS', payload: updatedCart });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update quantity';
      dispatch({ type: 'UPDATE_QUANTITY_ERROR', payload: message });
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    dispatch({ type: 'REMOVE_ITEM_START' });
    try {
      const updatedCart = await cartAPI.removeFromCart(cartItemId);
      dispatch({ type: 'REMOVE_ITEM_SUCCESS', payload: updatedCart });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove item';
      dispatch({ type: 'REMOVE_ITEM_ERROR', payload: message });
      throw error;
    }
  };

  const clearCartFunc = async () => {
    dispatch({ type: 'CLEAR_CART_START' });
    try {
      const clearedCart = await cartAPI.clearCart();
      dispatch({ type: 'CLEAR_CART_SUCCESS', payload: clearedCart });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to clear cart';
      dispatch({ type: 'CLEAR_CART_ERROR', payload: message });
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart: clearCartFunc,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}