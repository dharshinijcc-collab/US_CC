'use client';

import React, { useState, useRef } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface EditableImageProps {
  contentKey: string; // e.g. 'home.hero.image'
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  objectFit?: React.CSSProperties['objectFit'];
}

export default function EditableImage({ 
  contentKey, 
  src, 
  alt,
  className = '', 
  style,
  width,
  height,
  objectFit = 'cover'
}: EditableImageProps) {
  const { isAdminMode, updateContent } = useAdmin();
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (isAdminMode) {
      setIsEditing(true);
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        // Update the content with the new image
        await updateContent(contentKey, base64String);
        setCurrentSrc(base64String);
        setIsUploading(false);
        setIsEditing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
      setIsUploading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // If not in admin mode, just render normal image
  if (!isAdminMode) {
    return (
      <img 
        src={currentSrc} 
        alt={alt} 
        className={className} 
        style={{ ...style, width, height, objectFit }}
      />
    );
  }

  return (
    <div className="relative inline-block">
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} cursor-pointer hover:opacity-90 transition-opacity`}
        style={{ ...style, width, height, objectFit }}
        onClick={handleImageClick}
      />
      
      {/* Admin overlay */}
      {isAdminMode && (
        <div 
          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex flex-col items-center text-white">
            <ImageIcon size={32} />
            <span className="text-sm mt-2 font-medium">Click to edit</span>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Uploading overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
          <div className="text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <span className="text-sm mt-2 block">Uploading...</span>
          </div>
        </div>
      )}

      {/* Edit mode indicator */}
      {isEditing && (
        <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-lg flex items-center justify-center">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg">
            <Upload size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Select new image</span>
            <button
              onClick={handleCancelEdit}
              className="ml-2 p-1 hover:bg-gray-100 rounded"
            >
              <X size={14} className="text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
