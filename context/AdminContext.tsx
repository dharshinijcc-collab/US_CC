'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';

interface AdminContextType {
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  updateContent: (path: string, value: any) => Promise<void>;
  saveChanges: () => Promise<void>;
  fullContent: any;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children, initialContent }: { children: React.ReactNode, initialContent: any }) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [fullContent, setFullContent] = useState(initialContent);

  useEffect(() => {
    setFullContent(initialContent);
  }, [initialContent]);

  const updateContent = async (path: string, value: any) => {
    // path could be 'home.hero.title'
    const newContent = { ...fullContent };
    const keys = path.split('.');
    let current = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFullContent(newContent);
  };

  const saveChanges = async () => {
    try {
      const response = await api.post('/content/update', { payload: fullContent });
      if (response.data.status === 'success') {
        alert('Changes saved successfully!');
      } else {
        alert('Error saving changes: ' + response.data.payload);
      }
    } catch (err: any) {
      alert('Error saving changes: ' + err.message);
    }
  };

  return (
    <AdminContext.Provider value={{ isAdminMode, setIsAdminMode, updateContent, saveChanges, fullContent }}>
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
