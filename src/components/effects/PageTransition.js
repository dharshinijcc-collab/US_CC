import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitioning(true);
      // Wait for wipe down
      setTimeout(() => {
        setDisplayLocation(location);
        // Wipe up finishes automatically via CSS
        setTimeout(() => {
          setTransitioning(false);
        }, 500); // Wait for exit animation
      }, 400); // 400ms is duration of enter wipe
    }
  }, [location, displayLocation]);

  return (
    <>
      <div 
        className={`cc-page-wipe ${transitioning ? 'cc-wiping' : ''}`}
        style={{
          position: 'fixed',
          top: transitioning ? 0 : '-100vh',
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#0A0F1C',
          zIndex: 9999,
          transition: 'top 0.4s cubic-bezier(0.8, 0, 0.2, 1)',
          pointerEvents: transitioning ? 'all' : 'none'
        }}
      />
      {displayLocation.pathname === location.pathname ? children : null}
    </>
  );
}
