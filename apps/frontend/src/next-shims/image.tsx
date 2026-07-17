import React from 'react';

export default function Image({ src, alt, width, height, className, fill, priority, ...props }: any) {
  const styles = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', objectFit: 'cover' } : {};
  return (
    <img
      src={src}
      alt={alt || ''}
      width={width}
      height={height}
      className={className}
      style={styles as any}
      loading={priority ? 'eager' : 'lazy'}
      {...props}
    />
  );
}
