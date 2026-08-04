'use client';

import React from 'react';
import { ProtectedRoute } from '../../components/auth/protected-route';
import { DashboardSidebar } from '../../components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '../../components/dashboard/dashboard-header';
import { BottomNav } from '../../components/dashboard/bottom-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-transparent relative">
        
        {/* Desktop / Tablet Sidebar */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
          
          {/* Top Header */}
          <DashboardHeader />
          
          {/* Dynamic Page Content */}
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
          
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
        
      </div>
    </ProtectedRoute>
  );
}