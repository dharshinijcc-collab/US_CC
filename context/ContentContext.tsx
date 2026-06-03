'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';

interface ContentContextType {
  content: any;
  loading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  updateContent: (path: string, value: any) => Promise<void>;
  saveChanges: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [savedContent, setSavedContent] = useState<any>(null);
  const [draftContent, setDraftContent] = useState<any>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      console.log('Fetching content from:', api.defaults.baseURL + 'content');
      const response = await api.get('content');
      console.log('Content API response:', response.data);
      if (response.data.status === 'success') {
        if (!response.data.payload) {
          console.warn('Content fetched successfully but payload is empty');
          setError('Content payload is empty. Please seed the database.');
        } else {
          setSavedContent(response.data.payload);
          setDraftContent(JSON.parse(JSON.stringify(response.data.payload)));
          setError(null);
        }
      } else {
        setError(response.data.payload || 'Failed to fetch content');
      }
    } catch (err: any) {
      console.error('Error fetching content:', err);
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('API request timed out. The server may be slow or unavailable. Please try again.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your internet connection and ensure the backend server is running.');
      } else {
        setError(err.message || 'An error occurred while fetching content');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Delay the fetch to ensure chunk loads first
    const timer = setTimeout(() => {
      fetchContent();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const updateContent = async (path: string, value: any) => {
    setDraftContent((prevDraft: any) => {
      if (!prevDraft) return prevDraft;
      const newDraft = JSON.parse(JSON.stringify(prevDraft));
      const keys = path.split('.');
      let current = newDraft;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newDraft;
    });
  };

  const saveChanges = async () => {
    if (!draftContent) return;
    try {
      const response = await api.post('content/update', { payload: draftContent });
      if (response.data.status === 'success') {
        setSavedContent(JSON.parse(JSON.stringify(draftContent)));
        alert('Changes saved successfully!');
      } else {
        alert('Error saving changes: ' + response.data.payload);
      }
    } catch (err: any) {
      alert('Error saving changes: ' + err.message);
    }
  };

  const handleSetIsAdminMode = (val: boolean) => {
    setIsAdminMode(val);
    if (!val) {
      // Discard changes when exiting admin mode
      setDraftContent(JSON.parse(JSON.stringify(savedContent)));
    }
  };

  const activeContent = isAdminMode ? draftContent : savedContent;

  return (
    <ContentContext.Provider value={{ 
      content: activeContent, 
      loading, 
      error, 
      refreshContent: fetchContent,
      isAdminMode,
      setIsAdminMode: handleSetIsAdminMode,
      updateContent,
      saveChanges
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
