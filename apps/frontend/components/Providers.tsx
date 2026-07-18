'use client';

import React from 'react';
import { ContentProvider, useContent } from '@/context/ContentContext';
import { AdminProvider } from '@/context/AdminContext';
import AdminLoginModal from '@/components/pages/admin/AdminLoginModal';
import AdminSaveBar from '@/components/pages/admin/AdminSaveBar';
import ScrollReveal from '@/components/effects/ScrollReveal';
import GlobalCursorGlow from '@/components/effects/GlobalCursorGlow';
import { usePathname } from 'next/navigation';

function AdminWrapper({ children }: { children: React.ReactNode }) {
  const { content } = useContent();
  return (
    <AdminProvider initialContent={content}>
      <AdminLoginModal />
      <AdminSaveBar />
      {children}
    </AdminProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ContentProvider>
      <AdminWrapper>
        <ScrollReveal />
        <GlobalCursorGlow />
        <div key={pathname} className="page-fade-in">
          {children}
        </div>
      </AdminWrapper>
    </ContentProvider>
  );
}
