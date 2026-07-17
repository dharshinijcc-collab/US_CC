'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';

import localConfig from '@/shared/config.json';

interface ContentContextType {
  content: any;
  loading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  updateContent: (path: string, value: any) => Promise<void>;
  saveChanges: () => Promise<void>;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  saveMessage: string;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [savedContent, setSavedContent] = useState<any>(localConfig);
  const [draftContent, setDraftContent] = useState<any>(JSON.parse(JSON.stringify(localConfig)));
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const fetchContent = async () => {
    try {
      setLoading(true);
      console.log('Fetching content from:', api.defaults.baseURL + 'content');
      const response = await api.get('content');
      console.log('Content API response:', response.data);
      if (response.data.status === 'success') {
        if (!response.data.payload) {
          console.warn('Content fetched successfully but payload is empty');
        } else {
          setSavedContent(response.data.payload);
          setDraftContent(JSON.parse(JSON.stringify(response.data.payload)));
          setError(null);
        }
      } else {
        console.warn('Failed to fetch content, using static fallback:', response.data.payload);
      }
    } catch (err: any) {
      console.warn('Error fetching content from API, using static fallback:', err.message || err);
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
      // If draft isn't ready yet, initialise from savedContent so edits are never dropped
      const base = prevDraft ?? (savedContent ? JSON.parse(JSON.stringify(savedContent)) : {});
      const newDraft = JSON.parse(JSON.stringify(base));
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
    setSaveStatus('saving');
    setSaveMessage('Saving changes...');
    try {
      const response = await api.post('content/update', { payload: draftContent });
      if (response.data.status === 'success') {
        setSavedContent(JSON.parse(JSON.stringify(draftContent)));
        setSaveStatus('success');
        setSaveMessage('Changes saved successfully!');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setSaveMessage('Error saving: ' + response.data.payload);
        setTimeout(() => setSaveStatus('idle'), 4000);
      }
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMessage('Error saving: ' + err.message);
      setTimeout(() => setSaveStatus('idle'), 4000);
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
      saveChanges,
      saveStatus,
      saveMessage,
    }}>
      {children}
      {/* Non-blocking save toast */}
      {saveStatus !== 'idle' && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          padding: '12px 24px',
          borderRadius: '12px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          color: '#fff',
          background: saveStatus === 'success' ? '#10B981' : saveStatus === 'error' ? '#EF4444' : '#1E293B',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeInUp 0.3s ease',
          pointerEvents: 'none',
        }}>
          {saveStatus === 'saving' && <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />}
          {saveStatus === 'success' && '✓'}
          {saveStatus === 'error' && '✕'}
          {saveMessage}
        </div>
      )}
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
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
