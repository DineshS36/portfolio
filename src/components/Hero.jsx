import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const exploreBtnRef = useRef(null);

  useEffect(() => {
    const btn = exploreBtnRef.current;
    if (!btn) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <header className="container">
      <p className="hero-elem hero-subtitle font-mono text-gray uppercase">Welcome to the void</p>
      <h1 className="hero-elem hero-title-1 uppercase text-glow-intense glitch-wrapper" data-text="CREATIVE">
        CREATIVE
      </h1>
      <h1 className="hero-elem hero-title-2 uppercase">DEVELOPER</h1>
      
      <div className="hero-elem" style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <a 
          href="#work" 
          ref={exploreBtnRef} 
          className="explore-btn font-mono hoverable uppercase"
        >
          Explore
        </a>
        <a 
          href="/Dinesh-Resume.pdf" // Make sure your resume is in the public folder
          download="Dinesh-Resume.pdf"
          className="explore-btn font-mono hoverable uppercase" // Reusing the same class for consistent styling
        >
          Download Resume
        </a>
      </div>
      
      <div className="scroll-indicator">
        <div className="scroll-line">
          <div className="scroll-dot" />
        </div>
      </div>
    </header>
  );
}
