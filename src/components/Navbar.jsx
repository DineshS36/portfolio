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

export default function Navbar() {
  const { displayText: logoText, onMouseEnter: logoEnter, onMouseLeave: logoLeave } = useTextScramble('DINESH');

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
        <div className="nav-links font-mono uppercase">
          <ScrambleLink href="#about" className="nav-link hoverable">About</ScrambleLink>
          <ScrambleLink href="#work" className="nav-link hoverable">Work</ScrambleLink>
          <ScrambleLink href="#contact" className="nav-link hoverable">Contact</ScrambleLink>
        </div>
      </div>
    </nav>
  );
}
