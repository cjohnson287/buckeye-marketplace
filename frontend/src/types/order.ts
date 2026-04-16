export interface OrderItem {
  id: number;
  productId: number;
  productTitle: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderDate: string;
  status: string;
  total: number;
  shippingAddress: string;
  confirmationNumber: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  shippingAddress: string;
}
