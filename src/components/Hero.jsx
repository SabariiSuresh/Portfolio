import React, { useRef } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Download } from 'lucide-react';
import { Link } from 'react-scroll';
import { Magnetic } from './Animations';
import { HeroGlobe } from './Lazy';
import heroPhoto from '../assets/me-new.png';
import './Hero.css';

const EASE = [0.16, 1, 0.3, 1];
const RESUME = 'https://drive.google.com/file/d/1FZVECtlgDd7GsdTKtOE5W6oslzuyePnT/view?usp=sharing';
const LEAD = 'MEAN stack developer building scalable, high-performance web apps with clean, tested code.';
const TAGS = [
  { label: 'Angular', className: 'hg-tag-a' },
  { label: 'Node.js', className: 'hg-tag-b' },
  { label: 'MongoDB', className: 'hg-tag-c' },
  { label: 'Express', className: 'hg-tag-d' },
];

/* fixed scatter offsets per letter (no randomness at render time) */
const scatter = (i, seed) => ({
  x: (((i * 53 + seed * 17) % 11) - 5) * 46,
  y: (((i * 37 + seed * 29) % 9) - 4) * 58,
  r: (((i * 29 + seed * 7) % 13) - 6) * 22,
});

/* a letter that flies in from a scattered position and snaps into place */
const Letter = ({ ch, i, seed, delay }) => {
  const s = scatter(i, seed);
  return (
    <motion.span
      className="hg-letter"
      initial={{ x: s.x, y: s.y, rotate: s.r, opacity: 0, scale: 0.4 }}
      animate={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 90, damping: 13, delay: delay + i * 0.06 }}
      whileHover={{ y: -10, scale: 1.1, transition: { type: 'spring', stiffness: 400, damping: 12 } }}
    >
      {ch}
    </motion.span>
  );
};

const Word = ({ text, seed, delay }) => (
  <span className="hg-word" aria-hidden="true">
    {text.split('').map((ch, i) => <Letter key={i} ch={ch} i={i} seed={seed} delay={delay} />)}
  </span>
);

const Hero = () => {
  const ref = useRef(null);
  const mx = useSpring(useMotionValue(0), { stiffness: 80, damping: 16 });
  const my = useSpring(useMotionValue(0), { stiffness: 80, damping: 16 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const copyY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.1]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const photoX = useTransform(mx, (v) => v * -18);
  const photoY = useTransform(my, (v) => v * -12);
  const tagX = useTransform(mx, (v) => v * 22);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <section ref={ref} className="hero hg" id="home" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="container hg-grid">
        {/* ---------- copy ---------- */}
        <motion.div className="hg-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <motion.p className="hg-hello" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <i /> Hi, I&apos;m
          </motion.p>

          <h1 className="hg-name" aria-label="Sabari Suresh">
            <Word text="SABARI" seed={1} delay={0.2} />
            <Word text="SURESH" seed={2} delay={0.6} />
          </h1>

          <motion.p className="hg-role" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.3 }}>
            Full-Stack Developer <span>/</span> MEAN Stack
          </motion.p>

          <motion.p className="hg-lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.4 }}>
            {LEAD}
          </motion.p>

          <motion.div className="hg-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.55 }}>
            <Magnetic strength={0.2}>
              <Link to="projects" smooth="easeInOutQuart" duration={400} offset={-90} className="hg-btn hg-btn-primary">
                View Projects <ArrowUpRight size={19} />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href={RESUME} target="_blank" rel="noreferrer" className="hg-btn hg-btn-outline">
                <Download size={18} /> Resume
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* ---------- 3D globe with the portrait inside ---------- */}
        <motion.div className="hg-orb-wrap" style={{ y: orbY }}>
          <motion.div className="hg-orb" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.3, delay: 0.3, ease: EASE }}>
            <div className="hg-canvas"><HeroGlobe /></div>

            <motion.div className="hg-photo" style={{ x: photoX, y: photoY }} initial={{ clipPath: 'circle(0% at 50% 50%)' }} animate={{ clipPath: 'circle(50% at 50% 50%)' }} transition={{ duration: 1.2, delay: 0.9, ease: EASE }}>
              <img src={heroPhoto} alt="Sabari Suresh" />
            </motion.div>
            <span className="hg-photo-ring" aria-hidden="true" />

            {TAGS.map((t, i) => (
              <motion.span key={t.label} className={`hg-tag ${t.className}`} style={{ x: tagX }} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 1.6 + i * 0.12 }}>
                <span className="hg-tag-in" style={{ animationDelay: `${i * -1.1}s` }}>{t.label}</span>
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="hg-scroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} aria-hidden="true">
        <span className="hg-mouse"><i /></span> Scroll
      </motion.div>
    </section>
  );
};

export default Hero;
