export interface PermissionOption {
    id: number;
    name: string;
}

export interface RoleItem {
    id: number;
    name: string;
    permissions: string[];
    can_update: boolean;
    can_delete: boolean;
}

export interface EditableRole {
    id: number;
    name: string;
    permissions: string[];
}

export interface PaginatedRoles {
    data: RoleItem[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}
