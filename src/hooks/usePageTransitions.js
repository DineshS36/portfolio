import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ROUTES = ['/', '/about', '/work', '/skills', '/contact'];
const COOLDOWN_MS = 900;
const WHEEL_INTENT_THRESHOLD = 160; // Responsive, deliberate pull against boundary
const TOUCH_INTENT_THRESHOLD = 60;  // Clean swipe against boundary

export default function usePageTransitions({ isActive }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isNavigating = useRef(false);
  const touchStartY = useRef(null);
  const wheelDeltaAccumulator = useRef(0);
  const wheelResetTimer = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const isModalOrMenuOpen = () => {
      return (
        document.querySelector('.project-modal-overlay') !== null ||
        document.querySelector('.mobile-nav-drawer.open') !== null ||
        document.body.style.overflow === 'hidden'
      );
    };

    const navigateTo = (direction) => {
      if (isNavigating.current || isModalOrMenuOpen()) return;

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
        wheelDeltaAccumulator.current = 0;
        navigate(ROUTES[nextIndex]);

        setTimeout(() => {
          isNavigating.current = false;
        }, COOLDOWN_MS);
      }
    };

    const handleWheel = (e) => {
      if (isNavigating.current || isModalOrMenuOpen()) return;

      const isHero = location.pathname === '/';
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const hasOverflow = scrollHeight > clientHeight + 15;

      const atTop = scrollY <= 8;
      const atBottom = clientHeight + Math.round(scrollY) >= scrollHeight - 8;

      // On Hero page, single intentional scroll down moves to about
      if (isHero && e.deltaY > 50) {
        navigateTo('next');
        return;
      }

      // If page has scrollable content and user is in the middle of it, allow native scroll
      if (hasOverflow && !atTop && !atBottom) {
        wheelDeltaAccumulator.current = 0;
        return;
      }

      // Scrolling Down
      if (e.deltaY > 0) {
        // If there's overflow and we are at top (moving into page content), let native scroll handle it
        if (hasOverflow && atTop && !atBottom) {
          wheelDeltaAccumulator.current = 0;
          return;
        }

        // At bottom or page fits on screen without overflow: accumulate pull towards next section
        if (atBottom || !hasOverflow) {
          clearTimeout(wheelResetTimer.current);
          wheelResetTimer.current = setTimeout(() => {
            wheelDeltaAccumulator.current = 0;
          }, 350);

          wheelDeltaAccumulator.current += e.deltaY;
          if (wheelDeltaAccumulator.current >= WHEEL_INTENT_THRESHOLD) {
            navigateTo('next');
          }
        }
      }

      // Scrolling Up
      if (e.deltaY < 0) {
        // If there's overflow and we are at bottom (moving up into page content), let native scroll handle it
        if (hasOverflow && atBottom && !atTop) {
          wheelDeltaAccumulator.current = 0;
          return;
        }

        // At top or page fits on screen without overflow: accumulate pull towards previous section
        if (atTop || !hasOverflow) {
          clearTimeout(wheelResetTimer.current);
          wheelResetTimer.current = setTimeout(() => {
            wheelDeltaAccumulator.current = 0;
          }, 350);

          wheelDeltaAccumulator.current += e.deltaY;
          if (wheelDeltaAccumulator.current <= -WHEEL_INTENT_THRESHOLD) {
            navigateTo('prev');
          }
        }
      }
    };

    const handleTouchStart = (e) => {
      if (isModalOrMenuOpen()) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isNavigating.current || touchStartY.current === null || isModalOrMenuOpen()) return;

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchEndY; // Positive = swiping up (scrolling down)

      const isHero = location.pathname === '/';
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const hasOverflow = scrollHeight > clientHeight + 15;

      const atTop = scrollY <= 8;
      const atBottom = clientHeight + Math.round(scrollY) >= scrollHeight - 8;

      // Hero swipe down
      if (isHero && deltaY > 50) {
        navigateTo('next');
        touchStartY.current = null;
        return;
      }

      // Swiping up (pulling down towards next section)
      if (deltaY > TOUCH_INTENT_THRESHOLD && (atBottom || !hasOverflow)) {
        navigateTo('next');
        touchStartY.current = null;
        return;
      }

      // Swiping down (pulling up towards previous section)
      if (deltaY < -TOUCH_INTENT_THRESHOLD && (atTop || !hasOverflow)) {
        navigateTo('prev');
        touchStartY.current = null;
        return;
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      clearTimeout(wheelResetTimer.current);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isActive, location.pathname, navigate]);

  const currentIndex = ROUTES.indexOf(location.pathname);
  return {
    currentIndex,
    hasPrev: currentIndex > 0,
    hasNext: currentIndex !== -1 && currentIndex < ROUTES.length - 1,
    prevRoute: currentIndex > 0 ? ROUTES[currentIndex - 1] : null,
    nextRoute: currentIndex < ROUTES.length - 1 ? ROUTES[currentIndex + 1] : null
  };
}
