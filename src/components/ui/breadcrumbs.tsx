'use client';
import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm font-medium text-white/40 mb-6">
      <Link
        href="/"
        className="hover:text-white transition-colors duration-200 outline-none focus-visible:text-[rgb(var(--primary))]"
      >
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-1.5">
          <ChevronLeft className="w-3.5 h-3.5 text-white/20" />
          <Link
            href={item.href}
            className={`hover:text-white transition-colors duration-200 outline-none focus-visible:text-[rgb(var(--primary))] ${
              index === items.length - 1
                ? 'text-white/90 cursor-default pointer-events-none'
                : ''
            }`}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}
