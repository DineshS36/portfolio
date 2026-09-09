import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAudio } from '../hooks/useAudio';
import {
  WebArchitectureCanvas,
  ChatUpSocketStreamCanvas,
  RoastingAITokenStreamCanvas,
  EdgeResumeATSParserCanvas
} from './TimelineVisualizers';

export default function Timeline() {
  const { playHoverSound, playClickSound } = useAudio();
  const [activeEpochIndex, setActiveEpochIndex] = useState(0);

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const epochs = [
    {
      epoch: '01',
      date: 'DEC 2025 – MAR 2026',
      stageLabel: 'STAGE 01',
      category: 'THE SPARK',
      dockLabel: 'FOUNDATIONS',
      title: 'Web Foundations & Core Logic',
      headline: 'HTML5, CSS3 & Programming Basics',
      summary:
        'Started exploring programming logic and web development in December 2025. Mastered core frontend structure with HTML5, CSS3, and modern CSS, while building foundational problem-solving skills in Java, JavaScript, and Python.',
      metrics: [
        { label: 'Timeline', value: 'Dec 2025 – Mar 2026' },
        { label: 'Focus', value: 'Web Foundations' },
        { label: 'Core Tools', value: 'HTML, CSS & Java' }
      ],
      techStack: ['HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript', 'Java', 'Git'],
      Visualizer: WebArchitectureCanvas
    },
    {
      epoch: '02',
      date: '2026 • JUNE (5-DAY SPRINT)',
      stageLabel: 'STAGE 02',
      category: 'REAL-TIME SPRINT',
      dockLabel: '5-DAY SPRINT',
      title: 'ChatUp: Real-Time Messaging App',
      headline: 'Architected & Shipped in 5 Days',
      summary:
        'Architected and delivered ChatUp in an intensive 5-day build sprint in June 2026. Designed the full-duplex WebSocket architecture and MongoDB schemas, directing AI code generation to implement Socket.io channels with sub-25ms response times.',
      metrics: [
        { label: 'Sprint Speed', value: '5 Days (June 2026)' },
        { label: 'Latency', value: '< 25ms Ping' },
        { label: 'Architecture', value: 'Socket.io + MongoDB' }
      ],
      techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'JWT'],
      Visualizer: ChatUpSocketStreamCanvas
    },
    {
      epoch: '03',
      date: '2026 • JUNE (3-DAY SPRINT)',
      stageLabel: 'STAGE 03',
      category: 'APPLIED GENAI SPRINT',
      dockLabel: '3-DAY SPRINT',
      title: 'Roasting AI: LLM Generator',
      headline: 'Engineered & Shipped in 3 Days',
      summary:
        'Engineered and deployed Roasting AI in a rapid 3-day sprint in June 2026. Structured multi-shot comedic prompt schemas for Google Gemini API, implemented streaming token responses in React, and built resilient fallback logic for instant comedic roasts.',
      metrics: [
        { label: 'Sprint Speed', value: '3 Days (June 2026)' },
        { label: 'AI Engine', value: 'Google Gemini API' },
        { label: 'Stream Speed', value: '< 540ms TTFB' }
      ],
      techStack: ['React.js', 'Node.js', 'Gemini API', '@google/generative-ai', 'Tailwind CSS'],
      Visualizer: RoastingAITokenStreamCanvas
    },
    {
      epoch: '04',
      date: '2026 • PRODUCTION SAAS',
      stageLabel: 'STAGE 04',
      category: 'CLOUD & EDGE SAAS',
      dockLabel: 'PROD SAAS',
      title: 'AI Resume Builder & Cloudflare Edge',
      headline: 'Decoupled Next.js SaaS & OAuth 2.0',
      summary:
        'Architected and shipped an edge-deployed SaaS platform in 2026. Decoupled the Next.js presentation layer on Cloudflare Pages from an Express/PostgreSQL backend API, securing auth via Google OAuth 2.0 PKCE and directing Gemini AI for real-time ATS resume scoring.',
      metrics: [
        { label: 'Edge TTFB', value: '< 85ms Latency' },
        { label: 'Security', value: 'Google OAuth 2.0' },
        { label: 'Deployment', value: 'Cloudflare Pages' }
      ],
      techStack: ['Next.js', 'Cloudflare Pages', 'PostgreSQL', 'Prisma', 'Google OAuth 2.0', 'Express.js'],
      Visualizer: EdgeResumeATSParserCanvas
    }
  ];

  // Glide track smoothly when active epoch index changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    gsap.to(track, {
      xPercent: -100 * activeEpochIndex,
      duration: 0.65,
      ease: 'power3.out'
    });
  }, [activeEpochIndex]);

  // Clean up wheel timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard Arrow navigation for rapid accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        if (activeEpochIndex < epochs.length - 1) {
          playClickSound();
          setActiveEpochIndex(prev => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeEpochIndex > 0) {
          playClickSound();
          setActiveEpochIndex(prev => prev - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEpochIndex, epochs.length, playClickSound]);

  // Controlled, throttled wheel handler with boundary pass-through
  const handleWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 45) return;

    if (isScrollingRef.current) return;

    if (delta > 45) {
      // Advance to next epoch
      if (activeEpochIndex < epochs.length - 1) {
        e.preventDefault();
        isScrollingRef.current = true;
        playClickSound();
        setActiveEpochIndex(prev => prev + 1);
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 650);
      }
      // If on the last card, do NOT preventDefault: allow natural page scroll to next section
    } else if (delta < -45) {
      // Return to previous epoch
      if (activeEpochIndex > 0) {
        e.preventDefault();
        isScrollingRef.current = true;
        playClickSound();
        setActiveEpochIndex(prev => prev - 1);
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 650);
      }
      // If on the first card, do NOT preventDefault: allow natural page scroll to previous section
    }
  };

  const handleNext = () => {
    if (activeEpochIndex < epochs.length - 1) {
      playClickSound();
      setActiveEpochIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeEpochIndex > 0) {
      playClickSound();
      setActiveEpochIndex(prev => prev - 1);
    }
  };

  return (
    <section ref={containerRef} className="container timeline-section" id="experience">
      {/* Aligned Section Header matching #about, #work, #skills */}
      <div className="timeline-header">
        <div className="gsap-reveal">
          <h2 className="section-title uppercase">
            Engineering Journey
          </h2>
          <div className="divider" />
        </div>
        <div className="timeline-header-meta font-mono">
          <div className="timeline-meta-pill">
            <span className="meta-pulse-dot" />
            <span className="meta-pill-text">2025 – 2026 JOURNEY</span>
          </div>
          <div className="timeline-jump-strip">
            {epochs.map((ep, i) => (
              <button
                key={ep.epoch}
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveEpochIndex(i);
                }}
                onMouseEnter={playHoverSound}
                className={`timeline-jump-pill hoverable ${activeEpochIndex === i ? 'is-active' : ''}`}
                aria-label={`Jump to stage 0${i + 1}`}
              >
                0{i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Stage Slider with Side Navigation Arrows */}
      <div className="timeline-stage-wrapper">
        <button
          type="button"
          className="timeline-side-arrow timeline-arrow-prev hoverable font-mono"
          onClick={handlePrev}
          disabled={activeEpochIndex === 0}
          aria-label="Previous phase"
        >
          ‹
        </button>

        <div className="timeline-carousel-shell" onWheel={handleWheel}>
          <div ref={trackRef} className="timeline-cards-track">
          {epochs.map((item, idx) => {
            const Visualizer = item.Visualizer;
            const isActive = activeEpochIndex === idx;

            return (
              <div
                key={item.epoch}
                className={`timeline-card-slide ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => {
                  if (!isActive) playHoverSound();
                }}
              >
                {/* Stage Container Card */}
                <div className="timeline-stage-card hoverable">
                  {/* Left Pane: Narrative & Technical Telemetry */}
                  <div className="timeline-narrative-pane">
                    <div className="stage-topbar font-mono">
                      <div className="stage-topbar-left">
                        <span className="stage-badge uppercase">{item.category}</span>
                        <span className="stage-date uppercase">{item.date}</span>
                      </div>
                      <span className="stage-step-tag text-gray">{item.stageLabel}</span>
                    </div>

                    <div className="stage-title-wrap">
                      <h3 className="stage-title uppercase text-glow">{item.title}</h3>
                      <div className="stage-headline font-mono text-gray uppercase">{item.headline}</div>
                    </div>

                    <p className="stage-summary text-gray">{item.summary}</p>

                    {/* Telemetry Metrics Grid */}
                    <div className="stage-metrics-grid font-mono">
                      {item.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="stage-metric-box">
                          <span className="metric-lbl text-gray">{m.label}</span>
                          <span className="metric-val">{m.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Pills matching .skill-pill */}
                    <div className="stage-tech-pills font-mono">
                      {item.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="stage-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Pane: Live Animated Simulation */}
                  <div className="timeline-simulation-pane">
                    <div className="terminal-topbar font-mono">
                      <div className="terminal-dots">
                        <span className="t-dot" />
                        <span className="t-dot" />
                        <span className="t-dot" />
                      </div>
                      <span className="terminal-title uppercase">SIMULATION • STAGE {item.epoch}</span>
                    </div>

                    <div className="terminal-canvas-wrapper">
                      <Visualizer />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>

        <button
          type="button"
          className="timeline-side-arrow timeline-arrow-next hoverable font-mono"
          onClick={handleNext}
          disabled={activeEpochIndex === epochs.length - 1}
          aria-label="Next phase"
        >
          ›
        </button>
      </div>
    </section>
  );
}
