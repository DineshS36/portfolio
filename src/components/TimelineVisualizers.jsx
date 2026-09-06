import { useEffect, useRef } from 'react';

// ============================================================================
// Phase 01: Dec 2025 – Mar 2026 Web Foundations
// Interactive DOM Tree, CSS Cascade & JS Event Dispatcher
// ============================================================================
export function WebArchitectureCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 380);
    let height = (canvas.height = 280);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 380;
      height = canvas.height = 280;
    };
    window.addEventListener('resize', onResize);

    // DOM Tree Nodes
    const domNodes = [
      { id: 'html', label: '<HTML>', level: 0, x: 0.5, y: 0.22, children: ['body'] },
      { id: 'body', label: '<BODY>', level: 1, x: 0.5, y: 0.44, children: ['header', 'main', 'btn'] },
      { id: 'header', label: '<NAV>', level: 2, x: 0.22, y: 0.72, children: [] },
      { id: 'main', label: '<MAIN.APP>', level: 2, x: 0.5, y: 0.72, children: [] },
      { id: 'btn', label: '<BUTTON#run>', level: 2, x: 0.78, y: 0.72, children: [] }
    ];

    // CSS Rule Injections
    const cssRules = [
      'display: flex;',
      'border-radius: 999px;',
      'color: #ffffff;',
      'transition: all 0.3s;',
      'gap: 1.5rem;'
    ];

    let frame = 0;
    const particles = [];

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Spawn JS Event & CSS Cascade particle packets
      if (frame % 35 === 0) {
        particles.push({
          source: 'html',
          target: Math.random() > 0.5 ? 'btn' : 'main',
          progress: 0,
          speed: 0.02,
          type: Math.random() > 0.5 ? 'event' : 'css'
        });
      }

      // Draw Tree Connectors
      ctx.lineWidth = 1;
      domNodes.forEach((node) => {
        const nx = node.x * width;
        const ny = node.y * height;

        node.children.forEach((cid) => {
          const child = domNodes.find((n) => n.id === cid);
          if (child) {
            const cx = child.x * width;
            const cy = child.y * height;

            ctx.beginPath();
            ctx.moveTo(nx, ny + 12);
            ctx.lineTo(cx, cy - 12);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
            ctx.stroke();
          }
        });
      });

      // Update & Draw Flowing Packets
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;

        const src = domNodes.find((n) => n.id === p.source);
        const tgt = domNodes.find((n) => n.id === p.target);

        if (src && tgt) {
          const sx = src.x * width;
          const sy = src.y * height;
          const tx = tgt.x * width;
          const ty = tgt.y * height;

          const px = sx + (tx - sx) * p.progress;
          const py = sy + (ty - sy) * p.progress;

          ctx.beginPath();
          ctx.arc(px, py, p.type === 'event' ? 3 : 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.type === 'event' ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        if (p.progress >= 1) {
          particles.splice(i, 1);
        }
      }

      // Draw DOM Nodes
      domNodes.forEach((node, idx) => {
        const nx = node.x * width;
        const ny = node.y * height;
        const isPulsing = Math.sin(frame * 0.05 + idx) > 0.8;

        const boxW = 88;
        const boxH = 24;

        ctx.fillStyle = isPulsing ? 'rgba(30, 30, 40, 0.95)' : 'rgba(14, 14, 18, 0.9)';
        ctx.strokeStyle = isPulsing ? '#ffffff' : 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;

        if (isPulsing) {
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 10;
        }

        ctx.beginPath();
        ctx.roundRect(nx - boxW / 2, ny - boxH / 2, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.font = '9px "Space Mono", monospace';
        ctx.fillStyle = isPulsing ? '#ffffff' : '#cccccc';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, nx, ny);
      });

      // Bottom Status Feed
      ctx.textAlign = 'left';
      ctx.font = '8.5px "Space Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      const activeRule = cssRules[Math.floor(frame / 60) % cssRules.length];
      ctx.fillText(`CSS CASCADE: ${activeRule}`, 16, height - 16);

      const eventPulse = Math.floor(frame / 40) % 2 === 0 ? 'addEventListener("click", () => render())' : 'DOMNodeInserted • DocumentReady';
      ctx.fillText(`JS EVENT: ${eventPulse}`, width - 210, height - 16);

      // Top HUD Overlay
      ctx.font = '9.5px "Space Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText('[ DEC 2025 – MAR 2026 • HTML5 DOM TREE + CSS CASCADE + JS EVENTS ]', 16, 22);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="quantum-visualizer-canvas" />;
}

