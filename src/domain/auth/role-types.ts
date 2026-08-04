export const UserRole = {
    GUEST: 'GUEST',
    CUSTOMER: 'CUSTOMER',
    SELLER: 'SELLER',
    SUPPORT: 'SUPPORT',
    MODERATOR: 'MODERATOR',
    ADMINISTRATOR: 'ADMINISTRATOR',
    SUPER_ADMINISTRATOR: 'SUPER_ADMINISTRATOR',
  } as const;
  
  export type UserRole = typeof UserRole[keyof typeof UserRole];