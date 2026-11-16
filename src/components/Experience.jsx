import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase } from 'lucide-react';
import { MaskLine } from './Animations';
import './Experience.css';

const items = [
  { icon: Briefcase, kind: 'Internship', title: 'Inmakes Infotech Pvt. Ltd', detail: 'Full-stack development internship', when: '10 Feb 2025 – 10 May 2025', length: '3 months' },
  { icon: GraduationCap, kind: 'Education', title: 'Sree Sabareesa College', detail: 'Murikkumvayal, Kottayam', when: '2021 – 2024', length: '3 years' },
];

const Experience = () => (
  <section className="experience section-padding" id="experience">
    <div className="container">
      <div className="exp-head">
        <h4 className="section-subtitle">My journey</h4>
        <h2 className="section-title"><MaskLine>Experience &amp; <span className="hl">Education</span></MaskLine></h2>
      </div>

      <div className="exp-line">
        {items.map(({ icon: Icon, kind, title, detail, when, length }, i) => (
          <motion.article
            key={title}
            className="exp-item"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="exp-dot"><Icon size={20} strokeWidth={1.8} /></span>
            <div className="exp-card">
              <span className="exp-kind">{kind}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
              <div className="exp-meta"><span>{when}</span><span>{length}</span></div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Experience;
