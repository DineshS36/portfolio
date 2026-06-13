import react from 'react';

export default function About() {
  return (
    <section id="about" className="container">
      <div className="about-grid">
        <div className="gsap-reveal">
          <h2 className="section-title uppercase">
            <span className="text-dark-gray">01.</span> Abstract<br />Thinking.
          </h2>
          <div className="divider"></div>
          <p className="text-gray about-text">
            I’m Dinesh, a Full Stack Developer and 4th-year AIML student. I build practical products that blend Artificial Intelligence with clean, scalable software—turning ideas into real-time experiences. I also work with Cloud Technologies to deploy and iterate reliably. My focus is to keep learning continuously, whether it’s improving ML models, refining front-end and back-end flows, or exploring new tools and best practices for production-ready systems.
          </p>
          <div className="font-mono text-gray skill-list text-sm">
            <p><span style={{ color: '#fff' }}></span> Artificial Intelligence</p>
            <p><span style={{ color: '#fff' }}></span> Full-stack Development</p>
            <p><span style={{ color: '#fff' }}></span> Cloud Technologies (AWS / GCP)</p>
            <p><span style={{ color: '#fff' }}></span> Continuous learning</p>
          </div>
        </div>

        <div className="abstract-box hoverable gsap-reveal">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
    </section>
  );
}
