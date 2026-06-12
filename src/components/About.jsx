import React from 'react';

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
            I architect intelligent systems at the intersection of deep learning and scalable software engineering. Utilizing state-of-the-art neural networks and modern frameworks to construct robust, high-performance AI solutions.
          </p>
          <div className="font-mono text-gray skill-list text-sm">
            <p><span style={{ color: '#fff' }}>&gt;</span> PyTorch / TensorFlow</p>
            <p><span style={{ color: '#fff' }}>&gt;</span> Computer Vision & NLP</p>
            <p><span style={{ color: '#fff' }}>&gt;</span> Data Engineering</p>
            <p><span style={{ color: '#fff' }}>&gt;</span> Cloud Architecture (AWS/GCP)</p>
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
