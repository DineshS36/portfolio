import React, { useEffect, Suspense, lazy } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from './Navbar';
import CustomCursor from './CustomCursor';
import StarfieldBackground from './StarfieldBackground';

const ThreeBackground = lazy(() => import('./ThreeBackground'));

export default function Layout({ isPreloaderDone }) {
  const location = useLocation();
  const isHeroPage = location.pathname === '/';

  // Manage visibility of backgrounds based on route
  useEffect(() => {
    if (!isPreloaderDone) return;

    const webglCanvas = document.getElementById('webgl-canvas');
    const bgOverlay = document.querySelector('.bg-overlay');
    const starfield = document.getElementById('starfield-canvas');

    if (isHeroPage) {
      if (webglCanvas) gsap.to(webglCanvas, { opacity: 1, duration: 0.6, ease: 'power2.out' });
      if (bgOverlay) gsap.to(bgOverlay, { opacity: 1, duration: 0.6, ease: 'power2.out' });
      if (starfield) gsap.to(starfield, { opacity: 0, duration: 0.4, ease: 'power2.in' });
    } else {
      if (webglCanvas) gsap.to(webglCanvas, { opacity: 0, duration: 0.5, ease: 'power2.in' });
      if (bgOverlay) gsap.to(bgOverlay, { opacity: 0, duration: 0.5, ease: 'power2.in' });
      if (starfield) gsap.to(starfield, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    }
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname, isPreloaderDone, isHeroPage]);

  // Page entry animation when route changes
  useEffect(() => {
    if (!isPreloaderDone) return;
    
    gsap.fromTo('.page-transition-wrapper',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'all' }
    );
  }, [location.pathname, isPreloaderDone]);

  return (
    <>
      <CustomCursor />
      <StarfieldBackground />
      
      <Suspense fallback={null}>
        <ThreeBackground isHeroPage={isHeroPage} />
      </Suspense>

      <Navbar isHeroPage={isHeroPage} />
      
      <main className="page-transition-wrapper" style={{ opacity: isPreloaderDone ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        <Outlet />
      </main>
    </>
  );
}
