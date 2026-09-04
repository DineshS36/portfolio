import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { stopLenis, startLenis } from '../hooks/useLenis';

export default function ProjectModal({ open, onClose, project }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const galleryRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'architecture' | 'prototype'
  const [prototypeDevice, setPrototypeDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const images = project?.images ?? [];

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      setActiveIndex(0);
      setActiveTab('overview');
      setPrototypeDevice('desktop');
      setIframeLoaded(false);
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stopLenis();

    const tl = gsap.timeline();
    tl.set(overlayRef.current, { autoAlpha: 0 });
    tl.set(panelRef.current, { y: 24, autoAlpha: 0, scale: 0.98 });

    tl.to(overlayRef.current, {
      autoAlpha: 1,
      duration: 0.22,
      ease: 'power2.out'
    });

    tl.to(panelRef.current, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.38,
      ease: 'power3.out'
    }, '-=0.08');

    return () => {
      document.body.style.overflow = prevOverflow;
      startLenis();
      tl.kill();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (activeTab === 'overview') {
        if (e.key === 'ArrowLeft') setActiveIndex((i) => Math.max(0, i - 1));
        if (e.key === 'ArrowRight') setActiveIndex((i) => Math.min(images.length - 1, i + 1));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, images.length, activeTab]);

  const onPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const onNext = () => setActiveIndex((i) => Math.min(images.length - 1, i + 1));

  const activeImage = images[activeIndex];

  useEffect(() => {
    if (!open || !galleryRef.current) return;
    gsap.fromTo(
      galleryRef.current,
      { autoAlpha: 0.001, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }
    );
  }, [activeIndex, open]);

  const techStack = useMemo(() => project?.techStack ?? [], [project]);
  const features = useMemo(() => project?.features ?? project?.keyFeatures ?? [], [project]);
  const architectureFlow = useMemo(() => project?.architectureFlow ?? [], [project]);
  const architectureDetails = useMemo(() => project?.architectureDetails ?? [], [project]);
  const metrics = useMemo(() => project?.metrics ?? [], [project]);

  const githubUrl = project?.githubUrl;
  const liveDemoUrl = project?.liveDemoUrl || project?.exploreUrl;
  const exploreUrl = project?.exploreUrl || project?.liveDemoUrl;

  if (!open || !project) return null;

  return createPortal(
    <div
      className="project-modal-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="project-modal-panel"
        ref={panelRef}
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="project-modal-header">
          <div>
            <p className="project-modal-tag font-mono uppercase">
              {project.category || 'Case Study // Production System'}
            </p>
            <h3 className="project-modal-title text-glow-intense uppercase">{project.title}</h3>
            {project.tagline ? (
              <p className="project-modal-subtitle text-gray">{project.tagline}</p>
            ) : null}
          </div>

          <button
            className="project-modal-close hoverable"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Editorial Case Study Navigation Tab Bar */}
        <div className="project-modal-tab-bar font-mono">
          <button
            type="button"
            className={`project-modal-tab-btn hoverable ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="tab-number">01</span>
            <span className="tab-label">OVERVIEW & GALLERY</span>
          </button>
          <button
            type="button"
            className={`project-modal-tab-btn hoverable ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <span className="tab-number">02</span>
            <span className="tab-label">SYSTEM ARCHITECTURE</span>
          </button>
          <button
            type="button"
            className={`project-modal-tab-btn hoverable ${activeTab === 'prototype' ? 'active' : ''}`}
            onClick={() => setActiveTab('prototype')}
          >
            <span className="tab-number">03</span>
            <span className="tab-label">LIVE PROTOTYPE</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & GALLERY */}
        {activeTab === 'overview' && (
          <div className="project-modal-body" data-lenis-prevent="true">
            <div className="project-modal-gallery">
              <div className="project-modal-gallery-main">
                <img
                  ref={galleryRef}
                  src={activeImage}
                  alt={`${project.title} screenshot ${activeIndex + 1}`}
                  className="project-modal-image"
                />
                {images.length > 1 ? (
                  <>
                    <button
                      className="project-modal-nav-btn hoverable"
                      onClick={onPrev}
                      disabled={activeIndex === 0}
                      type="button"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      className="project-modal-nav-btn hoverable"
                      onClick={onNext}
                      disabled={activeIndex === images.length - 1}
                      type="button"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                ) : null}
              </div>

              {images.length > 1 ? (
                <div className="project-modal-thumbs">
                  {images.map((src, idx) => (
                    <button
                      key={src}
                      type="button"
                      className={`project-modal-thumb hoverable ${idx === activeIndex ? 'active' : ''}`}
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Show image ${idx + 1}`}
                    >
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="project-modal-content">
              {project.problem && (
                <div className="case-study-callout-card">
                  <div className="callout-header font-mono uppercase">
                    <span className="callout-glow-dot"></span> The Engineering Challenge
                  </div>
                  <p className="callout-text">{project.problem}</p>
                </div>
              )}

              {project.description ? (
                <p className="project-modal-description text-gray">{project.description}</p>
              ) : null}

              {features?.length ? (
                <div className="project-modal-section">
                  <p className="project-modal-section-title font-mono uppercase">Core Capabilities</p>
                  <ul className="project-modal-list">
                    {features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {techStack?.length ? (
                <div className="project-modal-section">
                  <p className="project-modal-section-title font-mono uppercase">Technologies & Tools</p>
                  <div className="project-modal-pills">
                    {techStack.map((t) => (
                      <span key={t} className="project-modal-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="project-modal-actions">
                {liveDemoUrl && liveDemoUrl !== '#' && (
                  <a
                    className="project-modal-action-btn hoverable font-mono uppercase primary-btn"
                    href={liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Launch Live App ↗
                  </a>
                )}

                {githubUrl ? (
                  <a
                    className="project-modal-action-btn hoverable font-mono uppercase"
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub Repo
                  </a>
                ) : null}

                <button
                  type="button"
                  className="project-modal-action-btn hoverable font-mono uppercase secondary-btn"
                  onClick={() => setActiveTab('architecture')}
                >
                  View Architecture →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SYSTEM ARCHITECTURE & DEEP DIVE */}
        {activeTab === 'architecture' && (
          <div className="project-modal-architecture-body" data-lenis-prevent="true">
            {/* 1. Interactive Visual Pipeline Diagram */}
            <div className="case-study-section">
              <div className="case-study-section-header">
                <span className="section-badge font-mono uppercase">01 // Pipeline Flow</span>
                <h4 className="case-study-heading">Decoupled Distributed Architecture</h4>
                <p className="case-study-subheading text-gray">
                  Data flow and security boundary isolation from edge network delivery down to asynchronous processing models.
                </p>
              </div>

              {architectureFlow.length > 0 && (
                <div className="architecture-pipeline-grid" data-lenis-prevent="true">
                  {architectureFlow.map((node, i) => (
                    <div key={node.step} className="architecture-node-wrapper">
                      <div className="architecture-node-card">
                        <div className="node-step font-mono">{node.step}</div>
                        <h5 className="node-title uppercase font-mono">{node.title}</h5>
                        <div className="node-tech-badge font-mono">{node.tech}</div>
                        <p className="node-desc text-gray">{node.desc}</p>
                      </div>
                      {i < architectureFlow.length - 1 && (
                        <div className="architecture-connector" aria-hidden="true">
                          <span className="connector-pulse"></span>
                          <span className="connector-arrow">→</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Key Technical Decisions */}
            <div className="case-study-section">
              <div className="case-study-section-header">
                <span className="section-badge font-mono uppercase">02 // Engineering Strategy</span>
                <h4 className="case-study-heading">Architectural Decisions & Trade-Offs</h4>
              </div>

              <div className="architecture-decisions-grid">
                {architectureDetails.length > 0 ? (
                  architectureDetails.map((item) => (
                    <div key={item.title} className="decision-card">
                      <div className="decision-card-icon font-mono">✦</div>
                      <h5 className="decision-card-title uppercase font-mono">{item.title}</h5>
                      <p className="decision-card-desc text-gray">{item.desc}</p>
                    </div>
                  ))
                ) : (
                  <div className="decision-card">
                    <h5 className="decision-card-title uppercase font-mono">Decoupled Client & Microservice Boundary</h5>
                    <p className="decision-card-desc text-gray">
                      Separated static presentation assets from data parsing APIs, reducing bundle sizes and optimizing client TTFB.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Verified Performance & Reliability Metrics */}
            {metrics.length > 0 && (
              <div className="case-study-section">
                <div className="case-study-section-header">
                  <span className="section-badge font-mono uppercase">03 // Verification</span>
                  <h4 className="case-study-heading">Observed System Benchmarks</h4>
                </div>

                <div className="metrics-tiles-grid">
                  {metrics.map((m) => (
                    <div key={m.label} className="metric-tile">
                      <div className="metric-value font-mono text-glow-intense">{m.value}</div>
                      <div className="metric-label font-mono uppercase text-gray">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE PROTOTYPE EMBED & INTERACTIVE DEVICE FRAME */}
        {activeTab === 'prototype' && (
          <div className="project-modal-prototype-body" data-lenis-prevent="true">
            {/* Luxury Browser Mockup Chrome */}
            <div className="prototype-browser-bar font-mono">
              <div className="browser-dots" aria-hidden="true">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>

              <div className="browser-address-bar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="lock-icon" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span className="address-text">{exploreUrl || 'https://production-preview.internal'}</span>
              </div>

              <div className="prototype-controls">
                <button
                  type="button"
                  className={`device-toggle-btn hoverable ${prototypeDevice === 'desktop' ? 'active' : ''}`}
                  onClick={() => setPrototypeDevice('desktop')}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  className={`device-toggle-btn hoverable ${prototypeDevice === 'mobile' ? 'active' : ''}`}
                  onClick={() => setPrototypeDevice('mobile')}
                >
                  Mobile (390px)
                </button>
                {exploreUrl && (
                  <a
                    href={exploreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="launch-external-btn hoverable"
                    title="Open live site in new tab"
                  >
                    ↗ Open Tab
                  </a>
                )}
              </div>
            </div>

            {/* Prototype Canvas Viewport */}
            <div className={`prototype-viewport-container device-${prototypeDevice}`}>
              {exploreUrl && exploreUrl !== '#' ? (
                <>
                  {!iframeLoaded && (
                    <div className="prototype-loading-overlay font-mono">
                      <div className="prototype-spinner"></div>
                      <span>Connecting to secure live preview...</span>
                    </div>
                  )}
                  <iframe
                    src={exploreUrl}
                    title={`${project.title} Live Prototype`}
                    className="prototype-iframe"
                    onLoad={() => setIframeLoaded(true)}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                </>
              ) : (
                <div className="prototype-empty-state">
                  <p className="font-mono uppercase text-gray">Production environment undergoing private deployment.</p>
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="project-modal-action-btn hoverable font-mono uppercase"
                    >
                      Inspect Source on GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
