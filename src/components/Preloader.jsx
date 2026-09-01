import React, { useEffect, useState } from 'react';

const BOOT_LOGS = [
  { threshold: 0, text: 'INIT // ALLOCATING_QUANTUM_CORE' },
  { threshold: 20, text: 'SHADERS // COMPILING_SCHWARZSCHILD_KERNELS' },
  { threshold: 45, text: 'SYNAPSE // CALIBRATING_NEURAL_MATRIX' },
  { threshold: 72, text: 'CHAMBERS // SYNCHRONIZING_DIMENSIONS' },
  { threshold: 94, text: 'ONLINE // ALL_SYSTEMS_OPERATIONAL' },
];

export default function Preloader({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [statusLog, setStatusLog] = useState(BOOT_LOGS[0].text);
  const [isVisible, setIsVisible] = useState(true);
  const [isRendered, setIsRendered] = useState(true);

  useEffect(() => {
    // If the preloader has already run this session, skip it entirely.
    if (sessionStorage.getItem('preloaderDone') === 'true') {
      setIsVisible(false);
      setIsRendered(false);
      if (onLoaded) onLoaded();
      return;
    }

    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    const duration = 2500; // 2.5 second smooth sequence
    let animationFrameId;

    const update = (now) => {
      const t = Math.min((now - startTime) / duration, 1.0);
      const easedProgress = Math.min(100, Math.floor((1 - Math.pow(1 - t, 2.0)) * 100));
      setProgress(easedProgress);

      for (let i = BOOT_LOGS.length - 1; i >= 0; i--) {
        if (easedProgress >= BOOT_LOGS[i].threshold) {
          setStatusLog(BOOT_LOGS[i].text);
          break;
        }
      }

      if (t < 1.0) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            setIsRendered(false);
            document.body.style.overflow = 'auto'; // allow normal scrolling on pages
            document.body.style.overflowX = 'hidden';
            sessionStorage.setItem('preloaderDone', 'true');
            if (onLoaded) onLoaded();
          }, 800);
        }, 180);
      }
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onLoaded]);

  if (!isRendered) return null;

  return (
    <div
      id="preloader"
      className={!isVisible ? 'preloader-exit' : ''}
      role="status"
      style={!isVisible ? { opacity: 0, pointerEvents: 'none' } : {}}
    >
      <div className="preloader-hud">
        <div className="preloader-meta font-mono">
          <span>SYS.ID // DINESH.DEV</span>
          <span>FREQ // 2.40 GHz</span>
        </div>
        <div className="loader-text glitch-wrapper font-mono" data-text="INITIALIZING">
          INITIALIZING
        </div>
        <div className="loader-bar-bg">
          <div className="loader-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="preloader-footer font-mono">
          <span className="preloader-status-text">{statusLog}</span>
          <span className="preloader-pct">{String(progress).padStart(3, '0')}%</span>
        </div>
      </div>
    </div>
  );
}
