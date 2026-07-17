import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function Link({ href, children, className, style, ...props }: any) {
  // Convert standard Next.js href object or string to react-router to-string
  const to = typeof href === 'object' ? href.pathname : href;
  return (
    <RouterLink to={to || '/'} className={className} style={style} {...props}>
      {children}
    </RouterLink>
  );
}
