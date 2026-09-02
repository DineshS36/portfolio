import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ROUTES = ['/', '/about', '/work', '/skills', '/timeline', '/contact'];
const COOLDOWN_MS = 1500;

export default function usePageTransitions({ isActive }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isNavigating = useRef(false);
  const touchStartY = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const navigateTo = (direction) => {
      if (isNavigating.current) return;

      const currentIndex = ROUTES.indexOf(location.pathname);
      if (currentIndex === -1) return;

      let nextIndex = -1;
      
      if (direction === 'next' && currentIndex < ROUTES.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (direction === 'prev' && currentIndex > 0) {
        nextIndex = currentIndex - 1;
      }

      if (nextIndex !== -1) {
        isNavigating.current = true;
        navigate(ROUTES[nextIndex]);
        
        // Cooldown to prevent rapid multi-page skipping
        setTimeout(() => {
          isNavigating.current = false;
        }, COOLDOWN_MS);
      }
    };

    const handleWheel = (e) => {
      if (isNavigating.current) return;

      const isScrollUp = e.deltaY < 0;
      const isScrollDown = e.deltaY > 0;

      // Check if we are at the top of the page
      if (isScrollUp && window.scrollY <= 5) {
        navigateTo('prev');
      }

      // Check if we are at the bottom of the page
      const atBottom = window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 5;
      if (isScrollDown && atBottom) {
        navigateTo('next');
      }
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isNavigating.current || touchStartY.current === null) return;

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      const isScrollUp = deltaY < -20; // significant swipe down (scroll up)
      const isScrollDown = deltaY > 20; // significant swipe up (scroll down)

      if (isScrollUp && window.scrollY <= 5) {
        navigateTo('prev');
        touchStartY.current = null; // reset to prevent multiple triggers
      }

      const atBottom = window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 5;
      if (isScrollDown && atBottom) {
        navigateTo('next');
        touchStartY.current = null;
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
    };

    // Use passive: false to theoretically prevent default if we wanted to hijack, 
    // but passive: true is better for performance since we aren't calling e.preventDefault().
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isActive, location.pathname, navigate]);

  // Expose the route index if we want to display progress or UI hints
  const currentIndex = ROUTES.indexOf(location.pathname);
  return {
    currentIndex,
    hasPrev: currentIndex > 0,
    hasNext: currentIndex !== -1 && currentIndex < ROUTES.length - 1,
    prevRoute: currentIndex > 0 ? ROUTES[currentIndex - 1] : null,
    nextRoute: currentIndex < ROUTES.length - 1 ? ROUTES[currentIndex + 1] : null
  };
}
