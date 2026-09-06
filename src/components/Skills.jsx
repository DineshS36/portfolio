
const categories = [
  {
    tag: 'CLIENT-SIDE ARCHITECTURE',
    title: 'Frontend & UI Engineering',
    summary: 'Component hierarchy, state orchestration, and responsive interactive web layouts.',
    skills: ['React.js', 'Next.js 14', 'JavaScript (ES6+)', 'HTML5', 'CSS3 Layouts', 'Tailwind CSS', 'GSAP']
  },
  {
    tag: 'EVENT BROKER & SERVICES',
    title: 'Backend & Real-Time APIs',
    summary: 'Full-duplex WebSocket channels, RESTful API microservices, and secured authorization.',
    skills: ['Node.js', 'Express.js', 'Socket.io', 'WebSockets', 'RESTful APIs', 'JWT Auth', 'OAuth 2.0 PKCE']
  },
  {
    tag: 'PERSISTENCE & SCHEMAS',
    title: 'Database Engineering',
    summary: 'Document collections, relational schemas, connection pooling, and ORM pipelines.',
    skills: ['MongoDB', 'MongoDB Atlas', 'PostgreSQL', 'Prisma ORM', 'Mongoose', 'Database Indexing']
  },
  {
    tag: 'APPLIED INTELLIGENCE',
    title: 'Generative AI & ML',
    summary: 'Multi-shot prompt engineering, sub-second token streaming, and model foundations.',
    skills: ['Google Gemini API', '@google/generative-ai', 'Prompt Engineering', 'Token Streaming', 'Python', 'TensorFlow']
  },
  {
    tag: 'EDGE & DISTRIBUTED RUNTIMES',
    title: 'Cloud & Infrastructure',
    summary: 'Edge-distributed static hosting, continuous deployment, and serverless compute.',
    skills: ['Cloudflare Pages', 'Cloudflare Workers', 'Vercel', 'AWS', 'GCP', 'Git', 'GitHub']
  },
  {
    tag: 'SYSTEM ARCHITECTURE',
    title: 'Architectural Standards',
    summary: 'Decoupled presentation layers, clean code, low-latency execution, and continuous learning.',
    skills: ['Decoupled Architecture', 'Sub-85ms TTFB', 'System Design', 'Rapid Sprints', 'Production Reliability']
  }
];

function SkillCard({ tag, title, summary, skills }) {
  return (
    <div className="skill-card hoverable">
      <div className="skill-card-inner">
        <div className="skill-card-top font-mono">
          <span className="skill-tag uppercase">{tag}</span>
        </div>
        <h3 className="skill-card-title uppercase text-glow">{title}</h3>
        <p className="skill-card-summary text-gray">{summary}</p>
        <ul className="skill-list font-mono">
          {skills.map((s) => (
            <li key={s} className="skill-pill">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="container skills-page-section">
      <div className="gsap-reveal skills-header">
        <h2 className="section-title uppercase">
          <span className="text-dark-gray">3.</span> Skills &<br />Expertise
        </h2>
        <div className="divider" />
      </div>

      <div className="skills-grid">
        {categories.map((cat) => (
          <SkillCard
            key={cat.title}
            tag={cat.tag}
            title={cat.title}
            summary={cat.summary}
            skills={cat.skills}
          />
        ))}
      </div>

    </section>
  );
}
