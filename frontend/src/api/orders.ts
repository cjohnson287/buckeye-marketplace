import { apiFetch } from "./http";
import type { CreateOrderPayload, Order } from "../types/order";

export async function placeOrder(payload: CreateOrderPayload): Promise<Order> {
  const response = await apiFetch("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    throw new Error(problem.detail ?? "Failed to place order");
  }

  return response.json();
}

export async function fetchMyOrders(): Promise<Order[]> {
  const response = await apiFetch("/api/orders/mine");
  if (!response.ok) {
    throw new Error(`Failed to load orders: ${response.status}`);
  }
  return response.json();
}

export async function fetchAllOrders(): Promise<Order[]> {
  const response = await apiFetch("/api/orders");
  if (!response.ok) {
    throw new Error(`Failed to load all orders: ${response.status}`);
  }
  return response.json();
}

export async function updateOrderStatus(orderId: number, status: string): Promise<Order> {
  const response = await apiFetch(`/api/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    throw new Error(problem.detail ?? `Failed to update order: ${response.status}`);
  }

  return response.json();
}
