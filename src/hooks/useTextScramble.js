import { useState, useEffect, useRef } from 'react';

export default function useTextScramble(originalText, speed = 30) {
  const [displayText, setDisplayText] = useState(originalText);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const chars = '01XYZ_#$+-*[]{}/\\';

  const trigger = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        originalText
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '.') return char;
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= originalText.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 2;
    }, speed);
  };

  useEffect(() => {
    if (isHovered) {
      trigger();
    } else {
      clearInterval(intervalRef.current);
      setDisplayText(originalText);
    }
    return () => clearInterval(intervalRef.current);
  }, [isHovered, originalText]);

  return {
    displayText,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };
}
