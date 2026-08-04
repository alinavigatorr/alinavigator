export interface Permission {
    /**
     * The unique system identifier for the permission.
     * Example: "products:read", "users:manage:all", "orders:create"
     */
    code: string;
    name: string;
    description?: string;
  }
  
  export interface PermissionGroup {
    /**
     * Example: "Catalog Management", "User Administration"
     */
    name: string;
    description?: string;
    permissions: Permission[];
  }