// ============================================================================
// Phase 02: June 2026 (5-Day Rapid Sprint)
// ChatUp Real-Time WebSocket Message Stream & MongoDB Persistence
// ============================================================================
export function ChatUpSocketStreamCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 380);
    let height = (canvas.height = 280);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 380;
      height = canvas.height = 280;
    };
    window.addEventListener('resize', onResize);

    const chatLogs = [
      { user: 'USER_1', text: 'Hey, is WebSocket connected?', ping: '16ms', type: 'in' },
      { user: 'SOCKET.IO', text: 'emit("chat:sync") • ack: 200', ping: '18ms', type: 'system' },
      { user: 'USER_2', text: 'Full duplex alive! Zero lag.', ping: '15ms', type: 'out' },
      { user: 'MONGODB', text: 'db.messages.insertOne() • 100% saved', ping: '22ms', type: 'db' }
    ];

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Background Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let y = 35; y < height; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Channel Header Bar
      ctx.fillStyle = 'rgba(16, 16, 22, 0.7)';
      ctx.fillRect(16, 36, width - 32, 26);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.strokeRect(16, 36, width - 32, 26);

      ctx.font = '9px "Space Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('CHANNEL: #realtime-chatup', 28, 52);

      const livePing = 16 + Math.floor(Math.sin(frame * 0.08) * 6);
      ctx.fillStyle = '#00ffaa';
      ctx.textAlign = 'right';
      ctx.fillText(`RTT: ${livePing}ms • WS ACTIVE`, width - 28, 52);

      // Render Streaming Message Cards
      const baseY = 80;
      const lineHeight = 36;

      chatLogs.forEach((item, idx) => {
        const y = baseY + idx * lineHeight;
        const isCurrent = (Math.floor(frame / 65) % chatLogs.length) === idx;

        ctx.fillStyle = isCurrent
          ? 'rgba(30, 30, 42, 0.85)'
          : 'rgba(12, 12, 16, 0.7)';
        ctx.strokeStyle = isCurrent
          ? 'rgba(255, 255, 255, 0.4)'
          : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.roundRect(16, y, width - 32, 28, 6);
        ctx.fill();
        ctx.stroke();

        // User / System tag
        ctx.font = '8.5px "Space Mono", monospace';
        ctx.fillStyle = item.type === 'db' ? '#ffcc00' : item.type === 'system' ? '#00e5ff' : '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(`[${item.user}]`, 26, y + 18);

        // Text Payload
        ctx.fillStyle = '#cccccc';
        ctx.fillText(item.text, 96, y + 18);

        // Ping badge
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'right';
        ctx.fillText(item.ping, width - 26, y + 18);
      });

      // Bottom Gateway & DB Pipe Animation
      const pipeY = height - 24;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(16, pipeY);
      ctx.lineTo(width - 16, pipeY);
      ctx.stroke();

      const pulseX = 16 + ((frame * 3.5) % (width - 32));
      ctx.beginPath();
      ctx.arc(pulseX, pipeY, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = '8px "Space Mono", monospace';
      ctx.fillStyle = '#888888';
      ctx.textAlign = 'left';
      ctx.fillText('SOCKET.IO EVENT BUS: HEARTBEAT ACKNOWLEDGED', 16, pipeY + 14);

      // Top HUD Overlay
      ctx.font = '9.5px "Space Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText('[ JUNE 2026 • 5-DAY SPRINT • SOCKET.IO REAL-TIME + MONGODB ]', 16, 22);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="quantum-visualizer-canvas" />;
}

