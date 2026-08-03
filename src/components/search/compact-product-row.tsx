import React from 'react';
import Link from 'next/link';

interface CompactProductRowProps {
  id: string;
  title: string;
  price: string;
  category: string;
  searchQuery?: string;
  isActive?: boolean;
  onClick?: () => void;
}

function HighlightMatch({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="text-[rgb(var(--primary))] font-bold bg-[rgb(var(--primary))]/10 rounded-sm px-[2px]">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function CompactProductRow({ id, title, price, category, searchQuery, isActive, onClick }: CompactProductRowProps) {
  return (
    <Link
      href={`/products/${id}`}
      onClick={onClick}
      role="option"
      aria-selected={isActive}
      tabIndex={-1}
      className={`flex items-center gap-4 p-3 sm:p-3.5 rounded-[var(--radius-md)] transition-all duration-300 group cursor-pointer border outline-none ${
        isActive 
          ? 'bg-white/10 border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)]' 
          : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
      }`}
    >
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[var(--radius-sm)] flex-shrink-0 flex items-center justify-center overflow-hidden transition-colors ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
        <span className="text-[10px] text-white/40 font-medium tracking-widest">IMG</span>
      </div>
      
      <div className="flex flex-col flex-grow justify-center">
        <span className={`text-sm sm:text-base transition-colors line-clamp-1 ${isActive ? 'text-white font-bold' : 'text-[rgb(var(--text-primary))] font-medium group-hover:text-white'}`}>
          <HighlightMatch text={title} query={searchQuery} />
        </span>
        <span className="text-xs text-[rgb(var(--text-muted))] mt-1 font-medium">{category}</span>
      </div>
      
      <div className={`text-sm sm:text-base flex-shrink-0 transition-colors flex items-baseline gap-1 ${isActive ? 'text-white font-bold' : 'text-[rgb(var(--text-primary))] font-semibold'}`}>
        {price} <span className="text-[10px] font-normal text-white/40">تومان</span>
      </div>
    </Link>
  );
}