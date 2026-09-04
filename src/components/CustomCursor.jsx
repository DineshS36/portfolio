import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Skip if on a device without a fine pointing device (e.g. touchscreens)
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    // Hardware-accelerated GPU translation via GSAP quickTo (0% layout thrashing)
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: -100,
      y: -100,
      opacity: 0
    });

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.12, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.12, ease: 'power3.out' });

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

    let isVisible = false;

    // Mouse movement tracker
    const handleMouseMove = (e) => {
      if (!isVisible) {
        gsap.set(cursor, { opacity: 1 });
        isVisible = true;
      }

      xTo(e.clientX);
      yTo(e.clientY);

      // Check if mouse is hovering over an element with 'hoverable' class
      const target = e.target;
      if (target && (target.classList.contains('hoverable') || target.closest('.hoverable'))) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
      isVisible = false;
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
      isVisible = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
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
