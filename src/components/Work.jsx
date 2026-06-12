import React from 'react';

export default function Work() {
  const projects = [
    {
      bgClass: 'bg-1',
      category: 'Computer Vision',
      title: 'DEEPVISION'
    },
    {
      bgClass: 'bg-2',
      category: 'Generative AI',
      title: 'NEURAL FORGE'
    },
    {
      bgClass: 'bg-3',
      category: 'NLP Models',
      title: 'SENTIMENT X'
    },
    {
      bgClass: 'bg-4',
      category: 'Predictive Modeling',
      title: 'QUANTUM PRED'
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
