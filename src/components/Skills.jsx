import React, { useRef, useSyncExternalStore } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaCss3Alt } from 'react-icons/fa';
import { VscVscode } from 'react-icons/vsc';
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiRedux, SiTailwindcss, SiNodedotjs, SiExpress,
  SiMongodb, SiMysql, SiPostgresql, SiPhp, SiPython, SiFlutter, SiDocker, SiGit, SiGithub, SiVercel,
  SiPostman, SiHtml5, SiBootstrap, SiReactquery,
} from 'react-icons/si';
import './Skills.css';

const TOOLS = [
  { name: 'React', icon: SiReact, color: '#61dafb' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178c6' },
  { name: 'JavaScript', icon: SiJavascript, color: '#f7df1e' },
  { name: 'Redux Toolkit', icon: SiRedux, color: '#764abc' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#38bdf8' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#6cc24a' },
  { name: 'Express.js', icon: SiExpress, color: '#d9d9d9' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47a248' },
  { name: 'MySQL', icon: SiMysql, color: '#00a6d6' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169e1' },
  { name: 'PHP', icon: SiPhp, color: '#777bb4' },
  { name: 'Python', icon: SiPython, color: '#3776ab' },
  { name: 'Flutter', icon: SiFlutter, color: '#54c5f8' },
  { name: 'Docker', icon: SiDocker, color: '#2496ed' },
  { name: 'Git', icon: SiGit, color: '#f05032' },
  { name: 'GitHub', icon: SiGithub, color: '#ffffff' },
  { name: 'Vercel', icon: SiVercel, color: '#ffffff' },
  { name: 'Postman', icon: SiPostman, color: '#ff6c37' },
  { name: 'VS Code', icon: VscVscode, color: '#2f9bff' },
  { name: 'HTML', icon: SiHtml5, color: '#e34f26' },
  { name: 'CSS', icon: FaCss3Alt, color: '#1572b6' },
  { name: 'Bootstrap', icon: SiBootstrap, color: '#7952b3' },
  { name: 'TanStack Query', icon: SiReactquery, color: '#ff4154' },
];

const WORD = 'CAPABILITIES';
const clamp = (v) => Math.min(1, Math.max(0, v));
const ease = [0.16, 1, 0.3, 1];

/* phones, short screens and reduced-motion users get the un-pinned layout */
const QUERIES = ['(max-width: 767px)', '(max-height: 619px)', '(prefers-reduced-motion: reduce)'];
const subscribe = (cb) => {
  const mqs = QUERIES.map((q) => window.matchMedia(q));
  mqs.forEach((m) => m.addEventListener('change', cb));
  return () => mqs.forEach((m) => m.removeEventListener('change', cb));
};
const useSimple = () => useSyncExternalStore(
  subscribe,
  () => QUERIES.some((q) => window.matchMedia(q).matches),
  () => false,
);

const TileFace = ({ tool }) => {
  const Icon = tool.icon;
  return (
    <div className="cap-tile" style={{ '--c': tool.color }}>
      <Icon className="cap-icon" aria-hidden="true" />
      <span className="cap-name">{tool.name}</span>
    </div>
  );
};

/* ---------- pinned, scroll-driven version ---------- */
const Letter = ({ ch, i, progress }) => {
  const start = i * 0.003;
  const t = (p) => clamp((p - start) / 0.035);
  const opacity = useTransform(progress, t);
  const y = useTransform(progress, (p) => `${(1 - t(p)) * 4}vh`);
  const rotateX = useTransform(progress, (p) => (1 - t(p)) * -55);
  return <motion.span className="cap-letter" aria-hidden="true" style={{ opacity, y, rotateX }}>{ch}</motion.span>;
};

const FlyTile = ({ tool, i, progress }) => {
  const side = i % 2 === 0 ? -1 : 1;
  const from = 46 - (i / TOOLS.length) * 22;
  const start = 0.08 + (i / TOOLS.length) * 0.34;
  const t = (p) => clamp((p - start) / 0.3);
  const k = (p) => 1 - (1 - t(p)) ** 3; // ease-out
  const x = useTransform(progress, (p) => `${side * from * (1 - k(p))}vw`);
  const y = useTransform(progress, (p) => `${Math.sin(Math.PI * k(p)) * -9 + (1 - k(p)) * 10}vh`);
  const rotate = useTransform(progress, (p) => side * 22 * (1 - k(p)));
  const scale = useTransform(progress, (p) => 0.7 + 0.3 * k(p));
  const opacity = useTransform(progress, (p) => clamp(t(p) / 0.25));
  return (
    <motion.div className="cap-cell" style={{ x, y, rotate, scale, opacity }}>
      <TileFace tool={tool} />
    </motion.div>
  );
};

const Pinned = () => {
  const track = useRef(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  return (
    <section className="skills" id="skills">
      <div ref={track} className="cap-track">
        <div className="cap-stage">
          <h2 className="cap-title" aria-label={WORD}>
            <span className="sr-only">{WORD}</span>
            {WORD.split('').map((ch, i) => <Letter key={i} ch={ch} i={i} progress={scrollYProgress} />)}
          </h2>
          <div className="cap-grid">
            {TOOLS.map((tool, i) => <FlyTile key={tool.name} tool={tool} i={i} progress={scrollYProgress} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- simple version: replays on every re-entry ---------- */
const letterV = { hidden: { opacity: 0, y: 24, rotateX: -55 }, show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease } } };
const tileV = { hidden: { opacity: 0, y: 40, scale: 0.7 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease } } };

const Simple = () => (
  <section className="skills skills-simple" id="skills">
    <motion.h2
      className="cap-title"
      aria-label={WORD}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.6 }}
      transition={{ staggerChildren: 0.04 }}
    >
      <span className="sr-only">{WORD}</span>
      {WORD.split('').map((ch, i) => <motion.span key={i} className="cap-letter" aria-hidden="true" variants={letterV}>{ch}</motion.span>)}
    </motion.h2>
    <motion.div
      className="cap-grid"
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.15 }}
      transition={{ staggerChildren: 0.04 }}
    >
      {TOOLS.map((tool) => (
        <motion.div key={tool.name} className="cap-cell" variants={tileV}>
          <TileFace tool={tool} />
        </motion.div>
      ))}
    </motion.div>
  </section>
);

const Skills = () => (useSimple() ? <Simple /> : <Pinned />);

export default Skills;
