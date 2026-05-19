'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminSaveBar() {
  const { isAdminMode, setIsAdminMode, saveChanges } = useAdmin();

  if (!isAdminMode) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-4 bg-gray-900/90 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-col">
        <span className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">Editor Mode Active</span>
        <span className="text-white text-sm">You have unsaved changes</span>
      </div>
      
      <div className="h-8 w-px bg-white/10 mx-2" />

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsAdminMode(false)}
          className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
        >
          Exit
        </button>
        <button 
          onClick={saveChanges}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
}
