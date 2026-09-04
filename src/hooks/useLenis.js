import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let globalLenis = null;

export function getLenis() {
  return globalLenis;
}

export function stopLenis() {
  if (globalLenis) {
    globalLenis.stop();
  }
}

export function startLenis() {
  if (globalLenis) {
    globalLenis.start();
  }
}

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    globalLenis = lenis;
    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    // Synchronize Lenis with GSAP's ticker
    const update = (time) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (globalLenis === lenis) {
        globalLenis = null;
        window.__lenis = null;
      }
      lenis.destroy();
      gsap.ticker.remove(update);
    };
  }, []);
}
