import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export default function HeroGlobeButton() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const coreRef = useRef(null);
  const navigate = useNavigate();

  // 1. Quantum Holographic Wireframe Globe on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const size = 150;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const radius = 54;
    const centerX = size / 2;
    const centerY = size / 2;

    let rotY = 0;
    let rotX = 0.35; // Slight tilt
    let targetSpeed = 0.009;
    let currentSpeed = 0.009;

    // Generate latitude / longitude ring points for wireframe sphere
    const rings = [];
    const latCount = 7;
    const lonCount = 8;
    const pointsPerRing = 48;

    // Latitudes (horizontal rings)
    for (let i = 1; i < latCount; i++) {
      const phi = (Math.PI * i) / latCount - Math.PI / 2; // -PI/2 to PI/2
      const r = radius * Math.cos(phi);
      const y = radius * Math.sin(phi);
      const ringPts = [];
      for (let j = 0; j < pointsPerRing; j++) {
        const theta = (Math.PI * 2 * j) / pointsPerRing;
        ringPts.push({
          x: r * Math.cos(theta),
          y: y,
          z: r * Math.sin(theta)
        });
      }
      rings.push(ringPts);
    }

    // Longitudes (vertical meridians)
    for (let i = 0; i < lonCount; i++) {
      const theta = (Math.PI * i) / lonCount;
      const meridianPts = [];
      for (let j = 0; j < pointsPerRing; j++) {
        const phi = (Math.PI * 2 * j) / pointsPerRing;
        meridianPts.push({
          x: radius * Math.sin(phi) * Math.cos(theta),
          y: radius * Math.cos(phi),
          z: radius * Math.sin(phi) * Math.sin(theta)
        });
      }
      rings.push(meridianPts);
    }

    // Equator nodes / pulsar satellites
    const satelliteNodes = [
      { theta: 0, phi: 0, speed: 0.02 },
      { theta: Math.PI / 2, phi: 0.4, speed: -0.025 },
      { theta: Math.PI, phi: -0.3, speed: 0.018 },
      { theta: (3 * Math.PI) / 2, phi: 0.2, speed: -0.015 }
    ];

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Smooth acceleration on hover
      currentSpeed += (targetSpeed - currentSpeed) * 0.08;
      rotY += currentSpeed;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Render wireframe rings
      rings.forEach((ring, rIdx) => {
        ctx.beginPath();
        let first = true;

        for (let i = 0; i < ring.length; i++) {
          const pt = ring[i];

          // Rotate Y
          const x1 = pt.x * cosY - pt.z * sinY;
          const z1 = pt.z * cosY + pt.x * sinY;

          // Rotate X
          const y2 = pt.y * cosX - z1 * sinX;

          const px = centerX + x1;
          const py = centerY + y2;

          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();

        // Front vs back ring lighting
        const isBack = rIdx % 2 === 0;
        ctx.strokeStyle = isBack
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(255, 255, 255, 0.28)';
        ctx.lineWidth = 0.75;
        ctx.stroke();
      });

      // Render pulsar orbiting satellite particles
      satelliteNodes.forEach((node) => {
        node.theta += node.speed;
        const x = radius * Math.cos(node.phi) * Math.cos(node.theta);
        const y = radius * Math.sin(node.phi);
        const z = radius * Math.cos(node.phi) * Math.sin(node.theta);

        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        // Front-facing intensity
        const alpha = Math.max(0.1, (z2 + radius) / (radius * 2));
        ctx.beginPath();
        ctx.arc(centerX + x1, centerY + y2, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Hook speed adjustments to hover state
    const updateTargetSpeed = (fast) => {
      targetSpeed = fast ? 0.038 : 0.009;
    };

    const handleMouseEnter = () => updateTargetSpeed(true);
    const handleMouseLeave = () => updateTargetSpeed(false);

    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. Continuous Floating Levitation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Subtle continuous floating levitation
    const floatAnim = gsap.to(el, {
      y: '-=10',
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    return () => {
      floatAnim.kill();
    };
  }, []);

  // 3. Autonomous Portal Click Exit Animation
  const handlePortalClick = (e) => {
    e.preventDefault();
    const el = containerRef.current;
    if (!el) {
      navigate('/about');
      return;
    }

    // Play event horizon collapse & fade
    gsap.timeline({
      onComplete: () => {
        navigate('/about');
      }
    })
      .to(el, {
        scale: 1.25,
        filter: 'brightness(2)',
        duration: 0.18,
        ease: 'power2.out'
      })
      .to(el, {
        scale: 0,
        opacity: 0,
        filter: 'blur(12px)',
        duration: 0.4,
        ease: 'power4.in'
      });
  };

  return (
    <div
      ref={containerRef}
      className="hero-globe-cta hoverable"
      onClick={handlePortalClick}
      role="button"
      tabIndex={0}
      aria-label="Explore About Section"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handlePortalClick(e);
        }
      }}
    >
      {/* Outer ambient radar scan rings */}
      <div className="globe-radar-ring outer" />
      <div className="globe-radar-ring inner" />

      {/* Holographic Wireframe 3D Globe Canvas */}
      <canvas ref={canvasRef} className="globe-canvas" />

      {/* Center Core HUD with Typography */}
      <div ref={coreRef} className="globe-core-lens">
        <span className="globe-action font-mono uppercase">EXPLORE</span>
        <span className="globe-sub font-mono">[ ABOUT ]</span>
        <div className="globe-arrow-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