// ============================================================================
// Phase 03: June 2026 (3-Day Rapid Sprint)
// Roasting AI: Google Gemini LLM Prompt-to-Token Streaming Pipeline
// ============================================================================
export function RoastingAITokenStreamCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 380);
    let height = (canvas.height = 280);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 380;
      height = canvas.height = 280;
    };
    window.addEventListener('resize', onResize);

    const roastQuotes = [
      'Your code has more unhandled promises than a politician.',
      'That nested loop is deeper than the Mariana Trench.',
      'Even your linter gave up and closed the file.',
      'Running on 99% prayers and 1% console.log().',
      'Your git commits read like a dramatic thriller novel.'
    ];

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Model & Parameter Badges Bar
      ctx.fillStyle = 'rgba(16, 16, 24, 0.8)';
      ctx.fillRect(16, 36, width - 32, 28);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.strokeRect(16, 36, width - 32, 28);

      ctx.font = '9px "Space Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('MODEL: GEMINI 1.5 FLASH', 28, 53);

      ctx.fillStyle = '#888888';
      ctx.fillText('ARCHETYPE: [SARCASTIC_DEV]', 175, 53);

      ctx.fillStyle = '#00ffaa';
      ctx.textAlign = 'right';
      ctx.fillText('TTFB: 540MS', width - 28, 53);

      // Streaming Output Window
      ctx.fillStyle = 'rgba(10, 10, 14, 0.9)';
      ctx.fillRect(16, 76, width - 32, 130);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(16, 76, width - 32, 130);

      // Terminal Header inside Stream Window
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(16, 76, width - 32, 22);
      ctx.font = '8.5px "Space Mono", monospace';
      ctx.fillStyle = '#777777';
      ctx.textAlign = 'left';
      ctx.fillText('STREAM BUFFER • TOKEN GENERATOR', 26, 91);

      const activeRoastIdx = Math.floor(frame / 180) % roastQuotes.length;
      const fullText = roastQuotes[activeRoastIdx];
      const charProgress = Math.min(fullText.length, Math.floor((frame % 180) / 2));
      const visibleText = fullText.slice(0, charProgress);

      // Render Streaming Text with dynamic cursor
      ctx.font = '11.5px "Space Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';

      // Word wrapping for small widths
      const words = visibleText.split(' ');
      let line = '';
      let lineY = 124;
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > width - 70 && i > 0) {
          ctx.fillText(line, 28, lineY);
          line = words[i] + ' ';
          lineY += 22;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 28, lineY);

      // Blinking Cursor
      if (Math.floor(frame / 15) % 2 === 0 && charProgress < fullText.length) {
        const lastLineWidth = ctx.measureText(line).width;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(28 + lastLineWidth + 2, lineY - 10, 7, 13);
      }

      // Stream Metrics Footer
      const tokSec = 82 + Math.floor(Math.sin(frame * 0.1) * 8);
      ctx.font = '8.5px "Space Mono", monospace';
      ctx.fillStyle = '#888888';
      ctx.textAlign = 'left';
      ctx.fillText(`STREAM: ${tokSec} TOK/SEC`, 16, height - 22);

      const streamWidth = ((frame % 180) / 180) * (width - 150);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(110, height - 28, width - 130, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(110, height - 28, streamWidth, 4);

      ctx.fillStyle = '#00ffaa';
      ctx.textAlign = 'right';
      ctx.fillText('STATUS: STREAMING', width - 16, height - 12);

      // Top HUD Overlay
      ctx.font = '9.5px "Space Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'left';
      ctx.fillText('[ JUNE 2026 • 3-DAY SPRINT • GEMINI LLM TOKEN STREAMING ]', 16, 22);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="quantum-visualizer-canvas" />;
}

