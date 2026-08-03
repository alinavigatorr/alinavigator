'use client';

import { Container } from "../../../components/ui/container";
import { Button } from "../../../components/ui/button";

export default function ProductError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
      <Container className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-[rgb(var(--error))] mb-4">خطا در بارگذاری محصول</h2>
        <p className="text-[rgb(var(--text-muted))] mb-8">مشکلی در دریافت اطلاعات این محصول به وجود آمده است.</p>
        <Button onClick={() => reset()} variant="outline" className="w-full">تلاش مجدد</Button>
      </Container>
    </div>
  );
}