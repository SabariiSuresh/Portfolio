import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Download, Layers, Briefcase, Code2 } from 'lucide-react';
import { Link } from 'react-scroll';
import { Magnetic, Counter } from './Animations';
import heroPhoto from '../assets/me-new.png';
import './Hero.css';

const EASE = [0.16, 1, 0.3, 1];
const RESUME = 'https://drive.google.com/file/d/1FZVECtlgDd7GsdTKtOE5W6oslzuyePnT/view?usp=sharing';
const ROLES = ['Full-Stack Developer', 'MEAN Stack Engineer', 'API Designer', 'Problem Solver'];
const LEAD = 'I build scalable, high-performance web apps with the MEAN stack and clean, tested code.';

const STATS = [
  { icon: Layers, label: 'Projects', value: '10+', fill: 0.85 },
  { icon: Briefcase, label: 'Internship', value: '3 Months', fill: 0.6 },
  { icon: Code2, label: 'Stack', value: 'MEAN', fill: 1, plain: true },
];

/* a word whose letters rise in one by one, then glitches now and then */
function GlitchWord({ text, delay, outline }) {
  return (
    <span className={`hd-word ${outline ? 'hd-word-outline' : ''}`} data-text={text} aria-hidden="true">
      {text.split('').map((ch, i) => (
        <span key={i} className="hd-mask">
          <motion.span
            className="hd-char"
            initial={{ y: '115%', rotate: 10 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease: EASE }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* "> role" typed, deleted, typed again */
function Typed() {
  const [text, setText] = useState('');
  useEffect(() => {
    let role = 0;
    let n = 0;
    let deleting = false;
    let timer = 0;
    const tick = () => {
      const word = ROLES[role];
      n += deleting ? -1 : 1;
      setText(word.slice(0, n));
      let wait = deleting ? 36 : 70;
      if (!deleting && n === word.length) { deleting = true; wait = 1500; }
      else if (deleting && n === 0) { deleting = false; role = (role + 1) % ROLES.length; wait = 350; }
      timer = window.setTimeout(tick, wait);
    };
    timer = window.setTimeout(tick, 1300);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <p className="hd-typed" aria-label={ROLES.join(', ')}>
      <span className="hd-prompt">&gt;</span>
      <span aria-hidden="true">{text}</span><i className="hd-caret" />
    </p>
  );
}

/* drifting specks of light in the background */
/* positions are generated once, when the module loads */
const SPECKS = Array.from({ length: 26 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 78,
  size: 1 + Math.random() * 2.6,
  dur: 5 + Math.random() * 8,
  delay: -Math.random() * 10,
}));

function Specks() {
  return (
    <div className="hd-specks" aria-hidden="true">
      {SPECKS.map((s, i) => (
        <span key={i} style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }} />
      ))}
    </div>
  );
}

/* tick-marked radar ring that keeps turning */
const Radar = () => (
  <svg viewBox="0 0 200 200" className="hd-radar" aria-hidden="true">
    <circle cx="100" cy="100" r="96" className="hd-radar-line" />
    <circle cx="100" cy="100" r="78" className="hd-radar-line hd-radar-dash" />
    {Array.from({ length: 48 }, (_, i) => {
      const a = (i / 48) * Math.PI * 2;
      const long = i % 4 === 0;
      const r1 = 96;
      const r2 = long ? 88 : 92;
      return <line key={i} x1={100 + Math.cos(a) * r1} y1={100 + Math.sin(a) * r1} x2={100 + Math.cos(a) * r2} y2={100 + Math.sin(a) * r2} className="hd-tick" />;
    })}
  </svg>
);

const Hero = () => {
  const ref = useRef(null);
  const mx = useSpring(useMotionValue(0), { stiffness: 90, damping: 16 });
  const my = useSpring(useMotionValue(0), { stiffness: 90, damping: 16 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const rx = useTransform(my, (v) => v * -10);
  const ry = useTransform(mx, (v) => v * 14);
  const innerX = useTransform(mx, (v) => v * -12);
  const bgX = useTransform(mx, (v) => v * -26);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.1]);
  const hudY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const floorY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <section ref={ref} className="hero hd" id="home" onMouseMove={onMove} onMouseLeave={onLeave}>
      {/* ---------- animated background ---------- */}
      <motion.div className="hd-bg" style={{ x: bgX }} aria-hidden="true">
        <span className="hd-aurora hd-aurora-a" />
        <span className="hd-aurora hd-aurora-b" />
        <motion.div className="hd-floor-wrap" style={{ y: floorY }}>
          <div className="hd-floor" />
        </motion.div>
        <span className="hd-horizon" />
      </motion.div>
      <Specks />

      <div className="container hd-grid">
        {/* ---------- copy ---------- */}
        <motion.div className="hd-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <motion.p className="hd-status" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <i /> System online · Available for work
          </motion.p>

          <h1 className="hd-name" aria-label="Sabari Suresh">
            <GlitchWord text="SABARI" delay={0.2} />
            <GlitchWord text="SURESH" delay={0.5} outline />
          </h1>

          <Typed />

          <motion.p className="hd-lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.1 }}>
            {LEAD}
          </motion.p>

          <motion.div className="hd-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.25 }}>
            <Magnetic strength={0.2}>
              <Link to="projects" smooth="easeInOutQuart" duration={400} offset={-90} className="hd-btn hd-btn-primary">
                View Projects <ArrowUpRight size={19} />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href={RESUME} target="_blank" rel="noreferrer" className="hd-btn hd-btn-outline">
                <Download size={18} /> Resume
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* ---------- HUD portrait ---------- */}
        <motion.div className="hd-hud" style={{ y: hudY }}>
          <Radar />
          <motion.div
            className="hd-frame-wrap"
            style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
          >
            <i className="hd-corner hd-c1" /><i className="hd-corner hd-c2" /><i className="hd-corner hd-c3" /><i className="hd-corner hd-c4" />
            <div className="hd-frame">
              <motion.img
                src={heroPhoto}
                alt="Sabari Suresh"
                style={{ x: innerX }}
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                animate={{ clipPath: 'inset(0% 0 0 0)' }}
                transition={{ duration: 1.3, delay: 0.9, ease: EASE }}
              />
              <span className="hd-scan" />
            </div>
            <motion.span className="hd-tag hd-tag-a" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6, duration: 0.6 }}>ID · SS-2025</motion.span>
            <motion.span className="hd-tag hd-tag-b" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8, duration: 0.6 }}><i /> ONLINE</motion.span>
            <motion.span className="hd-tag hd-tag-c" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 0.6 }}>KERALA · IN</motion.span>
          </motion.div>
        </motion.div>
      </div>

      {/* ---------- HUD stats ---------- */}
      <motion.div className="container hd-stats" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.5 }}>
        {STATS.map(({ icon: Icon, label, value, fill, plain }, i) => (
          <div key={label} className="hd-stat">
            <div className="hd-stat-top">
              <Icon size={18} strokeWidth={1.7} /> <span>{label}</span>
            </div>
            <strong>{plain ? value : <Counter value={value} />}</strong>
            <span className="hd-bar"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: fill }} transition={{ duration: 1.4, delay: 1.8 + i * 0.15, ease: EASE }} /></span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Hero;
