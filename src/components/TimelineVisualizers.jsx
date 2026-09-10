import { useEffect, useRef } from 'react';

// ============================================================================
// STAGE 01: Dec 2025 – Mar 2026 Web Foundations & Core Logic
// Clean DOM Tree Hierarchy, CSS Cascade Rule Inspector & Event Dispatcher
// ============================================================================
export function WebArchitectureCanvas({ isActive = true }) {
  const canvasRef = useRef(null);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const parent = canvas.parentElement;
    let width = parent?.clientWidth || 380;
    let height = parent?.clientHeight || 280;

    const resize = () => {
      if (!canvas || !parent) return;
      width = parent.clientWidth || 380;
      height = parent.clientHeight || 280;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // DOM Tree Nodes
    const domNodes = [
      { id: 'html', label: '<HTML>', x: 0.5, y: 0.20, children: ['body'] },
      { id: 'body', label: '<BODY>', x: 0.5, y: 0.44, children: ['nav', 'main', 'btn'] },
      { id: 'nav', label: '<NAV>', x: 0.22, y: 0.70, children: [] },
      { id: 'main', label: '<MAIN.APP>', x: 0.5, y: 0.70, children: [] },
      { id: 'btn', label: '<BUTTON#action>', x: 0.78, y: 0.70, children: [] }
    ];

    const cssRules = [
      'display: flex; gap: 1.5rem;',
      'border-radius: 999px; backdrop-filter: blur(16px);',
      'color: #ffffff; letter-spacing: 0.04em;',
      'transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);',
      'grid-template-columns: repeat(3, 1fr);'
    ];

    let frame = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isActiveRef.current) return;

      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Clean Static DOM Tree Connectors
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
            ctx.moveTo(nx, ny + 13);
            ctx.lineTo(cx, cy - 13);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
            ctx.stroke();
          }
        });
      });

      // 2. Draw Clean DOM Nodes (No moving particles, no flashing)
      domNodes.forEach((node, idx) => {
        const nx = node.x * width;
        const ny = node.y * height;
        const isRoot = idx === 0;

        const boxW = Math.min(96, width * 0.24);
        const boxH = 26;

        ctx.fillStyle = isRoot ? 'rgba(28, 30, 42, 0.95)' : 'rgba(14, 14, 20, 0.9)';
        ctx.strokeStyle = isRoot ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.roundRect(nx - boxW / 2, ny - boxH / 2, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = '9px "Space Mono", monospace';
        ctx.fillStyle = isRoot ? '#38bdf8' : '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, nx, ny);
      });

      // 3. Clean Status Telemetry Footer
      const footerY = height - 18;
      ctx.font = '8.5px "Space Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      const activeRule = cssRules[Math.floor(frame / 120) % cssRules.length];
      ctx.fillText(`CSS CASCADE: ${activeRule}`, 16, footerY);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('DOM_READY • FULL_HIERARCHY', width - 16, footerY);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="quantum-visualizer-canvas" />;
}

// ============================================================================
// STAGE 02: June 2026 (5-Day Sprint)
// ChatUp Full-Duplex WebSocket Message Stream & MongoDB Persistence
// ============================================================================
export function ChatUpSocketStreamCanvas({ isActive = true }) {
  const canvasRef = useRef(null);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const parent = canvas.parentElement;
    let width = parent?.clientWidth || 380;
    let height = parent?.clientHeight || 280;

    const resize = () => {
      if (!canvas || !parent) return;
      width = parent.clientWidth || 380;
      height = parent.clientHeight || 280;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const chatLogs = [
      { user: 'CLIENT', text: 'emit("chat:send", payload)', ping: '14ms', type: 'in' },
      { user: 'SOCKET.IO', text: 'ack: 200 • broadcast("room:sync")', ping: '18ms', type: 'system' },
      { user: 'CLIENT_2', text: 'on("chat:sync") • rendered 0-lag', ping: '16ms', type: 'out' },
      { user: 'MONGODB', text: 'db.messages.insertOne() • saved', ping: '22ms', type: 'db' }
    ];

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isActiveRef.current) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Clean Channel Header Bar
      const headerY = 16;
      ctx.fillStyle = 'rgba(16, 16, 22, 0.85)';
      ctx.fillRect(16, headerY, width - 32, 28);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.strokeRect(16, headerY, width - 32, 28);

      ctx.font = '9px "Space Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('CHANNEL: #realtime-chatup', 28, headerY + 18);

      ctx.fillStyle = '#10b981';
      ctx.textAlign = 'right';
      ctx.fillText('RTT: 16MS • FULL-DUPLEX ACTIVE', width - 28, headerY + 18);

      // 2. Clean Message Cards (No loading or jumpy highlights)
      const baseY = 56;
      const lineHeight = Math.min(38, (height - 95) / 4);

      chatLogs.forEach((item, idx) => {
        const y = baseY + idx * lineHeight;

        ctx.fillStyle = idx === 1 ? 'rgba(24, 26, 36, 0.85)' : 'rgba(12, 12, 16, 0.7)';
        ctx.strokeStyle = idx === 1 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.roundRect(16, y, width - 32, lineHeight - 6, 6);
        ctx.fill();
        ctx.stroke();

        // User / System tag
        ctx.font = '8.5px "Space Mono", monospace';
        ctx.fillStyle = item.type === 'db' ? '#f59e0b' : item.type === 'system' ? '#38bdf8' : '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(`[${item.user}]`, 26, y + (lineHeight - 6) / 2 + 3);

        // Text Payload
        ctx.fillStyle = '#cccccc';
        const tagWidth = 85;
        ctx.fillText(item.text, 26 + tagWidth, y + (lineHeight - 6) / 2 + 3);

        // Ping badge
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.textAlign = 'right';
        ctx.fillText(item.ping, width - 26, y + (lineHeight - 6) / 2 + 3);
      });

      // 3. Clean Event Bus Static Rule Line (No moving dot)
      const pipeY = height - 20;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(16, pipeY);
      ctx.lineTo(width - 16, pipeY);
      ctx.stroke();

      ctx.font = '8px "Space Mono", monospace';
      ctx.fillStyle = '#888888';
      ctx.textAlign = 'left';
      ctx.fillText('SOCKET.IO EVENT BUS • CONNECTED', 16, pipeY + 14);

      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText('SUB-25MS LATENCY VERIFIED', width - 16, pipeY + 14);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="quantum-visualizer-canvas" />;
}

