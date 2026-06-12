import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Components
import Preloader from './components/Preloader';
import ScrollProgress from './components/ScrollProgress';
import ThreeBackground from './components/ThreeBackground';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Marquee from './components/Marquee';
import Work from './components/Work';
import Timeline from './components/Timeline';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  // Trigger GSAP animations only after Preloader finishes
  useEffect(() => {
    if (!loaded) return;

    // Refresh ScrollTrigger to ensure all layout offsets are correct
    ScrollTrigger.refresh();

    // 1. Hero Element Animations
    const tl = gsap.timeline();
    tl.fromTo('.hero-elem',
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.2, ease: 'power4.out', delay: 0.2 }
    );

    // 2. Staggered Scroll Reveal sections
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

    // 3. Staggered Work Card Reveals
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

    // Clean up all ScrollTriggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loaded]);

  return (
    <>
      {/* High-tech preloader */}
      <Preloader onLoaded={() => setLoaded(true)} />

      {/* Top Scroll progress bar */}
      <ScrollProgress />

      {/* Real-time Lunar Sync Cursor */}
      <CustomCursor />

      {/* Interactive 3D Background */}
      <ThreeBackground />

      {/* Main website page content */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      >
        <Navbar />
        <Hero />
        <About />
        <Marquee />
        <Work />
        <Timeline />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
