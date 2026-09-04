import { useState, useEffect, useRef, useCallback } from 'react';

export default function useTextScramble(originalText, speed = 30) {
  const [displayText, setDisplayText] = useState(originalText);
  const intervalRef = useRef(null);

  const chars = '01XYZ_#$+-*[]{}/\\';

  const trigger = useCallback(() => {
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
  }, [originalText, speed, chars]);

  const onMouseEnter = useCallback(() => {
    trigger();
  }, [trigger]);

  const onMouseLeave = useCallback(() => {
    clearInterval(intervalRef.current);
    setDisplayText(originalText);
  }, [originalText]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return {
    displayText,
    onMouseEnter,
    onMouseLeave,
  };
}
