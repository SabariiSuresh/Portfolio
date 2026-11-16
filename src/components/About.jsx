import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Calendar } from 'lucide-react';
import meImage from '../assets/meee.png';
import { MaskLine, Counter, ScrollWords, WipeIn } from './Animations';
import { KnotScene } from './Lazy';
import './About.css';

const bio =
  'I am Sabari Suresh, a Full Stack Developer specializing in the MEAN stack, focused on building scalable and high-performance web applications. ' +
  'With a 3-Month internship and 10+ projects, I have hands-on experience in full-stack development, API design, and responsive UI. ' +
  'Strong in SQL and problem-solving, I write clean, maintainable code following modern best practices.';

const bullets = [
  'Full-Stack Application Development',
  'Modern Frontend Development (Angular)',
  'Scalable Backend Architecture (Node.js)',
];

const stats = [
  { label: 'Projects Completed', value: '10+' },
  { label: 'Commitment & Consistency', value: '100%' },
  { label: 'Internship Experience', value: '3 Months' },
  { label: 'Modern Tech Stack', value: '8+' },
];

const About = () => (
  <section className="about section-padding" id="about">
    <div className="scene-knot"><KnotScene /></div>

    <div className="container">
      <div className="about-head">
        <h4 className="section-subtitle">About me</h4>
        <h2 className="section-title"><MaskLine>Full Stack <span className="hl">Developer</span></MaskLine></h2>
      </div>

      <div className="about-grid">
        <aside className="about-side">
          <WipeIn className="about-photo">
            <img src={meImage} alt="Sabari Suresh" />
            <span className="photo-tag">Sabari Suresh</span>
          </WipeIn>

          <ul className="about-info">
            <li><Mail size={18} /><a href="mailto:sabarisuresh65@gmail.com">sabarisuresh65@gmail.com</a></li>
            <li><MapPin size={18} /><span>India</span></li>
            <li><Calendar size={18} /><span>Available for Hire</span></li>
          </ul>
        </aside>

        <div className="about-main">
          <ScrollWords text={bio} className="about-lead" />

          <ul className="about-bullets">
            {bullets.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <span>0{i + 1}</span>
                {b}
              </motion.li>
            ))}
          </ul>

          <div className="about-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="about-stat">
                <h3><Counter value={stat.value} /></h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
