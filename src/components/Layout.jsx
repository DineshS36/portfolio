import { useEffect, Suspense, lazy } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import Navbar from './Navbar';
import CustomCursor from './CustomCursor';
import usePageTransitions from '../hooks/usePageTransitions';
import { useLenis } from '../hooks/useLenis';

const ThreeStarfield = lazy(() => import('./ThreeStarfield'));
const ThreeBackground = lazy(() => import('./ThreeBackground'));

export default function Layout({ isPreloaderDone }) {
  useLenis();
  const location = useLocation();
  const isHeroPage = location.pathname === '/';
  
  const { hasNext, hasPrev } = usePageTransitions({ isActive: isPreloaderDone });

  // Manage visibility of backgrounds based on route
  useEffect(() => {
    if (!isPreloaderDone) return;

    const webglCanvas = document.getElementById('webgl-canvas');
    const bgOverlay = document.querySelector('.bg-overlay');
    const threeStarfield = document.getElementById('three-starfield-canvas');

    if (isHeroPage) {
      if (webglCanvas) gsap.to(webglCanvas, { opacity: 1, duration: 0.6, ease: 'power2.out' });
      if (bgOverlay) gsap.to(bgOverlay, { opacity: 1, duration: 0.6, ease: 'power2.out' });
      if (threeStarfield) gsap.to(threeStarfield, { opacity: 0, duration: 0.4, ease: 'power2.in' });
    } else {
      if (webglCanvas) gsap.to(webglCanvas, { opacity: 0, duration: 0.5, ease: 'power2.in' });
      if (bgOverlay) gsap.to(bgOverlay, { opacity: 0, duration: 0.5, ease: 'power2.in' });
      if (threeStarfield) gsap.to(threeStarfield, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    }
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname, isPreloaderDone, isHeroPage]);

  // Page entry animation and ScrollTrigger re-initialization when route changes
  useEffect(() => {
    if (!isPreloaderDone) return;
    
    // Animate page content in
    gsap.fromTo('.page-transition-wrapper',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'all' }
    );

    // Wait for the next tick so the DOM is fully rendered for the new route
    setTimeout(() => {
      ScrollTrigger.refresh();

      // Hero Elements (only run if on Hero page and elements exist)
      if (isHeroPage) {
        gsap.fromTo('.hero-elem',
          { y: 50, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.2, ease: 'power4.out', delay: 0.2 }
        );
      }

      // Staggered Scroll Reveal sections (About, Work content, etc)
      const reveals = gsap.utils.toArray('.gsap-reveal');
      reveals.forEach((elem) => {
        gsap.fromTo(elem,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: elem,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Staggered Work Card Reveals specifically for the Work page
      if (document.querySelector('#work')) {
        gsap.fromTo('.gsap-work-card',
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '#work',
              start: 'top 60%'
            }
          }
        );
      }
    }, 100);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [location.pathname, isPreloaderDone, isHeroPage]);

  return (
    <>
      <CustomCursor />
      <Suspense fallback={null}>
        <ThreeStarfield isHeroPage={isHeroPage} />
        <ThreeBackground isHeroPage={isHeroPage} />
      </Suspense>

      <Navbar isHeroPage={isHeroPage} />
      
      <main className="page-transition-wrapper" style={{ opacity: isPreloaderDone ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        {hasPrev && (
          <div className="scroll-hint scroll-hint-top font-mono text-gray">
            <span className="scroll-arrow">↑</span> Scroll up for previous section
          </div>
        )}
        
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
        
        {hasNext && (
          <div className="scroll-hint scroll-hint-bottom font-mono text-gray">
            Scroll down for next section <span className="scroll-arrow">↓</span>
          </div>
        )}
      </main>
    </>
  );
}
