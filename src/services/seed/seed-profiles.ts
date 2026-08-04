/**
 * Development Seed Profiles Data
 * تعریف ساختار داده‌ای پروفایل‌ها و مقادیر اولیه برای هر نقش تستی.
 */

 import { DevRole, DevMembershipTier } from './seed-roles';

 export interface SeedProfile {
   id: string;
   name: string;
   email: string;
   avatar: string;
   role: DevRole;
   membershipTier: DevMembershipTier;
   walletBalance: number;
   loyaltyPoints: number;
   cashbackBalance: number;
   orderCount: number;
   wishlistCount: number;
   cartCount: number;
   notificationCount: number;
 }
 
 export const SEED_PROFILES: SeedProfile[] = [
   {
     id: 'profile-super-admin',
     name: 'علی (Super Admin)',
     email: 'admin@alinavigator.local',
     avatar: 'https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff',
     role: 'Super Admin',
     membershipTier: 'Diamond',
     walletBalance: 15000000,
     loyaltyPoints: 5200,
     cashbackBalance: 2400000,
     orderCount: 42,
     wishlistCount: 12,
     cartCount: 3,
     notificationCount: 5,
   },
   {
     id: 'profile-diamond-customer',
     name: 'سارا (Diamond Customer)',
     email: 'diamond@alinavigator.local',
     avatar: 'https://ui-avatars.com/api/?name=Diamond+User&background=8B5CF6&color=fff',
     role: 'Diamond Customer',
     membershipTier: 'Diamond',
     walletBalance: 8500000,
     loyaltyPoints: 2450,
     cashbackBalance: 1100000,
     orderCount: 18,
     wishlistCount: 8,
     cartCount: 2,
     notificationCount: 2,
   },
   {
     id: 'profile-premium-customer',
     name: 'رضا (Premium Customer)',
     email: 'premium@alinavigator.local',
     avatar: 'https://ui-avatars.com/api/?name=Premium+User&background=EC4899&color=fff',
     role: 'Premium Customer',
     membershipTier: 'Gold',
     walletBalance: 3200000,
     loyaltyPoints: 980,
     cashbackBalance: 450000,
     orderCount: 9,
     wishlistCount: 5,
     cartCount: 1,
     notificationCount: 1,
   },
   {
     id: 'profile-customer',
     name: 'امیر (Customer)',
     email: 'customer@alinavigator.local',
     avatar: 'https://ui-avatars.com/api/?name=Customer&background=3F3F46&color=fff',
     role: 'Customer',
     membershipTier: 'Bronze',
     walletBalance: 450000,
     loyaltyPoints: 120,
     cashbackBalance: 50000,
     orderCount: 3,
     wishlistCount: 2,
     cartCount: 1,
     notificationCount: 0,
   },
   {
     id: 'profile-seller',
     name: 'تیمور (Seller)',
     email: 'seller@alinavigator.local',
     avatar: 'https://ui-avatars.com/api/?name=Seller&background=10B981&color=fff',
     role: 'Seller',
     membershipTier: 'None',
     walletBalance: 25000000,
     loyaltyPoints: 0,
     cashbackBalance: 0,
     orderCount: 0,
     wishlistCount: 0,
     cartCount: 0,
     notificationCount: 8,
   },
   {
     id: 'profile-support-agent',
     name: 'مریم (Support Agent)',
     email: 'support@alinavigator.local',
     avatar: 'https://ui-avatars.com/api/?name=Support&background=F59E0B&color=fff',
     role: 'Support Agent',
     membershipTier: 'None',
     walletBalance: 0,
     loyaltyPoints: 0,
     cashbackBalance: 0,
     orderCount: 0,
     wishlistCount: 0,
     cartCount: 0,
     notificationCount: 14,
   },
   {
     id: 'profile-courier',
     name: 'نوید (Courier)',
     email: 'courier@alinavigator.local',
     avatar: 'https://ui-avatars.com/api/?name=Courier&background=0EA5E9&color=fff',
     role: 'Courier',
     membershipTier: 'None',
     walletBalance: 1200000,
     loyaltyPoints: 0,
     cashbackBalance: 0,
     orderCount: 0,
     wishlistCount: 0,
     cartCount: 0,
     notificationCount: 3,
   },
   {
     id: 'profile-guest',
     name: 'کاربر مهمان',
     email: 'guest@alinavigator.local',
     avatar: 'https://ui-avatars.com/api/?name=Guest&background=64748B&color=fff',
     role: 'Guest',
     membershipTier: 'None',
     walletBalance: 0,
     loyaltyPoints: 0,
     cashbackBalance: 0,
     orderCount: 0,
     wishlistCount: 0,
     cartCount: 0,
     notificationCount: 0,
   },
 ];