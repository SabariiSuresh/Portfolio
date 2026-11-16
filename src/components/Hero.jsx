import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Code, Layers, Briefcase, Code2 } from 'lucide-react';
import { FaAngular, FaNodeJs } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiTypescript } from 'react-icons/si';
import { Link } from 'react-scroll';
import { Magnetic, Counter } from './Animations';
import meImage from '../assets/meee.png';
import './Hero.css';

const ease = [0.16, 1, 0.3, 1];

const chips = [
  { name: 'Angular', icon: FaAngular },
  { name: 'Node.js', icon: FaNodeJs },
  { name: 'MongoDB', icon: SiMongodb },
  { name: 'Express', icon: SiExpress },
  { name: 'TypeScript', icon: SiTypescript },
];

const stats = [
  { icon: Layers, value: '10+', label: 'Projects Completed' },
  { icon: Briefcase, value: '3 Months', label: 'Internship Experience' },
  { icon: Code2, value: 'MEAN Stack', label: 'Full-Stack Development', plain: true },
];

const Line = ({ children, delay = 0 }) => (
  <span className="h-line">
    <motion.span
      className="h-line-inner"
      initial={{ y: '115%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.span>
  </span>
);

const Hero = () => (
  <section className="hero" id="home">
    <div className="container hero-grid">
      <div className="hero-left">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Code size={20} /> Full-Stack Developer
        </motion.div>

        <h1 className="hero-title">
          <Line delay={0.1}>Building</Line>
          <Line delay={0.22}>Real-World Solutions</Line>
          <Line delay={0.34}>
            with{' '}
            <span className="hero-accent">
              MEAN Stack
              <svg className="hero-underline" viewBox="0 0 400 14" preserveAspectRatio="none" aria-hidden="true">
                <motion.path
                  d="M3 9 C 70 3, 150 12, 230 6 S 350 9, 397 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
                />
              </svg>
            </span>
          </Line>
        </h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          I'm Sabari Suresh. I build scalable, high-performance web applications with modern technologies and clean code.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
        >
          <Magnetic strength={0.2}>
            <Link to="projects" smooth="easeInOutQuart" duration={400} offset={-90} className="hero-btn hero-btn-primary">
              View Projects <ArrowRight size={20} />
            </Link>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a
              href="https://drive.google.com/file/d/1FZVECtlgDd7GsdTKtOE5W6oslzuyePnT/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="hero-btn hero-btn-outline"
            >
              <Download size={20} /> Download Resume
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <div className="hero-right">
        <motion.div
          className="hero-slab"
          initial={{ opacity: 0, rotate: -14, scale: 0.8 }}
          animate={{ opacity: 1, rotate: -6, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease }}
        />

        <motion.div
          className="hero-photo"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
        >
          <img src={meImage} alt="Sabari Suresh" />
        </motion.div>

        <motion.div
          className="hero-code"
          initial={{ opacity: 0, x: -40, rotate: -14 }}
          animate={{ opacity: 1, x: 0, rotate: -8 }}
          transition={{ duration: 0.9, delay: 0.6, ease }}
        >
          <div className="code-dots"><i /><i /><i /></div>
          <pre>
            <span className="ln">1</span> <span className="kw">const</span> me = {'{'}{'\n'}
            <span className="ln">2</span>   name: <span className="str">"Sabari Suresh"</span>,{'\n'}
            <span className="ln">3</span>   role: <span className="str">"Full-Stack Developer"</span>,{'\n'}
            <span className="ln">4</span>   stack: [<span className="str">"MEAN"</span>, <span className="str">"SQL"</span>, <span className="str">"REST"</span>]{'\n'}
            <span className="ln">5</span> {'};'}
          </pre>
        </motion.div>

        <div className="hero-chips">
          {chips.map((chip, i) => {
            const Icon = chip.icon;
            return (
              <motion.div
                key={chip.name}
                className="hero-chip"
                style={{ '--shift': `${[0, -22, -8, -30, -14][i]}px` }}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.8 + i * 0.1, ease }}
              >
                <span className="hero-chip-float" style={{ animationDelay: `${i * 0.5}s` }}>
                  <Icon className="chip-icon" /> {chip.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>

    <motion.div
      className="container hero-stats"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.7 }}
    >
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="hero-stat">
            <Icon size={34} className="hero-stat-icon" strokeWidth={1.6} />
            <div>
              <strong>{s.plain ? s.value : <Counter value={s.value} />}</strong>
              <span>{s.label}</span>
            </div>
          </div>
        );
      })}
    </motion.div>
  </section>
);

export default Hero;
