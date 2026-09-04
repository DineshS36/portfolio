import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // --- Real-time Moon Phase Calculator ---
    const updateMoonCursor = () => {
      const lunarCycle = 2551443; // Lunar cycle in seconds (~29.53 days)
      const newMoonDate = new Date('2000-01-06T12:24:01').getTime() / 1000;
      const now = new Date().getTime() / 1000;
      
      // Calculate current phase (0.0 to 1.0)
      const phase = ((now - newMoonDate) % lunarCycle) / lunarCycle; 

      const shadow = phase < 0.5
        ? `inset ${phase * 40}px 0 0 #fff`
        : `inset -${(1 - phase) * 40}px 0 0 #fff`;
      
      cursor.style.setProperty('--moon-shadow', shadow);
    };

    updateMoonCursor();
    const interval = setInterval(updateMoonCursor, 3600000); // Recalculate every hour

    // Mouse movement tracker
    const handleMouseMove = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';

      // Check if mouse is hovering over an element with 'hoverable' class
      const target = e.target;
      if (target && (target.classList.contains('hoverable') || target.closest('.hoverable'))) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      id="cursor" 
      ref={cursorRef} 
      className={isHovered ? 'hovered' : ''} 
      style={{
        boxShadow: 'var(--moon-shadow, none)'
      }}
    />
  );
}
