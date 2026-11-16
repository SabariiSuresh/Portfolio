import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { FaAngular, FaHtml5, FaCss3Alt, FaNodeJs, FaGitAlt } from 'react-icons/fa';
import {
  SiJavascript, SiTypescript, SiExpress, SiMongodb, SiPostgresql, SiMysql, SiPostman, SiJasmine,
} from 'react-icons/si';
import './Skills.css';

const skills = [
  { name: 'Angular', level: 95, icon: FaAngular },
  { name: 'JavaScript', level: 90, icon: SiJavascript },
  { name: 'TypeScript', level: 92, icon: SiTypescript },
  { name: 'HTML5', level: 98, icon: FaHtml5 },
  { name: 'CSS3', level: 98, icon: FaCss3Alt },
  { name: 'Node.js', level: 90, icon: FaNodeJs },
  { name: 'Express.js', level: 88, icon: SiExpress },
  { name: 'MongoDB', level: 92, icon: SiMongodb },
  { name: 'PostgreSQL', level: 85, icon: SiPostgresql },
  { name: 'MySQL', level: 80, icon: SiMysql },
  { name: 'Git / GitHub', level: 95, icon: FaGitAlt },
  { name: 'Postman', level: 80, icon: SiPostman },
  { name: 'Jasmine', level: 75, icon: SiJasmine },
  { name: '& more', level: null, icon: Terminal },
];

const ease = [0.16, 1, 0.3, 1];

/* big headline: each letter rises from a mask, one after another */
const RiseChar = ({ ch, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <span ref={ref} className="rise-mask" aria-hidden="true">
      <motion.span
        className="rise-char"
        initial={{ y: '115%' }}
        animate={{ y: inView ? 0 : '115%' }}
        transition={{ duration: 0.9, delay: index * 0.045, ease }}
      >
        {ch}
      </motion.span>
    </span>
  );
};

const RiseText = ({ text }) => (
  <h2 className="skills-title" aria-label={text}>
    {text.split('').map((ch, i) => (
      <RiseChar key={i} ch={ch} index={i} />
    ))}
  </h2>
);

const Skills = () => (
  <section className="skills section-padding" id="skills">
    <div className="skills-glow glow-a" />
    <div className="skills-glow glow-b" />

    <div className="container skills-inner">
      <motion.p
        className="skills-eyebrow"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        ( Skills &amp; Tools )
      </motion.p>

      <RiseText text="CAPABILITIES" />

      <div className="skills-grid">
        {skills.map((skill, i) => {
          const Icon = skill.icon;
          return (
            <motion.div
              key={skill.name}
              className="skill-tile-wrap"
              initial={{ opacity: 0, y: 60, scale: 0.7, rotate: i % 2 ? 6 : -6 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: 'spring', stiffness: 140, damping: 14, delay: i * 0.06 }}
            >
              <motion.div
                className="skill-tile"
                style={{ '--delay': `${(i % 5) * 0.4}s` }}
                whileHover={{ y: -12, scale: 1.08, rotate: i % 2 ? 2 : -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 16 }}
              >
                <Icon className="skill-tile-icon" />
                <span className="skill-tile-name">{skill.name}</span>
                {skill.level !== null && <span className="skill-tile-level">{skill.level}%</span>}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Skills;
