import { useEffect, useState } from 'react';

export default function Preloader({ onLoaded }) {
  const isAlreadyDone = typeof window !== 'undefined' && sessionStorage.getItem('preloaderDone') === 'true';
  const [progress, setProgress] = useState(isAlreadyDone ? 100 : 0);
  const [isVisible, setIsVisible] = useState(!isAlreadyDone);
  const [isRendered, setIsRendered] = useState(!isAlreadyDone);

  useEffect(() => {
    // If the preloader has already run this session, skip it entirely.
    if (isAlreadyDone) {
      if (onLoaded) onLoaded();
      return;
    }

    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    const duration = 2500; // Exact 2.5 seconds smooth linear sequence
    let animationFrameId;

    const update = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(Math.max(elapsed / duration, 0), 1.0);
      
      // Linear count 0 to 100%
      const currentProgress = Math.min(100, Math.floor(t * 100));
      setProgress(currentProgress);

      if (t < 1.0) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        setProgress(100);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            sessionStorage.setItem('preloaderDone', 'true');
            setIsRendered(false);
            document.body.style.overflow = 'auto';
            document.body.style.overflowX = 'hidden';
            if (onLoaded) onLoaded();
          }, 600);
        }, 200);
      }
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onLoaded, isAlreadyDone]);

  if (!isRendered) return null;

  return (
    <div
      id="preloader"
      className={!isVisible ? 'preloader-exit' : ''}
      role="status"
      style={!isVisible ? { opacity: 0, pointerEvents: 'none' } : {}}
    >
      <div className="preloader-hud">
        <div className="loader-text font-mono">
          INITIALIZING
        </div>
        <div className="loader-bar-bg">
          <div className="loader-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="preloader-footer font-mono" style={{ justifyContent: 'center', marginTop: '1rem' }}>
          <span className="preloader-pct">{String(progress).padStart(3, '0')}%</span>
        </div>
      </div>
    </div>
  );
}

