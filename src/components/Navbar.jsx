import useTextScramble from '../hooks/useTextScramble';

function ScrambleLink({ href, children, className }) {
  const { displayText, onMouseEnter, onMouseLeave } = useTextScramble(children);
  return (
    <a 
      href={href} 
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {displayText}
    </a>
  );
}

export default function Navbar() {
  const { displayText: logoText, onMouseEnter: logoEnter, onMouseLeave: logoLeave } = useTextScramble('DINESH');

  const onResumeClick = (e) => {
    e.preventDefault();
    const href = '/Dinesh_Resume.pdf';

    // Try download first
    try {
      const a = document.createElement('a');
      a.href = href;
      a.download = 'Dinesh_Resume.pdf';
      a.target = '_self';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      // Fallback: open in new tab
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <nav>
      <div className="container nav-inner">
        <a
          href="#"
          className="logo hoverable"
          onMouseEnter={logoEnter}
          onMouseLeave={logoLeave}
        >
          {logoText}
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div className="nav-links font-mono uppercase">
            <ScrambleLink href="#about" className="nav-link hoverable">About</ScrambleLink>
            <ScrambleLink href="#work" className="nav-link hoverable">Work</ScrambleLink>
            <ScrambleLink href="#contact" className="nav-link hoverable">Contact</ScrambleLink>
          </div>

          <a
            href="/Dinesh_Resume.pdf"
            onClick={onResumeClick}
            className="nav-link hoverable font-mono uppercase"
            aria-label="Download Resume"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
}
