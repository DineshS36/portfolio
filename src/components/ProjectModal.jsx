import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

export default function ProjectModal({
  open,
  onClose,
  project
}) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const galleryRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = project?.images ?? [];

  useEffect(() => {
    if (!open) return;
    // Defer to avoid synchronous state updates during effect execution
    requestAnimationFrame(() => setActiveIndex(0));
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

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
      tl.kill();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowLeft') setActiveIndex((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setActiveIndex((i) => Math.min(images.length - 1, i + 1));
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, images.length]);

  const onPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const onNext = () => setActiveIndex((i) => Math.min(images.length - 1, i + 1));

  const activeImage = images[activeIndex];

  // Subtle image transition on index change
  useEffect(() => {
    if (!open) return;
    if (!galleryRef.current) return;

    gsap.fromTo(
      galleryRef.current,
      { autoAlpha: 0.001, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }
    );
  }, [activeIndex, open]);

  const techStack = useMemo(() => project?.techStack ?? [], [project]);
  const features = useMemo(() => project?.features ?? project?.keyFeatures ?? [], [project]);

  const githubUrl = project?.githubUrl;
  const liveDemoUrl = project?.liveDemoUrl;

  if (!open || !project) return null;

  return (
    <div
      className="project-modal-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="project-modal-panel" ref={panelRef}>
        <div className="project-modal-header">
          <div>
            <p className="project-modal-tag font-mono uppercase">Project</p>
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

        <div className="project-modal-body">
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
            {project.description ? (
              <p className="project-modal-description text-gray">{project.description}</p>
            ) : null}

            {features?.length ? (
              <div className="project-modal-section">
                <p className="project-modal-section-title font-mono uppercase">Features</p>
                <ul className="project-modal-list">
                  {features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {techStack?.length ? (
              <div className="project-modal-section">
                <p className="project-modal-section-title font-mono uppercase">Tech Stack</p>
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
              {githubUrl ? (
                <a
                  className="project-modal-action-btn hoverable font-mono uppercase"
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              ) : null}

              {liveDemoUrl ? (
                <a
                  className="project-modal-action-btn hoverable font-mono uppercase"
                  href={liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
