export function ProductSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 animate-pulse h-full">
      <div className="aspect-square w-full rounded-xl bg-white/5 mb-4"></div>
      <div className="h-3 w-1/3 bg-white/10 rounded mb-2"></div>
      <div className="h-5 w-4/5 bg-white/10 rounded mb-4"></div>
      <div className="h-4 w-1/4 bg-white/10 rounded mt-auto"></div>
    </div>
  );
}