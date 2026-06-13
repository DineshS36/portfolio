
export default function Timeline() {
  const experiences = [
    {
      date: 'Year 1',
      title: 'Started Programming',
      desc: 'Began learning programming fundamentals and problem-solving through consistent practice and small projects.'
    },
    {
      date: 'Year 2',
      title: 'Started Web Development',
      desc: 'Started building web applications and learning how to structure front-end and back-end features for real user experiences.'
    },
    {
      date: 'Year 2–3',
      title: 'Learned React',
      desc: 'Focused on React fundamentals and component-based UI development, building interactive pages and improving code organization.'
    },
    {
      date: 'Year 3',
      title: 'Built Chat Application',
      desc: 'Developed a real-time chat application with an emphasis on smooth UI and dependable message flow.'
    },
    {
      date: 'Year 4',
      title: 'Built AI Roasting Application',
      desc: 'Built an AI roasting app that turns user input into generated outputs, refining the end-to-end experience.'
    },
    {
      date: 'Year 4',
      title: 'Started AIML Specialization',
      desc: 'Began deeper coursework and practical work in Artificial Intelligence and Machine Learning to strengthen applied knowledge.'
    }
  ];

  return (
    <section id="experience" className="container">
      <h2 className="section-title uppercase gsap-reveal">
        <span className="text-dark-gray">4.</span>My<br />Timeline
      </h2>
      <div className="timeline">
        {experiences.map((exp, index) => (
          <div key={index} className="timeline-item gsap-reveal hoverable">
            <div className="timeline-dot" />
            <div className="timeline-text">
              <div className="timeline-date uppercase">{exp.date}</div>
              <h3 className="timeline-title uppercase text-glow">{exp.title}</h3>
              <p className="timeline-desc">{exp.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
