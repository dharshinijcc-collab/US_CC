'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';

interface ContentContextType {
  content: any;
  loading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
          setContent(response.data.payload); 
          setError(null);
        }
      } else {
        setError(response.data.payload || 'Failed to fetch content');
      }
    } catch (err: any) {
      console.error('Error fetching content:', err);
      setError(err.message || 'An error occurred while fetching content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, error, refreshContent: fetchContent }}>
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
