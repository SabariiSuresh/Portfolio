import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from './ScrollLink';
import heroPhoto from '../assets/me-hero.webp';
import './Hero.css';

const EASE = [0.22, 1, 0.36, 1];
const HEADLINE = ['MEAN STACK', 'BUILT TO SCALE.'];
const CHIPS = [
  { label: 'MEAN STACK', to: 'about' },
  { label: 'ANGULAR / NODE', to: 'skills' },
  { label: 'MONGODB / SQL', to: 'projects' },
];

/* a block that drifts in from the side while fading up */
const Reveal = ({ children, delay = 0, drift = 'left', className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, x: drift === 'left' ? -46 : 46, y: 14 }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    transition={{ duration: 0.95, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const headX = useTransform(scrollYProgress, [0, 1], ['0vw', '-10vw']);
  const nameX = useTransform(scrollYProgress, [0, 1], ['0vw', '10vw']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="hz" id="home">
      {/* top left: glowing headline + chips */}
      <motion.div className="hz-top" style={{ x: headX, opacity: fade }}>
        <h1 className="hz-headline" aria-label="MEAN stack built to scale.">
          {HEADLINE.map((line, i) => (
            <Reveal key={line} drift="left" delay={0.2 + i * 0.14} className="hz-line">
              <span aria-hidden="true">{line}</span>
            </Reveal>
          ))}
        </h1>
        <Reveal drift="left" delay={0.5}>
          <div className="hz-chips">
            {CHIPS.map((c, i) => (
              <motion.span key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 + i * 0.1, ease: EASE }}>
                <Link to={c.to} offset={-90} className="hz-chip">{c.label}</Link>
              </motion.span>
            ))}
          </div>
        </Reveal>
      </motion.div>

      {/* small portrait with a scanning line */}
      <motion.div className="hz-portrait" style={{ opacity: fade }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.7, ease: EASE }}>
        <i className="hz-tick hz-t1" /><i className="hz-tick hz-t2" /><i className="hz-tick hz-t3" /><i className="hz-tick hz-t4" />
        <div className="hz-photo">
          <motion.img src={heroPhoto} alt="Sabari Suresh" initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} transition={{ duration: 1.2, delay: 1, ease: EASE }} />
          <span className="hz-scan" />
        </div>
      </motion.div>

      {/* bottom right: role + the big name */}
      <motion.div className="hz-bottom" style={{ x: nameX, opacity: fade }}>
        <Reveal drift="right" delay={0.85}>
          <p className="hz-role">MEAN STACK DEVELOPER · OPEN TO WORK</p>
        </Reveal>
        <motion.div className="hz-name" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.9, ease: EASE }}>
          SABARI
        </motion.div>
        <Reveal drift="right" delay={1.1}>
          <p className="hz-sub">SURESH · FULL-STACK DEVELOPER</p>
        </Reveal>
      </motion.div>

      <div className="hz-cue" aria-hidden="true"><span><i /></span> SCROLL</div>
    </section>
  );
};

export default Hero;
