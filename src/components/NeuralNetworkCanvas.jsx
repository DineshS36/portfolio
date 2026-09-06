import { useEffect, useRef, useState } from 'react';

const ARCHETYPES = [
  { id: 'atom', label: 'QUANTUM ATOM' },
  { id: 'tesseract', label: 'QUANTUM HYPERCUBE' },
  { id: 'helix', label: 'DNA HELIX' },
  { id: 'galaxy', label: 'SINGULARITY SPIRAL' },
  { id: 'cloud', label: 'NEURAL CLOUD' }
];

// Point-in-polygon (ray casting)
function pointInPolygon(px, py, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

// Sample points along a polygon outline
function sampleOutline(outline, count, scale, cx, cy, jitter) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const total = outline.length;
    const segF = t * total;
    const idx = Math.floor(segF) % total;
    const next = (idx + 1) % total;
    const alpha = segF - Math.floor(segF);
    const p1 = outline[idx];
    const p2 = outline[next];
    const j = (Math.random() - 0.5) * jitter;
    pts.push({
      x: cx + (p1.x + (p2.x - p1.x) * alpha + j) * scale,
      y: cy + (p1.y + (p2.y - p1.y) * alpha + j) * scale
    });
  }
  return pts;
}

// Fill inside a polygon via rejection sampling
function fillPolygon(polygon, count, scale, cx, cy) {
  const pts = [];
  let filled = 0, attempts = 0;
  while (filled < count && attempts < count * 30) {
    attempts++;
    const tx = (Math.random() * 2 - 1) * 0.95;
    const ty = (Math.random() * 2 - 1) * 0.95;
    if (pointInPolygon(tx, ty, polygon)) {
      pts.push({
        x: cx + tx * scale + (Math.random() - 0.5) * 2,
        y: cy + ty * scale + (Math.random() - 0.5) * 2
      });
      filled++;
    }
  }
  return pts;
}

