import React, { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { FaAngular, FaHtml5, FaCss3Alt, FaNodeJs, FaGitAlt } from 'react-icons/fa';
import {
  SiJavascript, SiTypescript, SiExpress, SiMongodb, SiPostgresql, SiMysql, SiPostman, SiJasmine,
} from 'react-icons/si';
import './Skills.css';

/* each tile uses its technology's brand colour */
const skills = [
  { name: 'Angular', level: 95, icon: FaAngular, color: '#e23237' },
  { name: 'JavaScript', level: 90, icon: SiJavascript, color: '#f7df1e' },
  { name: 'TypeScript', level: 92, icon: SiTypescript, color: '#3a8bd6' },
  { name: 'HTML5', level: 98, icon: FaHtml5, color: '#ff5a2c' },
  { name: 'CSS3', level: 98, icon: FaCss3Alt, color: '#2d8ae6' },
  { name: 'Node.js', level: 90, icon: FaNodeJs, color: '#6cc24a' },
  { name: 'Express.js', level: 88, icon: SiExpress, color: '#d9d9d9' },
  { name: 'MongoDB', level: 92, icon: SiMongodb, color: '#47a248' },
  { name: 'PostgreSQL', level: 85, icon: SiPostgresql, color: '#5b8def' },
  { name: 'MySQL', level: 80, icon: SiMysql, color: '#00a6d6' },
  { name: 'Git / GitHub', level: 95, icon: FaGitAlt, color: '#ff6a45' },
  { name: 'Postman', level: 80, icon: SiPostman, color: '#ff7a3c' },
  { name: 'Jasmine', level: 75, icon: SiJasmine, color: '#b45ad0' },
  { name: '& more', level: null, icon: Terminal, color: '#ffc72c' },
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

/* One tile: flips in from the centre outward, then tilts toward the mouse with a moving glare */
const Tile = ({ skill, index, total }) => {
  const wrapRef = useRef(null);
  const tileRef = useRef(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.3 });
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 18 });
  const sry = useSpring(ry, { stiffness: 220, damping: 18 });
  const Icon = skill.icon;
  const delay = Math.abs(index - (total - 1) / 2) * 0.07;

  const onMove = (e) => {
    const r = tileRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 30);
    rx.set(-(py - 0.5) * 30);
    tileRef.current.style.setProperty('--mx', `${px * 100}%`);
    tileRef.current.style.setProperty('--my', `${py * 100}%`);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <div ref={wrapRef} className="skill-tile-wrap">
      <motion.div
        initial={{ opacity: 0, rotateY: 90, scale: 0.6 }}
        animate={inView ? { opacity: 1, rotateY: 0, scale: 1 } : { opacity: 0, rotateY: 90, scale: 0.6 }}
        transition={{ type: 'spring', stiffness: 110, damping: 14, delay }}
        style={{ perspective: 800 }}
      >
        <motion.div
          ref={tileRef}
          className="skill-tile"
          style={{ '--c': skill.color, rotateX: srx, rotateY: sry }}
          whileHover={{ scale: 1.1 }}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <span className="skill-glare" />
          <Icon className="skill-tile-icon" />
          <span className="skill-tile-name">{skill.name}</span>
          {skill.level !== null && <span className="skill-tile-level">{skill.level}%</span>}
        </motion.div>
      </motion.div>
    </div>
  );
};

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
        {skills.map((skill, i) => (
          <Tile key={skill.name} skill={skill} index={i} total={skills.length} />
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
