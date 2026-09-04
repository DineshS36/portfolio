import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAudio } from '../hooks/useAudio';

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

function NavLink({ to, children, className, onMouseEnter, onClick }) {
  return (
    <Link to={to} className={className} onMouseEnter={onMouseEnter} onClick={onClick}>
      <ConvexText text={children} />
    </Link>
  );
}

export default function Navbar({ isHeroPage }) {
  const { isMuted, toggleMute, playHoverSound, playClickSound } = useAudio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const ticking = useRef(false);

  // Close mobile drawer on route change (render-time adjustment per React 19 standards)
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Close on Escape key press
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    // If not on hero page, keep it always visible without attaching scroll listener.
    if (!isHeroPage) {
      return;
    }

    const updateNavVisibility = () => {
      setIsScrolled(window.scrollY > 120);
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

  const navRoutes = [
    { path: '/', label: 'Home', number: '01' },
    { path: '/about', label: 'About', number: '02' },
    { path: '/work', label: 'Work', number: '03' },
    { path: '/skills', label: 'Skills', number: '04' },
    { path: '/timeline', label: 'Timeline', number: '05' },
    { path: '/contact', label: 'Contact', number: '06' },
  ];

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
          onMouseEnter={playHoverSound}
          onClick={playClickSound}
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
          onClick={(e) => { onResumeClick(e); playClickSound(); }}
          onMouseEnter={playHoverSound}
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
      <nav className={`dock-mode ${isHeroPage && isScrolled ? 'nav-hidden' : 'nav-visible'}`}>
        <div className="container nav-inner">
          {/* Mobile brand badge inside dock */}
          <Link
            to="/"
            className="mobile-brand-link font-mono uppercase text-glow"
            onClick={() => { playClickSound(); setMobileMenuOpen(false); }}
          >
            Dinesh
          </Link>

          {/* Desktop Navigation Links */}
          <div className="nav-links font-mono uppercase">
            {!isHeroPage && (
              <NavLink to="/" className="nav-link hoverable text-glow" onMouseEnter={playHoverSound} onClick={playClickSound}>Home</NavLink>
            )}
            <NavLink to="/about" className="nav-link hoverable text-glow" onMouseEnter={playHoverSound} onClick={playClickSound}>About</NavLink>
            <NavLink to="/work" className="nav-link hoverable text-glow" onMouseEnter={playHoverSound} onClick={playClickSound}>Work</NavLink>
            <NavLink to="/skills" className="nav-link hoverable text-glow" onMouseEnter={playHoverSound} onClick={playClickSound}>Skills</NavLink>
            <NavLink to="/contact" className="nav-link hoverable text-glow" onMouseEnter={playHoverSound} onClick={playClickSound}>Contact</NavLink>
          </div>

          <div className="nav-actions">
            {/* Audio Toggle */}
            <button
              onClick={() => { toggleMute(); playClickSound(); }}
              onMouseEnter={playHoverSound}
              className="nav-link hoverable font-mono uppercase text-glow sound-btn"
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              )}
            </button>

            {/* Desktop Resume link */}
            {!isHeroPage && (
              <a
                href="/Dinesh_Resume.pdf"
                onClick={(e) => { onResumeClick(e); playClickSound(); }}
                onMouseEnter={playHoverSound}
                className="nav-link hoverable font-mono uppercase text-glow desktop-resume-link"
                aria-label="Download Resume"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <ConvexText text="Resume" />
              </a>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              className="mobile-menu-toggle hoverable"
              onClick={() => {
                setMobileMenuOpen(prev => !prev);
                playClickSound();
              }}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className={`hamburger-bar ${mobileMenuOpen ? 'open top' : ''}`} />
              <span className={`hamburger-bar ${mobileMenuOpen ? 'open bot' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Luxury Full-Screen Mobile Navigation Drawer */}
      <div
        className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        <div className="mobile-drawer-header font-mono">
          <span className="mobile-drawer-tag text-gray">// SEQUENCE NAVIGATION</span>
          <button
            type="button"
            className="mobile-drawer-close hoverable"
            onClick={() => { setMobileMenuOpen(false); playClickSound(); }}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        <div className="mobile-nav-links font-mono">
          {navRoutes.map((route) => {
            const isActive = location.pathname === route.path;
            return (
              <Link
                key={route.path}
                to={route.path}
                className={`mobile-nav-item hoverable ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  playClickSound();
                }}
              >
                <span className="mobile-nav-num text-gray">{route.number}</span>
                <span className="mobile-nav-label uppercase text-glow">{route.label}</span>
                {isActive && <span className="mobile-nav-indicator">●</span>}
              </Link>
            );
          })}
        </div>

        <div className="mobile-drawer-footer font-mono">
          <a
            href="/Dinesh_Resume.pdf"
            onClick={(e) => {
              onResumeClick(e);
              playClickSound();
              setMobileMenuOpen(false);
            }}
            className="mobile-resume-btn hoverable uppercase"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v10" />
              <path d="M8 11l4 4 4-4" />
              <path d="M4 20h16" />
            </svg>
            Download Resume (PDF)
          </a>

          <div className="mobile-footer-meta text-gray">
            <span>FULL STACK DEVELOPER & AIML</span>
            <span>PORTFOLIO v2.0</span>
          </div>
        </div>
      </div>
    </>
  );
}
