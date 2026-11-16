import React from 'react';
import { MaskLine, ScrollWords } from './Animations';
import './About.css';

const bio =
  'I am Sabari Suresh, a Full Stack Developer specializing in the MEAN stack, focused on building scalable and high-performance web applications. ' +
  'With a 3-month internship at Inmakes Infotech Pvt. Ltd (10 Feb 2025 – 10 May 2025) and 10+ projects, I have hands-on experience in full-stack development, API design, and responsive UI. ' +
  'Strong in SQL and problem-solving, I write clean, maintainable code following modern best practices.';

const About = () => (
  <section className="about section-padding" id="about">
    <div className="container">
      <div className="about-head">
        <h4 className="section-subtitle">About me</h4>
        <h2 className="section-title"><MaskLine>Full Stack <span className="hl">Developer</span></MaskLine></h2>
      </div>

      <ScrollWords text={bio} className="about-lead" />
    </div>
  </section>
);

export default About;
