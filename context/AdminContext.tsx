'use client';

import React, { createContext, useContext } from 'react';
import { useContent } from './ContentContext';

interface AdminContextType {
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  updateContent: (path: string, value: any) => Promise<void>;
  saveChanges: () => Promise<void>;
  fullContent: any;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode, initialContent: any }) {
  const { isAdminMode, setIsAdminMode, updateContent, saveChanges, content } = useContent();

  return (
    <AdminContext.Provider value={{ 
      isAdminMode, 
      setIsAdminMode, 
      updateContent, 
      saveChanges, 
      fullContent: content 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
