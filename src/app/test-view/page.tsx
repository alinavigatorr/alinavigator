'use client';

import React from 'react';
import { MembershipProvider } from '../../contexts/MembershipContext';
import { HistoryProvider } from '../../contexts/HistoryContext';
import { MockAuthProvider, useMockAuth } from '../../contexts/MockAuthContext';
import { DevUserSwitcher } from '../../components/dev/DevUserSwitcher';
import { MembershipOverview } from '../../components/dashboard/membership-overview';
import { Container } from '../../components/ui/container';

// یک کامپوننت میانی می‌سازیم تا بتواند آیدی کاربر انتخاب شده را بخواند
function TestViewCore() {
    const { currentUser } = useMockAuth();

    return (
        // آیدی کاربر به صورت داینامیک به کانتکست تاریخچه پاس داده می‌شود
        <HistoryProvider userId={currentUser.id}>
            <MembershipProvider>
                <div className="min-h-screen bg-black text-white py-12 relative">
                    <Container className="space-y-8">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                            <h1 className="text-2xl font-bold mb-2 text-indigo-400">
                                پنل پرمیوم باشگاه مشتریان (متصل به لاگین تستی)
                            </h1>
                            <p className="text-sm text-white/60">
                                از دکمه شناور پایین صفحه (تست اکانت) استفاده کنید تا بین کاربران مختلف جابه‌جا شوید و تغییرات را در داشبورد ببینید.
                            </p>
                        </div>
                        <MembershipOverview />
                    </Container>
                </div>

                {/* دکمه جادویی تغییر کاربر که فقط در محیط توسعه نمایش داده می‌شود */}
                <DevUserSwitcher />
            </MembershipProvider>
        </HistoryProvider>
    );
}

// کامپوننت اصلی که لایه لاگین تستی را به کل صفحه تزریق می‌کند
export default function TestViewPage() {
    return (
        <MockAuthProvider>
            <TestViewCore />
        </MockAuthProvider>
    );
}