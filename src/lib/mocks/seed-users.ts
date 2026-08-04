export type UserRole = 'Super Admin' | 'Diamond Customer' | 'Normal Customer' | 'VIP Customer' | 'Seller';

export interface SeedUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
}

export const SEED_USERS: SeedUser[] = [
    {
        id: 'u-admin',
        name: 'علی (Super Admin)',
        email: 'admin@alinavigator.local',
        role: 'Super Admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff',
    },
    {
        id: 'u-1',
        name: 'کاربر الماسی (Diamond)',
        email: 'diamond@alinavigator.local',
        role: 'Diamond Customer',
        avatar: 'https://ui-avatars.com/api/?name=Diamond&background=8B5CF6&color=fff',
    },
    {
        id: 'u-2',
        name: 'مشتری عادی',
        email: 'customer@alinavigator.local',
        role: 'Normal Customer',
        avatar: 'https://ui-avatars.com/api/?name=Customer&background=3F3F46&color=fff',
    }
];