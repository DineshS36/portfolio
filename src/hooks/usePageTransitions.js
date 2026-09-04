import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ROUTES = ['/', '/about', '/work', '/skills', '/timeline', '/contact'];
const COOLDOWN_MS = 1200;
const WHEEL_INTENT_THRESHOLD = 260; // Deliberate sustained scroll against boundary
const TOUCH_INTENT_THRESHOLD = 90;  // Deliberate swipe against boundary

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
      const atTop = scrollY <= 5;
      const atBottom =
        window.innerHeight + Math.round(scrollY) >= document.documentElement.scrollHeight - 5;

      // On the Hero page, single intentional scroll down moves to about
      if (isHero && e.deltaY > 60) {
        navigateTo('next');
        return;
      }

      // If user is inside content (not at edges), reset accumulator immediately
      if (!atTop && !atBottom) {
        wheelDeltaAccumulator.current = 0;
        return;
      }

      // If at top and scrolling down, or at bottom and scrolling up, reset
      if (atTop && e.deltaY > 0) {
        wheelDeltaAccumulator.current = 0;
        return;
      }
      if (atBottom && e.deltaY < 0) {
        wheelDeltaAccumulator.current = 0;
        return;
      }

      // Debounced reset of accumulated delta if user stops scrolling
      clearTimeout(wheelResetTimer.current);
      wheelResetTimer.current = setTimeout(() => {
        wheelDeltaAccumulator.current = 0;
      }, 350);

      // Accumulate boundary pull
      wheelDeltaAccumulator.current += e.deltaY;

      if (atTop && wheelDeltaAccumulator.current <= -WHEEL_INTENT_THRESHOLD) {
        navigateTo('prev');
      } else if (atBottom && wheelDeltaAccumulator.current >= WHEEL_INTENT_THRESHOLD) {
        navigateTo('next');
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
      const atTop = scrollY <= 5;
      const atBottom =
        window.innerHeight + Math.round(scrollY) >= document.documentElement.scrollHeight - 5;

      // Hero swipe down
      if (isHero && deltaY > 50) {
        navigateTo('next');
        touchStartY.current = null;
        return;
      }

      // Require deliberate, strong pull while resting at boundary
      if (atTop && deltaY < -TOUCH_INTENT_THRESHOLD) {
        navigateTo('prev');
        touchStartY.current = null;
      } else if (atBottom && deltaY > TOUCH_INTENT_THRESHOLD) {
        navigateTo('next');
        touchStartY.current = null;
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
