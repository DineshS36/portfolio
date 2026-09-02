import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
function ConvexText({ text }) {
  if (!text) return null;
  const chars = Array.from(String(text));

  return (
    <span className="convex-word">
      {chars.map((char, i) => (
        <span key={i} className="convex-char">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

function NavLink({ to, children, className }) {
  return (
    <Link to={to} className={className}>
      <ConvexText text={children} />
    </Link>
  );
}

export default function Navbar({ isHeroPage }) {
  const [isHidden, setIsHidden] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    // If we're on the hero page, we might want it visible at top, hidden on scroll.
    // If not on hero page, keep it always visible.
    if (!isHeroPage) {
      setIsHidden(false);
      return;
    }

    const updateNavVisibility = () => {
      setIsHidden(window.scrollY > 120);
    };

    const handleScroll = () => {
      if (ticking.current) return;
      window.requestAnimationFrame(() => {
        updateNavVisibility();
        ticking.current = false;
      });
      ticking.current = true;
    };

    updateNavVisibility();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateNavVisibility);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateNavVisibility);
    };
  }, [isHeroPage]);

  const onResumeClick = (e) => {
    e.preventDefault();
    const href = '/Dinesh_Resume.pdf';
    try {
      const a = document.createElement('a');
      a.href = href;
      a.download = 'Dinesh_Resume.pdf';
      a.target = '_self';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      {/* 1. Top-Left Logo (Only visible on Hero page) */}
      <div
        className={`hero-logo ${!isHeroPage ? 'fade-out' : 'fade-in'}`}
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          zIndex: 1000,
          pointerEvents: isHeroPage ? 'auto' : 'none'
        }}
      >
        <Link
          to="/"
          className="logo hoverable text-glow"
          style={{ textDecoration: 'none', color: '#fff', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.1em' }}
        >
          <ConvexText text="DINESH" />
        </Link>
      </div>

      {/* 1.5 Top-Right Resume (Only visible on Hero page) */}
      <div
        className={`hero-logo ${!isHeroPage ? 'fade-out' : 'fade-in'}`}
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          zIndex: 1000,
          pointerEvents: isHeroPage ? 'auto' : 'none'
        }}
      >
        <a
          href="/Dinesh_Resume.pdf"
          onClick={onResumeClick}
          className="nav-link hoverable font-mono uppercase text-glow"
          aria-label="Download Resume"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            color: '#fff',
            fontSize: '1.35rem',
            fontWeight: 800,
            letterSpacing: '0.08em'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 3v10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 20h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <ConvexText text="Resume" />
        </a>
      </div>

      {/* 2. Glass Dock Navigation (Visible everywhere) */}
      <nav className={`dock-mode ${isHidden && isHeroPage ? 'nav-hidden' : 'nav-visible'}`}>
        <div className="container nav-inner">
          <div className="nav-links font-mono uppercase">
            {!isHeroPage && (
              <NavLink to="/" className="nav-link hoverable text-glow">Home</NavLink>
            )}
            <NavLink to="/about" className="nav-link hoverable text-glow">About</NavLink>
            <NavLink to="/work" className="nav-link hoverable text-glow">Work</NavLink>
            <NavLink to="/skills" className="nav-link hoverable text-glow">Skills</NavLink>
            <NavLink to="/contact" className="nav-link hoverable text-glow">Contact</NavLink>
          </div>

          {!isHeroPage && (
            <a
              href="/Dinesh_Resume.pdf"
              onClick={onResumeClick}
              className="nav-link hoverable font-mono uppercase text-glow"
              aria-label="Download Resume"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <ConvexText text="Resume" />
            </a>
          )}
        </div>
      </nav>
    </>
  );
}
