import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import useTextScramble from '../hooks/useTextScramble';
import { useAudio } from '../hooks/useAudio';
import Footer from './Footer';

export default function Contact() {
  const contactBtnRef = useRef(null);
  const { playHoverSound, playClickSound } = useAudio();

  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderMessage: ''
  });
  const [statusMsg, setStatusMsg] = useState('');

  const {
    displayText: btnText,
    onMouseEnter: btnEnter,
    onMouseLeave: btnLeave
  } = useTextScramble('console.log("contact_me")');

  useEffect(() => {
    const btn = contactBtnRef.current;
    if (!btn) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    playClickSound();

    if (!formData.senderName || !formData.senderMessage) {
      setStatusMsg('Please enter your name and message.');
      return;
    }

    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.senderName}`);
    const body = encodeURIComponent(
      `Name: ${formData.senderName}\nEmail: ${formData.senderEmail}\n\nMessage:\n${formData.senderMessage}`
    );

    window.location.href = `mailto:itsdinesh036@gmail.com?subject=${subject}&body=${body}`;
    setStatusMsg('Transmission initiated via mail client.');
  };

  return (
    <>
      <section id="contact" className="container contact-page-section">
        <div className="gsap-reveal contact-header">
          <h2 className="section-title uppercase">
            <span className="text-dark-gray">4.</span> Initiate<br />Sequence
          </h2>
          <div className="divider" />
        </div>

        <div className="contact-grid">
          {/* Left Column: Direct Inquiries & Telemetry */}
          <div className="contact-info-pane gsap-reveal">
            <p className="contact-lead text-gray">
              Ready to construct something beyond the ordinary? Let’s engineer scalable full-stack applications, real-time messaging pipelines, and applied Generative AI systems.
            </p>

            <div className="contact-btn-wrap">
              <a
                href="mailto:itsdinesh036@gmail.com"
                ref={contactBtnRef}
                className="contact-btn hoverable font-mono"
                onMouseEnter={btnEnter}
                onMouseLeave={btnLeave}
                onClick={playClickSound}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>{btnText}</span>
              </a>
            </div>

            <div className="contact-telemetry-list font-mono">
              <div className="telemetry-row">
                <span className="telemetry-label text-gray">DIRECT EMAIL</span>
                <a href="mailto:itsdinesh036@gmail.com" className="telemetry-link hoverable">
                  itsdinesh036@gmail.com
                </a>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label text-gray">BASE LOCATION</span>
                <span className="telemetry-text">Chennai, India (IST • UTC+5:30)</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label text-gray">DISCIPLINE</span>
                <span className="telemetry-text">Full Stack Developer & 4th-Year AIML</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label text-gray">COLLABORATION</span>
                <span className="telemetry-text text-glow">Open for Production Opportunities</span>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Dispatch Terminal */}
          <div className="contact-terminal-box hoverable gsap-reveal font-mono">
            <div className="contact-terminal-topbar">
              <div className="terminal-dots">
                <span className="t-dot" />
                <span className="t-dot" />
                <span className="t-dot" />
              </div>
              <span className="terminal-title uppercase">DIRECT TRANSMISSION TERMINAL</span>
            </div>

            <form className="contact-form" onSubmit={handleFormSubmit}>
              <div className="form-field">
                <label className="field-label text-gray uppercase" htmlFor="sender-name">Your Name</label>
                <input
                  id="sender-name"
                  type="text"
                  className="field-input hoverable"
                  placeholder="e.g. Alex Mercer"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label className="field-label text-gray uppercase" htmlFor="sender-email">Your Email</label>
                <input
                  id="sender-email"
                  type="email"
                  className="field-input hoverable"
                  placeholder="alex@company.com"
                  value={formData.senderEmail}
                  onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label className="field-label text-gray uppercase" htmlFor="sender-message">Message / Project Brief</label>
                <textarea
                  id="sender-message"
                  className="field-input field-textarea hoverable"
                  placeholder="Describe your vision, system requirements, or inquiry..."
                  rows={4}
                  value={formData.senderMessage}
                  onChange={(e) => setFormData({ ...formData, senderMessage: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="dispatch-submit-btn hoverable uppercase"
                onMouseEnter={playHoverSound}
              >
                Transmit Message →
              </button>

              {statusMsg && (
                <div className="form-status-msg text-glow font-mono">
                  {statusMsg}
                </div>
              )}
            </form>

            <div className="terminal-bottom-status text-gray font-mono">
              <span className="status-indicator-dot" />
              <span>STATUS: ONLINE • READY FOR TRANSMISSION</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
