import React from 'react'
import './dev-info.css';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'; // Font Awesome icons
import { SiWhatsapp } from 'react-icons/si';


function DeveloperInfo() {
  return (
    <div className="card">
      <div className="avatar-circle">
        <span className="emoji">👨‍💻</span>
      </div>

      <h2 className="name">Bhabin Dulal</h2>
      <p className="role">Full-Stack Developer & GyanKosh Founder</p>

      <div className="badges">
        <div className="badge">📍 Jhapa, Damak</div>
        <div className="badge">🎓 CS Student</div>
      </div>

      <div className="icons">
        <div className="icon">💼</div>
        <div className="icon">🧠</div>
        <div className="icon">🕺</div>
      </div>

      <div className="socials">
        <a
          href="https://www.linkedin.com/in/bhabindulal/"
          target="_blank"
          rel="noopener noreferrer"
          className="social"
          title="LinkedIn"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://github.com/bhabinexpert"
          target="_blank"
          rel="noopener noreferrer"
          className="social"
          title="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://wa.me/9824009974"
          target="_blank"
          rel="noopener noreferrer"
          className="social"
          title="WhatsApp"
        >
          <SiWhatsapp />
        </a>
        <a
          href="mailto:bhabindulal46@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social"
          title="Gmail"
        >
          <FaEnvelope />
        </a>
      </div>
    </div>
    
  )
}

export default DeveloperInfo
