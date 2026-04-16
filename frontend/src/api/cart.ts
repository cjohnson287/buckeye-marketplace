import type { CartResponse } from "../types/cart";
import { apiFetch } from "./http";

const API_BASE = "/api/cart";

export async function fetchCart(): Promise<CartResponse> {
    const res = await apiFetch(API_BASE);
    if (res.status === 401) throw new Error("Please log in to view your cart");
    if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status}`);
    return res.json();
}

export async function addToCart(
    productId: number,
    quantity: number = 1
): Promise<CartResponse> {
    const res = await apiFetch(API_BASE, {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || `Failed to add to cart: ${res.status}`);
    }
    return res.json();
}

export async function updateCartItemQuantity(
    cartItemId: number,
    quantity: number
): Promise<CartResponse> {
    const res = await apiFetch(`${API_BASE}/${cartItemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(
            error.error || `Failed to update quantity: ${res.status}`
        );
    }
    return res.json();
}

export async function removeFromCart(cartItemId: number): Promise<CartResponse> {
    const res = await apiFetch(`${API_BASE}/${cartItemId}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || `Failed to remove item: ${res.status}`);
    }
    return res.json();
}

export async function clearCart(): Promise<CartResponse> {
    const res = await apiFetch(`${API_BASE}/clear`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || `Failed to clear cart: ${res.status}`);
    }
    return res.json();
}
