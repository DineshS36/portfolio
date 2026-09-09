
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudio } from '../hooks/useAudio';

const categories = [
  {
    id: '01',
    tag: 'CORE UI ENGINEERING',
    title: 'Frontend & UI Craft (Hands-On)',
    summary: 'Responsive layouts, component structure, clean styling, and high-fidelity user experiences.',
    telemetry: '80% Proficiency • Pixel Precision',
    skills: ['HTML5', 'CSS3 Layouts', 'Tailwind CSS', 'Responsive UI', 'JavaScript Basics', 'React Basics']
  },
  {
    id: '02',
    tag: 'AI-AUGMENTED ENGINEERING',
    title: 'Generative AI & Prompt Design',
    summary: 'Architecting precision prompt schemas, directing LLMs for code synthesis, and sub-second streaming.',
    telemetry: 'Gemini API • Prompt Schemas',
    skills: ['Prompt Engineering', 'AI-Augmented Coding', 'Google Gemini API', 'Token Streaming', 'Code Synthesis', 'Rapid Sprints']
  },
  {
    id: '03',
    tag: 'SYSTEM ARCHITECTURE',
    title: 'System Design & Data Flows',
    summary: 'Decoupled presentation layers, client-server models, RESTful contracts, and WebSocket protocols.',
    telemetry: 'Decoupled Edge • Sub-85ms TTFB',
    skills: ['Decoupled Architecture', 'System Design', 'RESTful APIs', 'WebSocket Flows', 'Data Contracts', 'Authentication PKCE']
  },
  {
    id: '04',
    tag: 'EDGE & CLOUD RUNTIMES',
    title: 'Cloud & Edge Deployments',
    summary: 'Edge-distributed static hosting, continuous deployment, serverless edge workers, and DNS routing.',
    telemetry: 'Cloudflare Pages • Edge Workers',
    skills: ['Cloudflare Pages', 'Cloudflare Workers', 'Vercel', 'Git', 'GitHub', 'CI/CD Deployments']
  },
  {
    id: '05',
    tag: 'FRAMEWORKS DIRECTED WITH AI',
    title: 'Full-Stack Frameworks',
    summary: 'Frameworks architected and synthesized using modern AI-assisted engineering workflows.',
    telemetry: 'AI-Accelerated • Full Stack',
    skills: ['Next.js', 'Node.js', 'Express.js', 'Socket.io', 'MongoDB Atlas', 'PostgreSQL • Prisma']
  },
  {
    id: '06',
    tag: 'PROBLEM SOLVING CORE',
    title: 'Programming Foundations',
    summary: 'Foundational computer science principles, OOP concepts, algorithm basics, and schema comprehension.',
    telemetry: 'OOP Basics • Schema Design',
    skills: ['Java (OOP)', 'JavaScript Foundations', 'Python Basics', 'Database Concepts', 'Data Structures Basics']
  }
];

