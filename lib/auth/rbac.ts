export type Role = "admin" | "developer" | "tester" | "viewer";

export type Permission =
  | "project:create"
  | "project:read"
  | "project:update"
  | "project:delete"
  | "api:generate"
  | "api:deploy"
  | "security:scan"
  | "security:fix"
  | "performance:test"
  | "keys:manage"
  | "team:manage"
  | "settings:manage"
  | "billing:manage";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "project:create", "project:read", "project:update", "project:delete",
    "api:generate", "api:deploy",
    "security:scan", "security:fix",
    "performance:test",
    "keys:manage",
    "team:manage",
    "settings:manage",
    "billing:manage",
  ],
  developer: [
    "project:create", "project:read", "project:update",
    "api:generate", "api:deploy",
    "security:scan",
    "performance:test",
    "keys:manage",
  ],
  tester: [
    "project:read",
    "security:scan",
    "performance:test",
  ],
  viewer: [
    "project:read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}
