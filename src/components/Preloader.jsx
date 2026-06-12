import React, { useEffect, useState } from 'react';

export default function Preloader({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isRendered, setIsRendered] = useState(true);

  useEffect(() => {
    // Lock scroll on mount
    document.body.style.overflow = 'hidden';

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 20) + 10;
        if (next >= 100) {
          clearInterval(interval);
          
          // Complete load sequence
          setTimeout(() => {
            setIsVisible(false); // trigger fade out
            setTimeout(() => {
              setIsRendered(false); // remove from DOM
              document.body.style.overflow = 'auto';
              document.body.style.overflowX = 'hidden';
              if (onLoaded) onLoaded(); // trigger parent animations
            }, 1000);
          }, 500);

          return 100;
        }
        return next;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = 'auto';
      document.body.style.overflowX = 'hidden';
    };
  }, [onLoaded]);

  if (!isRendered) return null;

  return (
    <div 
      id="preloader" 
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'all' : 'none'
      }}
    >
      <div className="loader-text glitch-wrapper" data-text="INITIALIZING">
        INITIALIZING
      </div>
      <div className="loader-bar-bg">
        <div 
          className="loader-bar" 
          id="loader-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
