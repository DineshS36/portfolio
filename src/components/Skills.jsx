
const categories = [
  {
    title: 'Frontend',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind']
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Express']
  },
  {
    title: 'Database',
    skills: ['MongoDB']
  },
  {
    title: 'AI/ML',
    skills: ['Python', 'TensorFlow']
  },
  {
    title: 'Cloud',
    skills: ['Cloudflare', 'GitHub']
  }
];

function SkillCard({ title, skills }) {
  return (
    <div className="skill-card">
      <div className="skill-card-inner">
        <h3 className="skill-card-title uppercase">{title}</h3>
        <ul className="skill-list">
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
    <section id="skills" className="container">
      <h2 className="section-title uppercase">
        <span className="text-dark-gray">3.</span> Skills<br />I Have
      </h2>

      <div className="skills-grid">
        {categories.map((cat) => (
          <SkillCard key={cat.title} title={cat.title} skills={cat.skills} />
        ))}
      </div>
    </section>
  );
}
