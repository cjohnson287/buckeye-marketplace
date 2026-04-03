export interface CartItemResponse {
    id: number;
    productId: number;
    title: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface CartResponse {
    id: number;
    items: CartItemResponse[];
    total: number;
}

export interface CartState {
    status: 'idle' | 'loading' | 'error';
    data: CartResponse | null;
    error: string | null;
    itemCount: number;
}

export type CartAction =
    | { type: 'LOAD_START' }
    | { type: 'LOAD_SUCCESS'; payload: CartResponse }
    | { type: 'LOAD_ERROR'; payload: string }
    | { type: 'ADD_ITEM_START' }
    | { type: 'ADD_ITEM_SUCCESS'; payload: CartResponse }
    | { type: 'ADD_ITEM_ERROR'; payload: string }
    | { type: 'UPDATE_QUANTITY_START' }
    | { type: 'UPDATE_QUANTITY_SUCCESS'; payload: CartResponse }
    | { type: 'UPDATE_QUANTITY_ERROR'; payload: string }
    | { type: 'REMOVE_ITEM_START' }
    | { type: 'REMOVE_ITEM_SUCCESS'; payload: CartResponse }
    | { type: 'REMOVE_ITEM_ERROR'; payload: string }
    | { type: 'CLEAR_CART_START' }
    | { type: 'CLEAR_CART_SUCCESS'; payload: CartResponse }
    | { type: 'CLEAR_CART_ERROR'; payload: string };

export interface AddToCartPayload {
    id: number;
    name: string;
    price: number;
    imageUrl: string | null;
}