// ============================================================================
// STAGE 03: June 2026 (3-Day Sprint)
// Roasting AI: Google Gemini LLM Prompt-to-Token Streaming Pipeline
// ============================================================================
export function RoastingAITokenStreamCanvas({ isActive = true }) {
  const canvasRef = useRef(null);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const parent = canvas.parentElement;
    let width = parent?.clientWidth || 380;
    let height = parent?.clientHeight || 280;

    const resize = () => {
      if (!canvas || !parent) return;
      width = parent.clientWidth || 380;
      height = parent.clientHeight || 280;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const roastQuotes = [
      'Your code has more unhandled promises than a politician.',
      'That nested loop is deeper than the Mariana Trench.',
      'Even your linter gave up and closed the file.',
      'Running on 99% prayers and 1% console.log().',
      'Your git commits read like a dramatic thriller novel.'
    ];

    let frame = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isActiveRef.current) return;

      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Model Header Bar
      const headerY = 16;
      ctx.fillStyle = 'rgba(16, 16, 24, 0.85)';
      ctx.fillRect(16, headerY, width - 32, 28);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.strokeRect(16, headerY, width - 32, 28);

      ctx.font = '9px "Space Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('MODEL: GOOGLE GEMINI API', 28, headerY + 18);

      ctx.fillStyle = '#818cf8';
      ctx.fillText('[SARCASTIC_DEV]', Math.min(185, width * 0.45), headerY + 18);

      ctx.fillStyle = '#10b981';
      ctx.textAlign = 'right';
      ctx.fillText('TTFB: < 540MS', width - 28, headerY + 18);

      // 2. Streaming Output Window
      const streamWindowY = 54;
      const streamWindowH = height - 98;
      ctx.fillStyle = 'rgba(10, 10, 14, 0.9)';
      ctx.fillRect(16, streamWindowY, width - 32, streamWindowH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.strokeRect(16, streamWindowY, width - 32, streamWindowH);

      // Stream Buffer Sub-Header
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(16, streamWindowY, width - 32, 22);
      ctx.font = '8px "Space Mono", monospace';
      ctx.fillStyle = '#777777';
      ctx.textAlign = 'left';
      ctx.fillText('STREAM BUFFER • REAL-TIME TOKEN GENERATOR', 26, streamWindowY + 15);

      const activeRoastIdx = Math.floor(frame / 240) % roastQuotes.length;
      const fullText = roastQuotes[activeRoastIdx];
      const charProgress = Math.min(fullText.length, Math.floor((frame % 240) / 2));
      const visibleText = fullText.slice(0, charProgress);

      // Render Streaming Text with subtle terminal cursor
      ctx.font = '11px "Space Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';

      const words = visibleText.split(' ');
      let line = '';
      let lineY = streamWindowY + 44;
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > width - 70 && i > 0) {
          ctx.fillText(line, 28, lineY);
          line = words[i] + ' ';
          lineY += 20;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 28, lineY);

      if (Math.floor(frame / 18) % 2 === 0 && charProgress < fullText.length) {
        const lastLineWidth = ctx.measureText(line).width;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(28 + lastLineWidth + 2, lineY - 9, 6, 12);
      }

      // 3. Clean Stream Telemetry Footer (No looping loading bar)
      const footerY = height - 18;
      ctx.font = '8.5px "Space Mono", monospace';
      ctx.fillStyle = '#888888';
      ctx.textAlign = 'left';
      ctx.fillText('THROUGHPUT: ~84 TOKENS/SEC', 16, footerY);

      // Clean static indicator instead of looping loading bar
      const barW = Math.max(60, width - 320);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(170, footerY - 8, barW, 4);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(170, footerY - 8, barW, 4);

      ctx.fillStyle = '#10b981';
      ctx.textAlign = 'right';
      ctx.fillText('STATUS: STREAMING', width - 16, footerY);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="quantum-visualizer-canvas" />;
}

