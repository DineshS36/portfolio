
export default function Work() {
  // Portfolio project cards (JSON data)
  const projects = [
    {
      bgClass: 'bg-1',
      shortTitle: 'Real-time Chat Application',
      category: 'Full Stack • Realtime',
      tagline: 'Instant messaging with a smooth, responsive UI.',
      description:
        'A real-time chat app built to handle fast message delivery and clean conversation views. I focused on reliable updates, efficient state handling, and a friendly user experience. The system supports active conversations, fast UI rendering, and thoughtful UX details for everyday messaging.',
      techStack: ['React', 'Node.js', 'WebSockets', 'REST APIs', 'SQL/NoSQL'],
      keyFeatures: [
        'Live message streaming',
        'Conversation-focused UI',
        'User-friendly typing & status',
        'Scalable backend endpoints'
      ],
      title: 'Real-time Chat Application'
    },
    {
      bgClass: 'bg-2',
      shortTitle: 'AI Roasting App',
      category: 'Artificial Intelligence • Web App',
      tagline: 'Generate fun roasts with an AI-powered experience.',
      description:
        'An AI roasting app that turns user prompts into entertaining outputs. I built the flow end-to-end: collecting input, generating responses with machine learning, and presenting results clearly. The goal was to combine creativity with practical engineering—fast interactions, clean UI, and reliable deployment.',
      techStack: ['React', 'Python', 'NLP/LLM', 'API Layer', 'Cloud Deployment'],
      keyFeatures: [
        'Prompt-to-roast generation',
        'Interactive, lightweight UI',
        'Safety-aware output handling',
        'Cloud-ready deployment'
      ],
      title: 'AI Roasting App'
    }
  ];

  return (
    <section id="work" className="container">
      <h2 className="section-title uppercase gsap-reveal" style={{ marginBottom: '4rem' }}>
        <span className="text-dark-gray">02.</span> Selected<br />Works.
      </h2>
      
      <div className="work-grid">
        {projects.map((proj, index) => (
          <div key={index} className="project-card hoverable gsap-work-card">
            <div className={`project-bg ${proj.bgClass}`} />
            <div className="project-overlay" />
            <div className="project-info">
              <p className="font-mono project-category text-gray uppercase">{proj.category}</p>
              <h3 className="project-title text-glow uppercase">{proj.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
