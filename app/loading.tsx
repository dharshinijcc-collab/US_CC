import React from 'react';

export default function RootLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F5F9] font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}} />
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        Loading premium experience...
      </p>
    </div>
  );
}