// ============================================================================
// STAGE 04: 2026 Production SaaS
// AI Resume Builder: Decoupled Cloudflare Edge + Gemini ATS Parser (98.4%)
// ============================================================================
export function EdgeResumeATSParserCanvas({ isActive = true }) {
  const canvasRef = useRef(null);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const parent = canvas.parentElement;
    let width = parent?.clientWidth || 380;
    let height = parent?.clientHeight || 280;

    const resize = () => {
      if (!canvas || !parent) return;
      width = parent.clientWidth || 380;
      height = parent.clientHeight || 280;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const scanCategories = [
      { name: 'KEYWORDS (React, Node, SQL)', score: 98 },
      { name: 'STRUCTURE (ATS Formatted)', score: 100 },
      { name: 'IMPACT METRICS (Quantified)', score: 96 },
      { name: 'SECURITY (Google OAuth PKCE)', score: 100 }
    ];

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isActiveRef.current) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Top Architecture Gateway Bar
      const headerY = 16;
      ctx.fillStyle = 'rgba(16, 16, 24, 0.85)';
      ctx.fillRect(16, headerY, width - 32, 28);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.strokeRect(16, headerY, width - 32, 28);

      ctx.font = '9px "Space Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('EDGE: CLOUDFLARE PAGES', 28, headerY + 18);

      ctx.fillStyle = '#10b981';
      ctx.fillText('AUTH: OAUTH 2.0 PKCE', Math.min(170, width * 0.45), headerY + 18);

      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('POSTGRESQL', width - 28, headerY + 18);

      // 2. Clean ATS Parser Scoring Pane (No moving laser scanner line)
      const scanCardY = 54;
      const scanCardH = height - 90;
      ctx.fillStyle = 'rgba(10, 10, 14, 0.9)';
      ctx.fillRect(16, scanCardY, width - 32, scanCardH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.strokeRect(16, scanCardY, width - 32, scanCardH);

      // Left Column: Category Progress Bars
      const barBaseY = scanCardY + 22;
      const barSpacing = Math.min(28, (scanCardH - 30) / 4);

      scanCategories.forEach((cat, idx) => {
        const y = barBaseY + idx * barSpacing;

        ctx.font = '8px "Space Mono", monospace';
        ctx.fillStyle = '#aaaaaa';
        ctx.textAlign = 'left';
        ctx.fillText(cat.name, 28, y);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        const rightLimit = width > 340 ? width - 105 : width - 75;
        ctx.fillText(`${cat.score}%`, rightLimit, y);

        // Progress bar
        const barW = Math.max(60, rightLimit - 30);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(28, y + 4, barW, 4);

        const fillW = (cat.score / 100) * barW;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(28, y + 4, fillW, 4);
      });

      // Right Column: Overall ATS Score Circular Gauge
      if (width > 320) {
        const gaugeX = width - 58;
        const gaugeY = scanCardY + scanCardH / 2;
        const gaugeRadius = Math.min(30, scanCardH * 0.28);

        ctx.beginPath();
        ctx.arc(gaugeX, gaugeY, gaugeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 3;
        ctx.stroke();

        const startAngle = -Math.PI / 2;
        const scoreProgress = 0.984; // 98.4%
        ctx.beginPath();
        ctx.arc(gaugeX, gaugeY, gaugeRadius, startAngle, startAngle + Math.PI * 2 * scoreProgress);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.font = '10.5px "Space Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('98.4%', gaugeX, gaugeY - 3);

        ctx.font = '6.5px "Space Mono", monospace';
        ctx.fillStyle = '#888888';
        ctx.fillText('ATS SCORE', gaugeX, gaugeY + 9);
      }

      // 3. Clean Architecture Status Footer
      const footerY = height - 16;
      ctx.font = '8.5px "Space Mono", monospace';
      ctx.fillStyle = '#888888';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('LATENCY: 74MS TTFB • ZERO PERSISTENCE OF RAW PDFS', 16, footerY);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#10b981';
      ctx.fillText('VERIFIED', width - 16, footerY);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="quantum-visualizer-canvas" />;
}
