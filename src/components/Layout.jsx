import { useEffect, Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import Navbar from './Navbar';
import CustomCursor from './CustomCursor';
import usePageTransitions from '../hooks/usePageTransitions';
import { useLenis } from '../hooks/useLenis';

import ThreeStarfield from './ThreeStarfield';
import ThreeBackground from './ThreeBackground';

export default function Layout({ isPreloaderDone }) {
  useLenis();
  const navigate = useNavigate();
  const location = useLocation();
  const isHeroPage = location.pathname === '/';
  
  const { hasNext, nextRoute } = usePageTransitions({ isActive: isPreloaderDone });

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
      // Clean up only reveal triggers created here; child components manage their own triggers
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars && t.vars.trigger && t.vars.trigger !== '.quantum-rail-section' && !String(t.vars.trigger).includes('quantum')) {
          t.kill();
        }
      });
    };
  }, [location.pathname, isPreloaderDone, isHeroPage]);

  return (
    <>
      <CustomCursor />
      <ThreeStarfield isHeroPage={isHeroPage} />
      <ThreeBackground isHeroPage={isHeroPage} />

      <Navbar isHeroPage={isHeroPage} />
      
      <main className="page-transition-wrapper" style={{ opacity: isPreloaderDone ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
        
        {hasNext && nextRoute && (
          <button
            type="button"
            onClick={() => navigate(nextRoute)}
            className="scroll-hint scroll-hint-bottom font-mono text-gray hoverable"
            style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
          >
            Scroll down or click for next section ({nextRoute.slice(1)}) <span className="scroll-arrow">↓</span>
          </button>
        )}
      </main>
    </>
  );
}
