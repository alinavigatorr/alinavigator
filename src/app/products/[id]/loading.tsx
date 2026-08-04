import { Container } from "../../../components/ui/container";

export default function ProductDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen pt-32 pb-24">
      <Container>
        <div className="h-4 w-48 bg-white/5 rounded-full mb-10 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 mb-32">
          
          <div className="flex flex-col gap-5">
            <div className="aspect-square rounded-[var(--radius-lg)] bg-white/5 border border-white/5 animate-[pulse_3s_ease-in-out_infinite]"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square rounded-[var(--radius-md)] bg-white/5 border border-white/5 animate-[pulse_3s_ease-in-out_infinite]" style={{ animationDelay: `${i * 150}ms` }}></div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col pt-2">
            <div className="h-8 w-24 bg-white/5 rounded-full mb-6 animate-pulse"></div>
            <div className="h-12 w-3/4 bg-white/10 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-10 w-1/3 bg-[rgb(var(--primary))]/10 rounded-lg mb-10 animate-pulse"></div>
            
            <div className="h-14 w-full bg-white/5 rounded-full mb-8 animate-pulse"></div>
            <div className="h-24 w-full bg-white/5 rounded-2xl animate-pulse"></div>
          </div>
          
        </div>
      </Container>
    </div>
  );
}