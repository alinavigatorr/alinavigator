export interface WishlistItem {
  id: string; // شناسه یکتای رابطه
  productId: string;
  wishlistId: string;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  userId?: string; // اگر undefined باشد یعنی کاربر Guest است
  isDefault: boolean;
  name: string; // برای پشتیبانی از چند لیست در آینده (مثلاً "قطعات ماشین")
  items: WishlistItem[];
}

/**
 * فونداسیون سرویس علاقه‌مندی‌ها
 * در این فاز صرفاً معماری تعریف شده و داده‌ها با LocalStorage سینک می‌شوند.
 */
export const wishlistService = {
  // این متدها در فازهای بعدی برای ارتباط با API واقعی استفاده خواهند شد
  async syncGuestToUser(guestItems: string[], userId: string): Promise<boolean> {
    console.debug('[Wishlist Service] Syncing local items to DB for user:', userId);
    return true;
  },

  async fetchUserWishlists(userId: string): Promise<Wishlist[]> {
    console.debug('[Wishlist Service] Fetching wishlists for:', userId);
    return [];
  }
};