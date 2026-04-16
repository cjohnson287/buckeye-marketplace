import type { CartState, CartAction } from '../types/cart';

export const initialCartState: CartState = {
  status: 'idle',
  data: null,
  error: null,
  itemCount: 0,
};

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        status: 'loading',
        error: null,
      };

    case 'LOAD_SUCCESS': {
      const itemCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
      return {
        ...state,
        status: 'idle',
        data: action.payload,
        itemCount,
        error: null,
      };
    }

    case 'LOAD_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };

    case 'ADD_ITEM_START':
      return {
        ...state,
        status: 'loading',
        error: null,
      };

    case 'ADD_ITEM_SUCCESS': {
      const itemCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
      return {
        ...state,
        status: 'idle',
        data: action.payload,
        itemCount,
        error: null,
      };
    }

    case 'ADD_ITEM_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };

    case 'UPDATE_QUANTITY_START':
      return {
        ...state,
        status: 'loading',
        error: null,
      };

    case 'UPDATE_QUANTITY_SUCCESS': {
      const itemCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
      return {
        ...state,
        status: 'idle',
        data: action.payload,
        itemCount,
        error: null,
      };
    }

    case 'UPDATE_QUANTITY_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };

    case 'REMOVE_ITEM_START':
      return {
        ...state,
        status: 'loading',
        error: null,
      };

    case 'REMOVE_ITEM_SUCCESS': {
      const itemCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
      return {
        ...state,
        status: 'idle',
        data: action.payload,
        itemCount,
        error: null,
      };
    }

    case 'REMOVE_ITEM_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };

    case 'CLEAR_CART_START':
      return {
        ...state,
        status: 'loading',
        error: null,
      };

    case 'CLEAR_CART_SUCCESS':
      return {
        ...state,
        status: 'idle',
        data: action.payload,
        itemCount: 0,
        error: null,
      };

    case 'CLEAR_CART_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };

    default:
      return state;
  }
};