// ============================================================================
// Phase 04: 2026 Production SaaS
// AI Resume Builder: Decoupled Cloudflare Edge + Gemini ATS Parser (98%)
// ============================================================================
export function EdgeResumeATSParserCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 380);
    let height = (canvas.height = 280);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 380;
      height = canvas.height = 280;
    };
    window.addEventListener('resize', onResize);

    const scanCategories = [
      { name: 'KEYWORDS (React, Node, SQL, Docker)', score: 98 },
      { name: 'STRUCTURE (ATS Formatted Sections)', score: 100 },
      { name: 'IMPACT METRICS (Quantified Results)', score: 96 },
      { name: 'SECURITY (Google OAuth PKCE Verified)', score: 100 }
    ];

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Top Architecture Gateway Bar
      ctx.fillStyle = 'rgba(16, 16, 24, 0.85)';
      ctx.fillRect(16, 36, width - 32, 28);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.strokeRect(16, 36, width - 32, 28);

      ctx.font = '9px "Space Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('EDGE: CLOUDFLARE PAGES', 28, 53);

      ctx.fillStyle = '#00ffaa';
      ctx.fillText('AUTH: GOOGLE OAUTH 2.0 PKCE', 170, 53);

      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('POSTGRESQL + PRISMA', width - 28, 53);

      // ATS Parser Main Scoring Pane
      const scanCardY = 76;
      const scanCardH = 150;
      ctx.fillStyle = 'rgba(10, 10, 14, 0.9)';
      ctx.fillRect(16, scanCardY, width - 32, scanCardH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.strokeRect(16, scanCardY, width - 32, scanCardH);

      // Left Column: Category Progress Bars
      const barBaseY = 96;
      scanCategories.forEach((cat, idx) => {
        const y = barBaseY + idx * 30;

        ctx.font = '8px "Space Mono", monospace';
        ctx.fillStyle = '#aaaaaa';
        ctx.textAlign = 'left';
        ctx.fillText(cat.name, 28, y);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${cat.score}%`, width - 110, y);

        // Progress bar
        const barW = width - 190;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(28, y + 4, barW, 4);

        const fillW = (cat.score / 100) * barW;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(28, y + 4, fillW, 4);
      });

      // Right Column: Overall ATS Score Circular Gauge
      const gaugeX = width - 60;
      const gaugeY = 145;
      const gaugeRadius = 32;

      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, gaugeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 3;
      ctx.stroke();

      const startAngle = -Math.PI / 2;
      const scoreProgress = 0.984; // 98.4%
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, gaugeRadius, startAngle, startAngle + Math.PI * 2 * scoreProgress);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.font = '11px "Space Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('98.4%', gaugeX, gaugeY - 3);

      ctx.font = '7px "Space Mono", monospace';
      ctx.fillStyle = '#888888';
      ctx.fillText('ATS SCORE', gaugeX, gaugeY + 10);

      // Scanning Laser Beam Animation
      const laserProgress = (Math.sin(frame * 0.04) + 1) / 2;
      const laserY = scanCardY + laserProgress * scanCardH;
      ctx.strokeStyle = 'rgba(0, 255, 170, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(16, laserY);
      ctx.lineTo(width - 16, laserY);
      ctx.stroke();

      // Bottom Architecture Status
      ctx.font = '8.5px "Space Mono", monospace';
      ctx.fillStyle = '#888888';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('LATENCY: 74MS TTFB • ZERO PERSISTENCE OF RAW PDF RESUMES', 16, height - 12);

      // Top HUD Overlay
      ctx.font = '9.5px "Space Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText('[ 2026 PROD SAAS • CLOUDFLARE EDGE + GEMINI ATS 98% ]', 16, 22);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="quantum-visualizer-canvas" />;
}
