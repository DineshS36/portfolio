import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
  const ticking = useRef(false);

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
          <div className="nav-links font-mono uppercase">
            {!isHeroPage && (
              <NavLink to="/" className="nav-link hoverable text-glow" onMouseEnter={playHoverSound} onClick={playClickSound}>Home</NavLink>
            )}
            <NavLink to="/about" className="nav-link hoverable text-glow" onMouseEnter={playHoverSound} onClick={playClickSound}>About</NavLink>
            <NavLink to="/work" className="nav-link hoverable text-glow" onMouseEnter={playHoverSound} onClick={playClickSound}>Work</NavLink>
            <NavLink to="/skills" className="nav-link hoverable text-glow" onMouseEnter={playHoverSound} onClick={playClickSound}>Skills</NavLink>
            <NavLink to="/contact" className="nav-link hoverable text-glow" onMouseEnter={playHoverSound} onClick={playClickSound}>Contact</NavLink>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => { toggleMute(); playClickSound(); }}
              onMouseEnter={playHoverSound}
              className="nav-link hoverable font-mono uppercase text-glow"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: 'inherit' }}
            >
              {isMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              )}
            </button>

            {!isHeroPage && (
              <a
                href="/Dinesh_Resume.pdf"
                onClick={(e) => { onResumeClick(e); playClickSound(); }}
                onMouseEnter={playHoverSound}
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
        </div>
      </nav>
    </>
  );
}
