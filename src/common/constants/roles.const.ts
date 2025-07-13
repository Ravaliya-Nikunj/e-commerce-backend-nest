import { RoleType } from '../enums/role.enum';
import { RoleConfig } from '../types';

// Automatically generate display names from enum values
const formatDisplayName = (role: string): string => {
  return role
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Automatically create roles array from RoleType enum
export const systemRoles: RoleConfig[] = Object.values(RoleType).map(
  (role) => ({
    name: role,
    displayName: formatDisplayName(role),
  }),
);

// Create a map for quick lookups if needed
export const systemRolesMap = systemRoles.reduce(
  (acc, role) => {
    acc[role.name] = role;
    return acc;
  },
  {} as Record<RoleType, RoleConfig>,
);
