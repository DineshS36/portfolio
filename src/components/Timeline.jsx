import React from 'react';

export default function Timeline() {
  const experiences = [
    {
      date: '2024 - Present',
      title: 'Machine Learning Researcher',
      desc: 'Researching and deploying state-of-the-art transformer models. Optimizing inference latency and fine-tuning large language models for domain-specific applications.'
    },
    {
      date: '2022 - 2024',
      title: 'Data Scientist Intern',
      desc: 'Developed scalable data pipelines for predictive analytics. Implemented machine learning algorithms that improved forecasting accuracy by 40%.'
    },
    {
      date: '2020 - 2022',
      title: 'AI / ML Student',
      desc: 'Focusing on advanced mathematics, statistics, and deep learning algorithms. Building foundational knowledge in neural networks and artificial intelligence.'
    }
  ];

  return (
    <section id="experience" className="container">
      <h2 className="section-title uppercase gsap-reveal">
        <span className="text-dark-gray">03.</span> System<br />History.
      </h2>
      <div className="timeline">
        {experiences.map((exp, index) => (
          <div key={index} className="timeline-item gsap-reveal hoverable">
            <div className="timeline-dot" />
            <span className="timeline-date uppercase">{exp.date}</span>
            <h3 className="timeline-title uppercase text-glow">{exp.title}</h3>
            <p className="timeline-desc">{exp.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
