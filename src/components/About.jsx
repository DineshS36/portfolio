import dineshPhoto from '../assets/MYphoto.jpeg';
import EngineeringTelemetry from './EngineeringTelemetry';
import Timeline from './Timeline';

export default function About() {
  return (
    <div className="about-page-wrapper">
      {/* 1. Core Background & Engineering Philosophy */}
      <section id="about" className="container about-intro-section">
        <div className="about-grid">
          <div className="gsap-reveal">
            <h2 className="section-title uppercase">
              <span className="text-dark-gray">1.</span> About Me
            </h2>
            <div className="divider" />
            <p className="text-gray about-text">
              I’m Dinesh, an AI-Native Full Stack Developer and 4th-year AIML student specializing in architecture-driven, AI-augmented engineering. Rather than spending weeks writing boilerplate code by hand, I operate at the architectural level: designing decoupled system flows, data schemas, API contracts, and responsive UI layouts with HTML, CSS, and Tailwind. By directing generative AI as an engineering co-pilot, I synthesize, debug, and deploy production-ready cloud applications to Cloudflare Pages and Vercel at rapid sprint velocities.
            </p>
            <div className="font-mono text-gray skill-list text-sm">
              <p><span style={{ color: '#fff' }}></span> System Architecture & Data Flows</p>
              <p><span style={{ color: '#fff' }}></span> AI-Augmented Code Synthesis & Prompting</p>
              <p><span style={{ color: '#fff' }}></span> UI Layout Craft (HTML, CSS, Tailwind)</p>
              <p><span style={{ color: '#fff' }}></span> Cloud & Edge Deployments (Cloudflare & Vercel)</p>
            </div>
          </div>

          <div className="abstract-box hoverable gsap-reveal">
            <div className="about-photo-wrapper">
              <img
                src={dineshPhoto}
                alt="Dinesh - Full Stack Developer & AI Engineer"
                className="about-photo-img"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* Real-Time Engineering Telemetry & Verified Command Channels */}
        <EngineeringTelemetry />
      </section>

      {/* 2. Interactive Evolution Roadmap */}
      <Timeline />
    </div>
  );
}

