import { useState, useEffect, useCallback, useRef } from 'react';

// Singleton audio context so it's shared across the app
let audioCtx = null;
let globalGain = null;

const initAudio = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
      globalGain = audioCtx.createGain();
      globalGain.gain.value = 0; // default muted until toggled
      globalGain.connect(audioCtx.destination);
    }
  }
};

export function useAudio() {
  const [isMuted, setIsMuted] = useState(true);
  
  // Track if user has interacted to allow audio context to start
  const initialized = useRef(false);

  useEffect(() => {
    // Only init after first user gesture to comply with browser autoplay policies
    const handleFirstInteraction = () => {
      if (!initialized.current) {
        initAudio();
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        initialized.current = true;
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
      }
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    setIsMuted(prev => {
      const next = !prev;
      if (globalGain) {
        // Smooth transition to avoid pops
        globalGain.gain.setTargetAtTime(next ? 0 : 0.3, audioCtx.currentTime, 0.05);
      }
      return next;
    });
  }, []);

  const playHoverSound = useCallback(() => {
    if (!audioCtx || isMuted || !globalGain) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(globalGain);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.1);
  }, [isMuted]);

  const playClickSound = useCallback(() => {
    if (!audioCtx || isMuted || !globalGain) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(globalGain);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.2);
  }, [isMuted]);

  return { isMuted, toggleMute, playHoverSound, playClickSound };
}
