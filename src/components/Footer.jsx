import React from 'react';
import useTextScramble from '../hooks/useTextScramble';

function ScrambleLink({ href, children, className, ...props }) {
  const { displayText, onMouseEnter, onMouseLeave } = useTextScramble(children);
  return (
    <a 
      href={href} 
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
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
          <ScrambleLink href="https://github.com/DineshS36" className="hoverable" target="_blank" rel="noopener noreferrer">Github</ScrambleLink>
          <ScrambleLink href="https://www.linkedin.com/in/dinesh-s-173698390" className="hoverable" target="_blank" rel="noopener noreferrer">LinkedIn</ScrambleLink>
          <ScrambleLink href="https://wa.me/919345380487" className="hoverable" target="_blank" rel="noopener noreferrer">WhatsApp</ScrambleLink>
        </div>
      </div>
    </footer>
  );
}
