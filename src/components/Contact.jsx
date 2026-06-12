import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import useTextScramble from '../hooks/useTextScramble';

export default function Contact() {
  const contactBtnRef = useRef(null);

  const {
    displayText: btnText,
    onMouseEnter: btnEnter,
    onMouseLeave: btnLeave
  } = useTextScramble('System.Log("Contact_Me")');

  useEffect(() => {
    const btn = contactBtnRef.current;
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
    <section id="contact" className="container contact-section gsap-reveal">
      <h2 className="contact-title uppercase text-glow-intense">Initiate<br />Sequence.</h2>
      <p className="text-gray font-mono">Ready to construct something beyond the ordinary?</p>

      <a
        href="mailto:hello@example.com"
        ref={contactBtnRef}
        className="contact-btn hoverable"
        onMouseEnter={btnEnter}
        onMouseLeave={btnLeave}
      >
        <span style={{ position: 'relative', zIndex: 2 }}>{btnText}</span>
      </a>
    </section>
  );
}
