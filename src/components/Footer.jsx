import React from 'react';
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

export default function Footer() {
  return (
    <footer>
      <div className="container footer-inner font-mono text-gray">
        <p>© 2026 BUILD WITH DINESH. All systems operational.</p>
        <div className="social-links uppercase">
          <ScrambleLink href="#" className="hoverable">Twitter</ScrambleLink>
          <ScrambleLink href="#" className="hoverable">Github</ScrambleLink>
          <ScrambleLink href="#" className="hoverable">LinkedIn</ScrambleLink>
        </div>
      </div>
    </footer>
  );
}
