import type { ProductFilters, Product } from "../types/product";
import { apiFetch } from "./http";

interface ProductMutationPayload {
    title: string;
    description: string;
    price: number;
    categoryId: number;
    sellerName: string;
    imageUrl: string | null;
}

export async function fetchProducts(
    filters?: ProductFilters,
): Promise<Product[]> {
    const params = new URLSearchParams();

    if (filters?.category) params.set("category", filters.category);
    if (filters?.minPrice != null)
        params.set("minPrice", String(filters.minPrice));
    if (filters?.maxPrice != null)
        params.set("maxPrice", String(filters.maxPrice));

    const query = params.toString();
    const url = `/api/Products${query ? `?${query}` : ""}`;

    const res = await apiFetch(url);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
    const res = await apiFetch(`/api/Products/${encodeURIComponent(id)}`);
    if (res.status === 404) throw new NotFoundError("Product not found");
    if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
    return res.json();
}

export async function createProduct(payload: ProductMutationPayload): Promise<Product> {
    const res = await apiFetch("/api/Products", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const problem = await res.json().catch(() => ({}));
        throw new Error(problem.detail ?? `Failed to create product: ${res.status}`);
    }

    return res.json();
}

export async function updateProduct(id: number, payload: ProductMutationPayload): Promise<Product> {
    const res = await apiFetch(`/api/Products/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const problem = await res.json().catch(() => ({}));
        throw new Error(problem.detail ?? `Failed to update product: ${res.status}`);
    }

    return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
    const res = await apiFetch(`/api/Products/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error(`Failed to delete product: ${res.status}`);
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}