export default function Skills() {
  const { playHoverSound, playClickSound } = useAudio();
  const carouselStageRef = useRef(null);

  // Rotation angle in degrees (continuous auto-running motion)
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const angleRef = useRef(0);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);
  const lastActiveIndexRef = useRef(0);

  const totalCards = categories.length;
  const angleStep = 360 / totalCards; // 60 degrees between each card

  // Keep refs in sync
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Continuous auto-run animation loop
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isPausedRef.current && !isDraggingRef.current) {
        // Continuous running speed: ~20 degrees per second (smooth, lively ~18s full ring cycle)
        angleRef.current = (angleRef.current + delta * 20) % 360;
        setRotationAngle(angleRef.current);
      }

      // Calculate which card is closest to the front (cos(angle) is maximized at 0 / 360)
      let closestIdx = 0;
      let minDiff = 360;

      for (let i = 0; i < totalCards; i++) {
        let diff = ((i * angleStep - angleRef.current) % 360 + 360) % 360;
        if (diff > 180) diff = 360 - diff;
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }

      if (closestIdx !== lastActiveIndexRef.current) {
        lastActiveIndexRef.current = closestIdx;
        setActiveCardIndex(closestIdx);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [angleStep, totalCards]);

  // Rotate to specific card on click or nav button
  const rotateToCard = useCallback((index) => {
    playClickSound();
    const target = index * angleStep;
    angleRef.current = target;
    setRotationAngle(target);
    setActiveCardIndex(index);
  }, [angleStep, playClickSound]);

  // Interactive Drag / Swipe controls
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    startAngleRef.current = angleRef.current;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const deltaX = clientX - startXRef.current;
    angleRef.current = (startAngleRef.current - deltaX * 0.32 + 3600) % 360;
    setRotationAngle(angleRef.current);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Wheel interaction: scroll wheel rotates the 360 cylinder
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      e.preventDefault();
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      angleRef.current = (angleRef.current + delta * 0.2 + 3600) % 360;
      setRotationAngle(angleRef.current);
    }
  };

  return (
    <section id="skills" className="skills-page-section">
      {/* Header */}
      <div className="container gsap-reveal skills-header">
        <h2 className="section-title uppercase">
          <span className="text-dark-gray">3.</span> Core Capabilities
        </h2>
        <div className="divider" />
      </div>

      {/* 360-Degree Cylindrical Orbital Stage */}
      <div
        className="skills-orbital-viewport"
        ref={carouselStageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        role="region"
        aria-label="360 Degree Skills Carousel"
      >
        {/* Real Ring Mechanical / Holographic Tracks */}
        <div className="orbital-ambient-halo" />
        <div className="orbital-core-ring ring-top" />
        <div className="orbital-core-ring ring-mid" />

        <div className="skills-cylinder-stage">
          {categories.map((cat, index) => {
            // Angle in degrees relative to front
            const cardBaseAngle = index * angleStep;
            // Signed angle offset relative to 0 (-180 to +180)
            let diffDeg = ((cardBaseAngle - rotationAngle) % 360 + 360) % 360;
            if (diffDeg > 180) diffDeg -= 360;

            const rad = (diffDeg * Math.PI) / 180;
            const sinVal = Math.sin(rad);
            const cosVal = Math.cos(rad);

            // Normalized depth: 1.0 = absolute front, 0.0 = absolute back
            const depthFactor = (cosVal + 1) / 2;

            // Scale: Front is large (1.05x), shrinking smoothly towards sides & back (0.64x)
            const scale = 0.64 + depthFactor * 0.41;

            // Clarity & Depth Sorting:
            // Front cards (depthFactor >= 0.5) are 100% crystal clear with zero blur and full opacity
            // Back cards (depthFactor < 0.5) smoothly blur and dim into the background
            let blurAmount = 0;
            let opacity = 1;
            if (depthFactor < 0.5) {
              const backFactor = (0.5 - depthFactor) / 0.5; // 0.0 (sides) to 1.0 (deep back)
              blurAmount = backFactor * 4; // 0px to 4px blur only behind the ring
              opacity = 1 - backFactor * 0.65; // 1.0 down to 0.35 at deep back
            }

            // Z-Index: strictly sorted by depth
            const zIndex = Math.round(depthFactor * 100);

            // True curved 3D ring bend:
            // Tangent rotation along cylinder perimeter
            const rotateYDeg = -diffDeg * 0.85;

            const isFrontActive = index === activeCardIndex;

            return (
              <div
                key={cat.id}
                className={`skill-orbital-card hoverable ${isFrontActive ? 'active-front' : ''}`}
                style={{
                  '--card-sin': sinVal,
                  '--card-cos': cosVal,
                  '--card-rotate-y': `${rotateYDeg}deg`,
                  '--depth-scale': scale,
                  '--depth-opacity': opacity,
                  '--depth-blur': blurAmount > 0 ? `blur(${blurAmount.toFixed(1)}px)` : 'none',
                  zIndex
                }}
                onClick={() => rotateToCard(index)}
                onMouseEnter={() => {
                  setIsPaused(true);
                  playHoverSound();
                }}
                onMouseLeave={() => {
                  setIsPaused(false);
                }}
              >
                <div className="orbital-card-inner">
                  {/* Top Bar: Code Index & Tag */}
                  <div className="orbital-card-top font-mono">
                    <span className="skill-id-badge">{cat.id}</span>
                    <span className="skill-tag uppercase">{cat.tag}</span>
                  </div>

                  {/* Title & Core Summary */}
                  <h3 className="skill-card-title uppercase text-glow">{cat.title}</h3>
                  <p className="skill-card-summary text-gray">{cat.summary}</p>

                  {/* Live Running Telemetry Meter */}
                  <div className="orbital-telemetry-badge font-mono">
                    <span className="telemetry-icon">⚡</span>
                    <span className="telemetry-text">{cat.telemetry}</span>
                  </div>

                  {/* Skill Chips List */}
                  <ul className="skill-list font-mono">
                    {cat.skills.map((s) => (
                      <li key={s} className="skill-pill">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Orbit Floor Ambient Scanner Ring */}
        <div className="orbital-floor-grid" />
      </div>
    </section>
  );
}

