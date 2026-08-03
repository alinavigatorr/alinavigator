import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/navbar";
import { SearchProvider } from "../contexts/SearchContext";
import { SearchOverlay } from "../components/search/search-overlay";
import { WishlistProvider } from "../contexts/WishlistContext";
import { RecentlyViewedProvider } from "../contexts/RecentlyViewedContext";

// ایمپورت‌های مربوط به سیستم سبد خرید (اسپرینت ۱۲)
import { CartProvider } from "../contexts/CartContext";
import { MiniCart } from "../components/cart/mini-cart";

// ایمپورت مربوط به سیستم وفاداری و اشتراک (اسپرینت ۲۶)
import { MembershipProvider } from "../contexts/MembershipContext";

// ایمپورت سیستم احراز هویت
import { AuthProvider } from "../contexts/AuthContext"; // مسیر دقیق بر اساس پوشه contexts شما

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className={`${vazirmatn.variable} font-sans min-h-screen bg-background text-foreground flex flex-col`}>

        {/* کپسوله‌سازی کل اپلیکیشن با Providerها شامل AuthProvider */}
        <AuthProvider>
          <MembershipProvider>
            <CartProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                  <SearchProvider>

                    <Navbar />

                    <main className="flex-1">
                      {children}
                    </main>

                    {/* لایه‌های Overlays (مودال‌ها و دراورها) */}
                    <SearchOverlay />
                    <MiniCart />

                  </SearchProvider>
                </RecentlyViewedProvider>
              </WishlistProvider>
            </CartProvider>
          </MembershipProvider>
        </AuthProvider>

      </body>
    </html>
  );
}