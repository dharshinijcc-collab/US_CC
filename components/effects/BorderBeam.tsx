'use client';

import React from 'react';

export default function BorderBeam({
  className = '',
  style = {},
  children
}) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}