export default function NeuralNetworkCanvas() {
  const canvasRef = useRef(null);
  const [currentArchetypeIndex, setCurrentArchetypeIndex] = useState(0);
  const currentArchetypeIndexRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const particleCount = 200;
    const connectionDistance = 52;
    const mouseDistance = 120;

    let mouse = { x: null, y: null };
    let hasInteractedThisCycle = false;
    let idleTimer = null;
    let globalPulseTimer = 0;
    let actionPotentials = [];

    const setCanvasSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    const generateTargetPoints = (typeIndex, width, height, count) => {
      const cx = width / 2;
      const cy = height / 2;
      const s = Math.min(width, height);

      switch (typeIndex) {

        // ================================================================
        // 1. QUANTUM ATOM — 3D Central Nucleus + 3 Intersecting Orbital Rings
        // ================================================================
        case 0: {
          const pts = [];
          const nucleusCount = 38;
          const ringCount = 54; // 3 rings * 54 = 162 particles (+ 38 = 200 total)
          const R = s * 0.32;
          const rNuc = s * 0.075;

          // 1. Dense Quantum Nucleus (Protons & Neutrons at center)
          for (let i = 0; i < nucleusCount; i++) {
            const r = Math.pow(Math.random(), 0.6) * rNuc;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const nx = r * Math.sin(phi) * Math.cos(theta);
            const ny = r * Math.sin(phi) * Math.sin(theta);
            const nz = r * Math.cos(phi);

            pts.push({
              x: cx + nx,
              y: cy + ny,
              base3D: { x: nx / R, y: ny / R, z: nz / R },
              isNucleus: true,
              radius: Math.random() * 0.5 + 1.2,
              baseAlpha: 0.95
            });
          }

          // 2. Three 3D Orbital Rings (tilted symmetrically in space)
          const ringConfigs = [
            { tiltX: 0.96, tiltZ: 0.52 },   // Ring 1: tilted around X by +55°, Z by +30°
            { tiltX: -0.96, tiltZ: -0.52 }, // Ring 2: tilted around X by -55°, Z by -30°
            { tiltY: 1.22, tiltZ: 1.57 }    // Ring 3: tilted around Y by +70°, Z by +90°
          ];

          ringConfigs.forEach((cfg, ringIdx) => {
            const startIdx = pts.length;
            for (let i = 0; i < ringCount; i++) {
              const angle = (i / ringCount) * Math.PI * 2;
              let x0 = Math.cos(angle) * R;
              let y0 = Math.sin(angle) * R * 0.92;
              let z0 = 0;

              let x = x0, y = y0, z = z0;

              if (cfg.tiltX !== undefined) {
                const cX = Math.cos(cfg.tiltX), sX = Math.sin(cfg.tiltX);
                const y1 = y * cX - z * sX;
                const z1 = y * sX + z * cX;
                y = y1;
                z = z1;
              }
              if (cfg.tiltY !== undefined) {
                const cY = Math.cos(cfg.tiltY), sY = Math.sin(cfg.tiltY);
                const x1 = x * cY + z * sY;
                const z1 = -x * sY + z * cY;
                x = x1;
                z = z1;
              }
              if (cfg.tiltZ !== undefined) {
                const cZ = Math.cos(cfg.tiltZ), sZ = Math.sin(cfg.tiltZ);
                const x1 = x * cZ - y * sZ;
                const y1 = x * sZ + y * cZ;
                x = x1;
                y = y1;
              }

              pts.push({
                x: cx + x,
                y: cy + y,
                base3D: { x: x / R, y: y / R, z: z / R },
                ringIndex: ringIdx,
                indexInRing: i,
                ringStart: startIdx,
                radius: Math.random() * 0.4 + 1.0,
                baseAlpha: 0.85
              });
            }
          });

          return pts;
        }

        // ================================================================
        // 2. TESSERACT — Proper 4D hypercube projection with 16 vertices
        // ================================================================
        case 1: {
          const sc = s * 0.36;
          const pts = [];
          // Outer cube vertices
          const o = 0.65, inner = 0.32;
          const outerV = [
            {x:-o,y:-o},{x:o,y:-o},{x:o,y:o},{x:-o,y:o}
          ];
          const innerV = [
            {x:-inner,y:-inner},{x:inner,y:-inner},{x:inner,y:inner},{x:-inner,y:inner}
          ];

          // All 12 edges: 4 outer, 4 inner, 4 cross
          const edges = [];
          for (let i = 0; i < 4; i++) { edges.push([outerV[i], outerV[(i+1)%4]]); }
          for (let i = 0; i < 4; i++) { edges.push([innerV[i], innerV[(i+1)%4]]); }
          for (let i = 0; i < 4; i++) { edges.push([outerV[i], innerV[i]]); }

          // Distribute particles along edges and at vertices
          const perEdge = Math.floor(count * 0.75 / edges.length);
          const vertexCount = count - perEdge * edges.length;

          edges.forEach(([a, b]) => {
            for (let i = 0; i < perEdge; i++) {
              const t = i / perEdge;
              pts.push({
                x: cx + (a.x + (b.x - a.x) * t) * sc + (Math.random() - 0.5) * 3,
                y: cy + (a.y + (b.y - a.y) * t) * sc + (Math.random() - 0.5) * 3
              });
            }
          });

          // Extra particles at vertex clusters
          const allV = [...outerV, ...innerV];
          for (let i = 0; i < vertexCount; i++) {
            const v = allV[i % allV.length];
            pts.push({
              x: cx + v.x * sc + (Math.random() - 0.5) * 8,
              y: cy + v.y * sc + (Math.random() - 0.5) * 8
            });
          }
          return pts;
        }

        // ================================================================
        // 3. DNA HELIX — Two intertwined helical strands with rungs
        // ================================================================
        case 2: {
          const pts = [];
          const helixH = s * 0.42;
          const helixW = s * 0.18;
          const revolutions = 3;

          // Two backbone strands
          const strandCount = Math.floor(count * 0.6);
          const rungCount = count - strandCount;

          for (let i = 0; i < strandCount; i++) {
            const t = (i / strandCount) - 0.5;
            const y = t * helixH;
            const angle = t * Math.PI * 2 * revolutions;
            const strand = i < strandCount / 2 ? 1 : -1;
            const x = strand * helixW * Math.cos(angle);
            pts.push({
              x: cx + x + (Math.random() - 0.5) * 3,
              y: cy + y + (Math.random() - 0.5) * 2
            });
          }

          // Base pair rungs connecting strands
          for (let i = 0; i < rungCount; i++) {
            const t = (i / rungCount) - 0.5;
            const y = t * helixH;
            const angle = t * Math.PI * 2 * revolutions;
            const rungPos = (Math.random() * 0.8 + 0.1);
            const x1 = helixW * Math.cos(angle);
            const x2 = -helixW * Math.cos(angle);
            const x = x1 + (x2 - x1) * rungPos;
            pts.push({
              x: cx + x + (Math.random() - 0.5) * 2,
              y: cy + y + (Math.random() - 0.5) * 2
            });
          }
          return pts;
        }

        // ================================================================
        // 4. FIBONACCI SPIRAL — Multi-arm golden spiral galaxy
        // ================================================================
        case 3: {
          const pts = [];
          const maxR = s * 0.42;
          const arms = 3;
          const armCount = Math.floor(count * 0.75);
          const coreCount = count - armCount;

          // Spiral arms
          for (let i = 0; i < armCount; i++) {
            const arm = i % arms;
            const t = (i / armCount) * 4;
            const r = maxR * (t / 4) * 0.95;
            const theta = t * Math.PI * 1.5 + (arm * Math.PI * 2 / arms);
            const spread = (t / 4) * 12 + 2;
            pts.push({
              x: cx + r * Math.cos(theta) + (Math.random() - 0.5) * spread,
              y: cy + r * Math.sin(theta) + (Math.random() - 0.5) * spread
            });
          }

          // Dense core cluster
          for (let i = 0; i < coreCount; i++) {
            const r = Math.random() * maxR * 0.15;
            const theta = Math.random() * Math.PI * 2;
            pts.push({
              x: cx + r * Math.cos(theta),
              y: cy + r * Math.sin(theta)
            });
          }
          return pts;
        }

        // ================================================================
        // 5. CLOUD — Recognizable cumulus cloud silhouette
        // ================================================================
        case 4: {
          const sc = s * 0.44;
          const pts = [];

          // Cloud outline: 3 rounded lobes on top, flat base
          const cloudOutline = [
            // Flat bottom (left to right)
            { x: -0.70, y:  0.22 },
            { x: -0.50, y:  0.24 },
            { x: -0.30, y:  0.24 },
            { x: -0.10, y:  0.24 },
            { x:  0.10, y:  0.24 },
            { x:  0.30, y:  0.24 },
            { x:  0.50, y:  0.24 },
            { x:  0.70, y:  0.22 },
            // Right side rise
            { x:  0.68, y:  0.14 },
            { x:  0.62, y:  0.04 },
            // Right lobe
            { x:  0.58, y: -0.04 },
            { x:  0.56, y: -0.12 },
            { x:  0.52, y: -0.18 },
            { x:  0.46, y: -0.22 },
            { x:  0.38, y: -0.24 },
            // Dip between right and center lobe
            { x:  0.30, y: -0.20 },
            { x:  0.24, y: -0.24 },
            // Center lobe (tallest)
            { x:  0.18, y: -0.32 },
            { x:  0.12, y: -0.40 },
            { x:  0.06, y: -0.46 },
            { x:  0.00, y: -0.50 },
            { x: -0.06, y: -0.48 },
            { x: -0.12, y: -0.44 },
            { x: -0.18, y: -0.36 },
            // Dip between center and left lobe
            { x: -0.24, y: -0.28 },
            { x: -0.28, y: -0.24 },
            // Left lobe
            { x: -0.34, y: -0.28 },
            { x: -0.40, y: -0.30 },
            { x: -0.48, y: -0.28 },
            { x: -0.54, y: -0.24 },
            { x: -0.60, y: -0.18 },
            { x: -0.64, y: -0.10 },
            { x: -0.68, y: -0.02 },
            // Left side descent to base
            { x: -0.70, y:  0.08 },
            { x: -0.72, y:  0.16 },
            { x: -0.70, y:  0.22 },
          ];

          const outlineN = Math.floor(count * 0.50);
          const fillN = count - outlineN;

          pts.push(...sampleOutline(cloudOutline, outlineN, sc, cx, cy, 0.02));
          pts.push(...fillPolygon(cloudOutline, fillN, sc, cx, cy));

          return pts;
        }

        default:
          return [];
      }
    };

    class MorphParticle {
      constructor(index, x, y) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 0.8 + 0.9;
        this.targetX = x;
        this.targetY = y;
        this.base3D = null;
        this.baseAlpha = Math.random() * 0.3 + 0.7;
        this.activation = 0;
        this.layer = 0;
        this.isPrimaryNode = false;
        this.isNucleus = false;
        this.baseRadius = 5.2;
        this.rotZ = 0;
        this.pScale = 1;
      }

      update(width, height, isFreePhysics) {
        if (isFreePhysics) {
          this.x += this.vx;
          this.y += this.vy;
          this.vx *= 0.96;
          this.vy *= 0.96;
          if (this.x < 6) { this.x = 6; this.vx *= -1; }
          if (this.x > width - 6) { this.x = width - 6; this.vx *= -1; }
          if (this.y < 6) { this.y = 6; this.vy *= -1; }
          if (this.y > height - 6) { this.y = height - 6; this.vy *= -1; }
        } else {
          const dx = this.targetX - this.x;
          const dy = this.targetY - this.y;
          this.vx = this.vx * 0.82 + dx * 0.055;
          this.vy = this.vy * 0.82 + dy * 0.055;
          this.x += this.vx;
          this.y += this.vy;
          const breath = Math.sin(globalPulseTimer * 0.025 + this.index * 0.12) * 0.3;
          this.x += breath * 0.1;
          this.y += breath * 0.1;
        }

        if (mouse.x !== null && mouse.y !== null) {
          const mdx = this.x - mouse.x;
          const mdy = this.y - mouse.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < mouseDistance && dist > 0.1) {
            const force = (1 - dist / mouseDistance) * 4.5;
            this.vx += (mdx / dist) * force;
            this.vy += (mdy / dist) * force;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.baseAlpha})`;
        ctx.fill();
      }
    }

    const init = () => {
      setCanvasSize();
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();

      const targets = generateTargetPoints(currentArchetypeIndexRef.current, rect.width, rect.height, particleCount);
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const pt = targets[i] || { x: rect.width / 2, y: rect.height / 2 };
        const p = new MorphParticle(i, pt.x, pt.y);
        p.targetX = pt.x;
        p.targetY = pt.y;
        p.base3D = pt.base3D || null;
        p.layer = pt.layer !== undefined ? pt.layer : 0;
        p.isPrimaryNode = !!pt.isPrimaryNode;
        p.isNucleus = !!pt.isNucleus;
        p.radius = pt.radius || (Math.random() * 0.8 + 0.9);
        p.baseAlpha = pt.baseAlpha || (Math.random() * 0.3 + 0.7);
        particles.push(p);
      }
    };

    const advanceToNextArchetype = () => {
      currentArchetypeIndexRef.current = (currentArchetypeIndexRef.current + 1) % ARCHETYPES.length;
      setCurrentArchetypeIndex(currentArchetypeIndexRef.current);

      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const targets = generateTargetPoints(currentArchetypeIndexRef.current, rect.width, rect.height, particleCount);

      const isTargetAtom = currentArchetypeIndexRef.current === 0;
      const assignedTargets = isTargetAtom
        ? [...targets]
        : [...targets].sort(() => Math.random() - 0.5);

      particles.forEach((p, idx) => {
        const target = assignedTargets[idx] || targets[idx % targets.length];
        p.targetX = target.x;
        p.targetY = target.y;
        p.base3D = target.base3D || null;
        p.layer = target.layer !== undefined ? target.layer : 0;
        p.isPrimaryNode = !!target.isPrimaryNode;
        p.isNucleus = !!target.isNucleus;
        p.radius = target.radius || (Math.random() * 0.8 + 0.9);
        p.baseAlpha = target.baseAlpha || (Math.random() * 0.3 + 0.7);
        p.vx += (Math.random() - 0.5) * 2.5;
        p.vy += (Math.random() - 0.5) * 2.5;
      });
    };

    const animate = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);
      globalPulseTimer += 1;

      const isFreePhysics = mouse.x !== null && mouse.y !== null;

      particles.forEach(p => {
        p.update(width, height, isFreePhysics);
      });

      if (currentArchetypeIndexRef.current === 0) {
        // ==============================================================
        // 1. QUANTUM ATOM — 3D Central Nucleus + 3 Intersecting Orbital Rings
        // ==============================================================
        const time = globalPulseTimer * 0.01;
        const scale = Math.min(width, height) * 0.32;
        const cx = width / 2;
        const cy = height / 2;

        // Dynamic 3D rotation of the atomic frame
        const yaw = time * 0.40;
        const pitch = time * 0.25;
        const roll = Math.sin(time * 0.16) * 0.12;

        const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
        const cosX = Math.cos(pitch), sinX = Math.sin(pitch);
        const cosZ = Math.cos(roll), sinZ = Math.sin(roll);

        // Update 3D projected coordinates and depth fading for all particles
        particles.forEach(p => {
          if (p.base3D) {
            let x1 = p.base3D.x * cosY + p.base3D.z * sinY;
            let z1 = -p.base3D.x * sinY + p.base3D.z * cosY;
            let y2 = p.base3D.y * cosX - z1 * sinX;
            let z2 = p.base3D.y * sinX + z1 * cosX;
            let x3 = x1 * cosZ - y2 * sinZ;
            let y3 = x1 * sinZ + y2 * cosZ;

            const focal = 3.0;
            const pScale = focal / (focal + z2);

            p.targetX = cx + x3 * scale * pScale;
            p.targetY = cy + y3 * scale * pScale;
            p.rotZ = z2;
            p.pScale = pScale;
            p.baseAlpha = p.isNucleus
              ? Math.max(0.4, Math.min(1.0, 0.8 + z2 * 0.2))
              : Math.max(0.2, Math.min(0.9, 0.55 + z2 * 0.35));
          }
        });

        // 1. Draw Ring Orbital Lines (continuous elliptical trajectories)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.26)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let r = 0; r < 3; r++) {
          const start = 38 + r * 54;
          for (let i = 0; i < 54; i++) {
            const p1 = particles[start + i];
            const p2 = particles[start + ((i + 1) % 54)];
            if (p1 && p2) {
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              if (dx * dx + dy * dy < 4900) { // 70px threshold
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
              }
            }
          }
        }
        ctx.stroke();

        // 2. Draw Nucleus Core Lattice
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let i = 0; i < 38; i++) {
          for (let j = i + 1; j < 38; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            if (!p1 || !p2) continue;
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            if (dx * dx + dy * dy < 784) { // 28px threshold
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            }
          }
        }
        ctx.stroke();

        // 3. Draw Points & Particles
        particles.forEach(p => p.draw());
      } else {
        // Standard proximity connections for other shapes (Tesseract, DNA, Galaxy, Cloud)
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDistance) {
              const alpha = (1 - dist / connectionDistance) * 0.3;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        particles.forEach(p => p.draw());
      }

      // Action potentials (electron & photon pulses moving through the orbits and network)
      if (currentArchetypeIndexRef.current === 0) {
        if (Math.random() < 0.12 && actionPotentials.length < 8) {
          if (Math.random() < 0.75) {
            // Electron pulse along an orbital ring
            const ringIdx = Math.floor(Math.random() * 3);
            const start = 38 + ringIdx * 54;
            const nodeIdx = Math.floor(Math.random() * 54);
            const p1 = particles[start + nodeIdx];
            const p2 = particles[start + ((nodeIdx + 1) % 54)];
            if (p1 && p2 && Math.hypot(p1.x - p2.x, p1.y - p2.y) < 70) {
              actionPotentials.push({
                x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
                progress: 0, speed: 0.08 + Math.random() * 0.04
              });
            }
          } else {
            // Photon pulse in the nucleus core
            const i1 = Math.floor(Math.random() * 38);
            const i2 = Math.floor(Math.random() * 38);
            const p1 = particles[i1];
            const p2 = particles[i2];
            if (p1 && p2 && Math.hypot(p1.x - p2.x, p1.y - p2.y) < 28) {
              actionPotentials.push({
                x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
                progress: 0, speed: 0.09
              });
            }
          }
        }
      } else {
        if (Math.random() < 0.08 && particles.length > 27) {
          const p1 = particles[Math.floor(Math.random() * particles.length)];
          const neighbor = particles.find(p => {
            const d = Math.hypot(p.x - p1.x, p.y - p1.y);
            return d > 8 && d < connectionDistance;
          });
          if (neighbor) {
            actionPotentials.push({
              x1: p1.x, y1: p1.y, x2: neighbor.x, y2: neighbor.y,
              progress: 0, speed: 0.06 + Math.random() * 0.04
            });
          }
        }
      }

      // Update and render action potentials (Unified for all archetypes)
      for (let k = actionPotentials.length - 1; k >= 0; k--) {
        const pulse = actionPotentials[k];
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          actionPotentials.splice(k, 1);
        } else {
          const px = pulse.x1 + (pulse.x2 - pulse.x1) * pulse.progress;
          const py = pulse.y1 + (pulse.y2 - pulse.y1) * pulse.progress;
          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      hasInteractedThisCycle = true;
      clearTimeout(idleTimer);
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
      if (hasInteractedThisCycle) {
        hasInteractedThisCycle = false;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => advanceToNextArchetype(), 350);
      }
    };

    const handleTouchStart = (e) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      hasInteractedThisCycle = true;
      clearTimeout(idleTimer);
    };

    const handleTouchMove = (e) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    };

    const handleTouchEnd = () => handleMouseLeave();

    const handleResize = () => {
      setCanvasSize();
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const targets = generateTargetPoints(currentArchetypeIndexRef.current, rect.width, rect.height, particleCount);
      particles.forEach((p, idx) => {
        if (targets[idx]) {
          p.targetX = targets[idx].x;
          p.targetY = targets[idx].y;
          p.base3D = targets[idx].base3D || null;
          p.layer = targets[idx].layer !== undefined ? targets[idx].layer : 0;
          p.isPrimaryNode = !!targets[idx].isPrimaryNode;
          p.isNucleus = !!targets[idx].isNucleus;
          p.radius = targets[idx].radius || (Math.random() * 0.8 + 0.9);
          p.baseAlpha = targets[idx].baseAlpha || (Math.random() * 0.3 + 0.7);
        }
      });
    };

    const handleClick = () => {
      clearTimeout(idleTimer);
      advanceToNextArchetype();
    };

    init();
    animate();

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const activeArchetype = ARCHETYPES[currentArchetypeIndex];

  return (
    <div className="neural-matrix-container">
      <div className="neural-hud-bar top font-mono">
        <span className="hud-indicator-dot" />
        <span className="hud-title">{activeArchetype.label}</span>
      </div>

      <canvas ref={canvasRef} className="abstract-canvas" />
    </div>
  );
}
