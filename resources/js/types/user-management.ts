export interface Role {
    id: number;
    name: string;
}

export interface UserItem {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    roles: Role[];
}

export interface EditableUser {
    id: number;
    name: string;
    email: string;
    roles: string[];
}

export interface PaginatedUsers {
    data: UserItem[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

export interface UserPermissions {
    create: boolean;
    update: boolean;
    delete: boolean;
}
