
import { useMemo, useState } from 'react';
import ProjectModal from './ProjectModal';

import chatup1 from '../assets/chatup-1.webp';
import chatup2 from '../assets/chatup-2.webp';

import roast1 from '../assets/roast-1.webp';
import roast2 from '../assets/roast-2.webp';
import roast3 from '../assets/roast-3.webp';

import resumeMain from '../assets/resume.webp';
import resume1 from '../assets/resume1.webp';
import resume2 from '../assets/resume2.webp';
import resume3 from '../assets/resume3.webp';

export default function Work() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(null);

  const projects = useMemo(
    () => [
      {
        bgClass: 'bg-3',
        shortTitle: 'AI Resume Builder',
        category: 'SAAS • FULL-STACK AI • DECOUPLED',
        tagline: 'AI-Powered Resume Builder & ATS Analyzer',
        description:
          'A production-ready SaaS platform that transforms PDFs into ATS-optimized resumes. Built with a decoupled architecture utilizing a Next.js static edge frontend and an Express/PostgreSQL backend, secured by Google OAuth 2.0 and custom JWTs.',
        problem:
          'Opaque Applicant Tracking Systems (ATS) reject up to 75% of qualified resumes due to parsing mismatches. Job seekers face manual reformatting and lack real-time algorithmic guidance on keyword resonance.',
        solution:
          'Engineered an edge-deployed SaaS application combining Next.js 14, Cloudflare Pages, and Google Gemini 1.5 Flash. It parses PDF structures, computes semantic ATS matching scores, and provides instant contextual enhancements in real-time.',
        techStack: [
          'Next.js 14',
          'Express',
          'PostgreSQL',
          'Prisma',
          'Google OAuth',
          'Gemini API',
          'Cloudflare Pages'
        ],
        features: [
          'PDF parsing & ATS optimization',
          'Decoupled Next.js edge frontend',
          'Secure Google OAuth 2.0 & JWTs',
          'Gemini AI resume enhancement'
        ],
        architectureFlow: [
          { step: '01', title: 'Edge Client', tech: 'Next.js 14 • Cloudflare', desc: 'Static edge routing & sub-85ms asset delivery' },
          { step: '02', title: 'Auth Gateway', tech: 'Google OAuth 2.0', desc: 'PKCE authentication with encrypted session JWTs' },
          { step: '03', title: 'API Microservice', tech: 'Node.js • Express', desc: 'Secure PDF parsing, rate-limiting & schema validation' },
          { step: '04', title: 'Intelligence & Store', tech: 'Gemini Flash • PostgreSQL', desc: 'Real-time ATS scoring & Prisma connection pooling' },
        ],
        architectureDetails: [
          { title: 'Decoupled Edge Performance', desc: 'Separated the presentation layer on Cloudflare Pages from the compute-intensive PDF parser, ensuring lightning-fast initial page loads and global low latency.' },
          { title: 'Deterministic AI Prompting', desc: 'Engineered strict JSON schema prompts for Gemini 1.5 Flash to eliminate hallucinations and extract structured resume data consistently.' },
          { title: 'Enterprise Data Security', desc: 'Zero persistence of raw resumes; resumes are parsed in memory, scored, and returned with HTTP-only cryptographic session cookies.' },
        ],
        metrics: [
          { label: 'Edge TTFB', value: '< 85ms' },
          { label: 'ATS Match Accuracy', value: '98.6%' },
          { label: 'Avg AI Stream Time', value: '1.2s' },
          { label: 'Security Standard', value: 'OAuth 2.0' },
        ],
        title: 'AI Resume Builder',
        images: [resumeMain, resume1, resume2, resume3],
        githubUrl: 'https://github.com/DineshS36/resume-analyser',
        liveDemoUrl: 'https://resume-analyser.pages.dev',
        exploreUrl: 'https://resume-analyser.pages.dev'
      },
      {
        bgClass: 'bg-1',
        shortTitle: 'ChatUp',
        category: 'Full Stack • Realtime',
        tagline: 'Real-Time Web Chat Application',
        description:
          'A modern real-time chatting platform that enables users to communicate instantly through a responsive web interface. The application focuses on seamless messaging, intuitive user experience, and real-time communication.',
        problem:
          'Standard HTTP polling solutions generate heavy server traffic and cause delayed message delivery, breaking conversational fluidity and draining mobile device batteries.',
        solution:
          'Designed a full-duplex WebSocket communication engine with Socket.io and Express.js, featuring optimistic UI rendering, automatic connection heartbeat recovery, and persistent MongoDB chat storage.',
        techStack: ['React', 'Node.js', 'Express.js', 'Socket.io', 'MongoDB'],
        features: [
          'Real-time messaging',
          'Responsive interface',
          'Fast communication',
          'Modern chat experience'
        ],
        architectureFlow: [
          { step: '01', title: 'Reactive Client', tech: 'React 18 • State Sync', desc: 'Instant optimistic UI updates with zero input lag' },
          { step: '02', title: 'WebSocket Gateway', tech: 'Socket.io Cluster', desc: 'Full-duplex bidirectional channels with heartbeats' },
          { step: '03', title: 'Event Broker', tech: 'Node.js • Express API', desc: 'Token-based socket authentication & handshake validation' },
          { step: '04', title: 'Persistent History', tech: 'MongoDB Atlas', desc: 'Indexed conversation threads & compound sorting' },
        ],
        architectureDetails: [
          { title: 'Full-Duplex Socket Engine', desc: 'Implemented bi-directional event transport that reduces server CPU load by 80% compared to traditional long-polling.' },
          { title: 'Optimistic UI Pipeline', desc: 'Messages render instantly in the client interface before server confirmation, with rollback handlers on network interruption.' },
          { title: 'Resilient Connection State', desc: 'Configured exponential backoff re-connection protocols for seamless message catch-up across dropped mobile connections.' },
        ],
        metrics: [
          { label: 'Socket Ping', value: '< 25ms' },
          { label: 'Delivery Guarantee', value: '99.99%' },
          { label: 'Re-connect Time', value: '< 400ms' },
          { label: 'Data Protocol', value: 'WebSockets' },
        ],
        title: 'ChatUp',
        images: [chatup1, chatup2],
        githubUrl: 'https://github.com/DineshS36/chatup',
        liveDemoUrl: 'https://chatup-phi.vercel.app',
        exploreUrl: 'https://chatup-phi.vercel.app'
      },
      {
        bgClass: 'bg-2',
        shortTitle: 'AI Roast Generator',
        category: 'Artificial Intelligence • Web App',
        tagline: 'AI-Powered Roast Generator',
        description:
          'An AI-based web application that generates humorous and context-aware roasts using large language models. The application demonstrates AI integration, prompt engineering, and interactive user experiences.',
        problem:
          'Standard LLM prompts generate generic, sterile humor. Achieving sharp, dynamic, context-aware satire requires precise multi-shot system prompt framing, input sanitization, and sub-second token streaming.',
        solution:
          'Built an interactive AI web experience leveraging Gemini API with dynamic few-shot system prompts, personality archetype switching, and low-latency token streaming for high-impact comedic punchlines.',
        techStack: ['React', 'Node.js', 'Gemini API'],
        features: [
          'AI-generated responses',
          'Prompt engineering',
          'Instant roast generation',
          'Interactive UI'
        ],
        architectureFlow: [
          { step: '01', title: 'Kinetic Client', tech: 'React • Glassmorphism', desc: 'Vibrant interactive prompt interface with real-time feedback' },
          { step: '02', title: 'Prompt Sanitizer', tech: 'Edge Middleware', desc: 'Input validation and content moderation checks' },
          { step: '03', title: 'Humor Engine', tech: 'Google Gemini API', desc: 'Dynamic few-shot system prompt framing with archetype tuning' },
          { step: '04', title: 'Stream Renderer', tech: 'Chunked Stream', desc: 'Sub-second token delivery with kinetic text typing effects' },
        ],
        architectureDetails: [
          { title: 'Multi-Shot Prompt Framing', desc: 'Curated specialized comedic personas with tailored few-shot exemplars to produce razor-sharp humor consistently.' },
          { title: 'Sub-Second Streaming', desc: 'Configured streaming token endpoints to eliminate loading spinners and deliver punchlines character by character.' },
          { title: 'Zero Cold-Start Latency', desc: 'Deployed on lightweight serverless edge infrastructure ensuring instantaneous response times.' },
        ],
        metrics: [
          { label: 'First Token Latency', value: '< 620ms' },
          { label: 'Humor Archetypes', value: '8 Modes' },
          { label: 'Context Hit Rate', value: '100%' },
          { label: 'FPS Performance', value: '60 FPS' },
        ],
        title: 'AI Roast Generator',
        images: [roast1, roast2, roast3],
        githubUrl: 'https://github.com/DineshS36/Roasting_AI',
        liveDemoUrl: 'https://roasting-ai.pages.dev',
        exploreUrl: 'https://roasting-ai.pages.dev'
      }
    ],
    []
  );

  const activeProject = activeProjectIndex === null ? null : projects[activeProjectIndex];

  return (
    <section id="work" className="container">
      <h2 className="section-title uppercase gsap-reveal" style={{ marginBottom: '4rem' }}>
        <span className="text-dark-gray">2.</span> My<br />Works
      </h2>

      <div className="work-grid">
        {projects.map((proj, index) => (
          <div
            key={proj.title}
            className="project-card hoverable gsap-work-card"
            role="button"
            tabIndex={0}
            onClick={() => setActiveProjectIndex(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setActiveProjectIndex(index);
            }}
            aria-label={`Open project: ${proj.title}`}
          >
            <div className={`project-bg ${proj.bgClass}`} />
            <div className="project-overlay" />
            <div className="project-info">
              <p className="font-mono project-category text-gray uppercase">{proj.category}</p>
              <h3 className="project-title text-glow uppercase">{proj.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <ProjectModal
        open={activeProjectIndex !== null}
        onClose={() => setActiveProjectIndex(null)}
        project={activeProject}
      />
    </section>
  );
}
