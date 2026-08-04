import { UserRole } from '../../domain/auth/role-types';

export interface PermissionResult {
  isAllowed: boolean;
  reason?: string;
}

export class PermissionEngine {
  /**
   * Defines the inheritance tree for roles.
   * A role on the left automatically inherits all roles on the right (array).
   */
  private static readonly ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
    [UserRole.SUPER_ADMINISTRATOR]: [UserRole.ADMINISTRATOR],
    [UserRole.ADMINISTRATOR]: [UserRole.MODERATOR],
    [UserRole.MODERATOR]: [UserRole.SUPPORT],
    [UserRole.SUPPORT]: [UserRole.CUSTOMER],
    [UserRole.SELLER]: [UserRole.CUSTOMER],
    [UserRole.CUSTOMER]: [UserRole.GUEST],
    [UserRole.GUEST]: [],
  };

  /**
   * Recursively resolves all effective roles for a given list of base roles.
   * Example: ['ADMINISTRATOR'] resolves to ['ADMINISTRATOR', 'MODERATOR', 'SUPPORT', 'CUSTOMER', 'GUEST']
   */
  public static getEffectiveRoles(baseRoles: UserRole[]): Set<UserRole> {
    const effectiveRoles = new Set<UserRole>();

    const resolve = (role: UserRole) => {
      if (!effectiveRoles.has(role)) {
        effectiveRoles.add(role);
        const inheritedRoles = this.ROLE_HIERARCHY[role] || [];
        for (const inherited of inheritedRoles) {
          resolve(inherited);
        }
      }
    };

    for (const role of baseRoles) {
      resolve(role);
    }

    return effectiveRoles;
  }

  /**
   * Evaluates whether the user roles satisfy the required permission.
   * 
   * @param userRoles The roles assigned directly to the user.
   * @param requiredPermissionCode The unique code of the required permission (e.g., 'orders:delete').
   * @param rolePermissionsMap A mapping of UserRoles to arrays of permission codes they grant.
   */
  public static evaluateAccess(
    userRoles: UserRole[],
    requiredPermissionCode: string,
    rolePermissionsMap: Record<string, string[]>
  ): PermissionResult {
    if (!userRoles || userRoles.length === 0) {
      return { isAllowed: false, reason: 'No roles assigned to user.' };
    }

    const effectiveRoles = this.getEffectiveRoles(userRoles);

    for (const role of Array.from(effectiveRoles)) {
      const grantedPermissions = rolePermissionsMap[role] || [];
      
      // Wildcard check for full access or specific exact match
      if (
        grantedPermissions.includes('*') || 
        grantedPermissions.includes(requiredPermissionCode)
      ) {
        return { isAllowed: true };
      }
    }

    return { 
      isAllowed: false, 
      reason: `Missing required permission: ${requiredPermissionCode}` 
    };
  }
}