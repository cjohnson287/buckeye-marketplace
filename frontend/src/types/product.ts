export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    sellerName: string;
    imageUrl: string | null;
    postedDate: string;
}

export interface ProductResponse {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    sellerName: string;
    imageUrl: string | null;
    postedDate: string;
}

export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
}
