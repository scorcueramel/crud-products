export interface Product {
    id: number;
    name: string;
    sku: string;
    description: string | null;
    price: string;
    stock: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
}

export interface ProductPermissions {
    create: boolean;
    update: boolean;
    delete: boolean;
}
