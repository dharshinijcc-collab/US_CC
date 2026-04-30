'use client';

import React from 'react';
import { ContentProvider, useContent } from '@/context/ContentContext';
import { AdminProvider } from '@/context/AdminContext';
import AdminLoginModal from '@/components/admin/AdminLoginModal';
import AdminSaveBar from '@/components/admin/AdminSaveBar';
import ScrollReveal from '@/components/ScrollReveal';
import GlobalCursorGlow from '@/components/effects/GlobalCursorGlow';

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
  return (
    <ContentProvider>
      <AdminWrapper>
        <ScrollReveal />
        <GlobalCursorGlow />
        {children}
      </AdminWrapper>
    </ContentProvider>
  );
}
