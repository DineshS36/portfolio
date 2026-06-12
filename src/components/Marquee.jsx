import React from 'react';

export default function Marquee() {
  const skills = ['PyTorch', 'TensorFlow', 'LLMs', 'Computer Vision', 'Data Science', 'Python', 'MLOps'];

  return (
    <div className="marquee-container gsap-reveal">
      <div className="marquee-track">
        {/* Render group 1 */}
        {skills.map((skill, index) => (
          <span key={`g1-${index}`} className="marquee-item">
            {skill}
          </span>
        ))}
        {/* Render group 2 (duplicate for seamless loop) */}
        {skills.map((skill, index) => (
          <span key={`g2-${index}`} className="marquee-item">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
