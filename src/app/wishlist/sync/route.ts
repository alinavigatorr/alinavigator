import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { localItems } = body; // آیدی‌هایی که کاربر موقع مهمان بودن انتخاب کرده

    // در اینجا باید شناسه کاربر را از توکن در بیاورید (مثلاً با NextAuth یا jwt)
    // const userId = getUserIdFromRequest(request);

    // ۱. خواندن علاقه‌مندی‌های قبلی کاربر از دیتابیس (MongoDB/Postgres و غیره)
    const dbItems = ['p1', 'p3']; // این یک دیتای فرضی از دیتابیس است

    // ۲. مرج کردن و حذف موارد تکراری (Set)
    const mergedSet = new Set([...dbItems, ...(localItems || [])]);
    const mergedItems = Array.from(mergedSet);

    // ۳. ذخیره آرایه جدید در دیتابیس برای این یوزر
    // await db.user.update({ where: { id: userId }, data: { wishlist: mergedItems } });

    // ۴. برگرداندن دیتای مرج شده به کلاینت
    return NextResponse.json({ success: true, mergedItems });
    
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطا در سرور' }, { status: 500 });
  }
}