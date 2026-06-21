
import { useMemo, useState } from 'react';
import ProjectModal from './ProjectModal';

import chatup1 from '../assets/chatup-1.png';
import chatup2 from '../assets/chatup-2.png';

import roast1 from '../assets/roast-1.png';
import roast2 from '../assets/roast-2.png';
import roast3 from '../assets/roast-3.png';

import resumeMain from '../assets/resume.png';
import resume1 from '../assets/resume1.png';
import resume2 from '../assets/resume2.png';
import resume3 from '../assets/resume3.png';

export default function Work() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(null);

  const projects = useMemo(
    () => [
      {
        bgClass: 'bg-3',
        shortTitle: 'AI Resume Builder',
        category: 'SAAS • FULL-STACK AI • DECOUPLED',
        tagline: 'AI-Powered Resume Builder',
        description:
          'A production-ready SaaS platform that transforms PDFs into ATS-optimized resumes. Built with a decoupled architecture utilizing a Next.js static edge frontend and an Express/PostgreSQL backend, secured by Google OAuth 2.0 and custom JWTs.',
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
        title: 'AI Resume Builder',
        images: [resumeMain, resume1, resume2, resume3],
        githubUrl: 'https://github.com/DineshS36/resume-analyser',
        liveDemoUrl: '#'
      },
      {
        bgClass: 'bg-1',
        shortTitle: 'ChatUp',
        category: 'Full Stack • Realtime',
        tagline: 'Real-Time Web Chat Application',
        description:
          'A modern real-time chatting platform that enables users to communicate instantly through a responsive web interface. The application focuses on seamless messaging, intuitive user experience, and real-time communication.',
        techStack: ['React', 'Node.js', 'Express.js', 'Socket.io', 'MongoDB'],
        features: [
          'Real-time messaging',
          'Responsive interface',
          'Fast communication',
          'Modern chat experience'
        ],
        title: 'ChatUp',
        images: [chatup1, chatup2],
        githubUrl: 'https://github.com/DineshS36/chatup',
        liveDemoUrl: '#'
      },
      {
        bgClass: 'bg-2',
        shortTitle: 'AI Roast Generator',
        category: 'Artificial Intelligence • Web App',
        tagline: 'AI-Powered Roast Generator',
        description:
          'An AI-based web application that generates humorous and context-aware roasts using large language models. The application demonstrates AI integration, prompt engineering, and interactive user experiences.',
        techStack: ['React', 'Node.js', 'Gemini API'],
        features: [
          'AI-generated responses',
          'Prompt engineering',
          'Instant roast generation',
          'Interactive UI'
        ],
        title: 'AI Roast Generator',
        images: [roast1, roast2, roast3],
        githubUrl: 'https://github.com/DineshS36/Roasting_AI',
        liveDemoUrl: '#'
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
