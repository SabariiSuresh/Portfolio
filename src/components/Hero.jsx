import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Briefcase, Download, Layers, Code2 } from 'lucide-react';
import { FaAngular, FaNodeJs } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiTypescript } from 'react-icons/si';
import { Link } from 'react-scroll';
import { Magnetic, Counter } from './Animations';
import heroPhoto from '../assets/me-new.png';
import './Hero.css';

const EASE = [0.16, 1, 0.3, 1];
const RESUME = 'https://drive.google.com/file/d/1FZVECtlgDd7GsdTKtOE5W6oslzuyePnT/view?usp=sharing';
const WORDS = ['Web Apps', 'REST APIs', 'Dashboards', 'Products'];
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/{}#$%';

/* text that decodes itself: random glyphs settle into the real letters, left to right */
function useScramble(target, { start = true, delay = 0, speed = 38 } = {}) {
  const [out, setOut] = useState(' '.repeat(target.length));
  useEffect(() => {
    if (!start) return undefined;
    let id = 0;
    let step = 0;
    const begin = window.setTimeout(() => {
      id = window.setInterval(() => {
        step += 1;
        const settled = step / 2;
        if (settled >= target.length) { window.clearInterval(id); setOut(target); return; }
        setOut(target.split('').map((ch, i) => (ch === ' ' ? ' ' : i < settled ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(''));
      }, speed);
    }, delay);
    return () => { window.clearTimeout(begin); window.clearInterval(id); };
  }, [target, start, delay, speed]);
  return out;
}

const Decode = ({ text, delay }) => {
  const out = useScramble(text, { delay });
  return <span className="hh-decode" aria-label={text}><span aria-hidden="true">{out}</span></span>;
};

/* the cycling word decodes into the next one */
function CycleWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % WORDS.length), 2800);
    return () => window.clearInterval(id);
  }, []);
  const out = useScramble(WORDS[i], { delay: i === 0 ? 1100 : 0, speed: 32 });
  return <span className="hh-cycle" aria-label={WORDS.join(', ')}><span aria-hidden="true">{out}</span></span>;
}

/* circular text that keeps turning */
const Badge = () => (
  <Link to="projects" smooth="easeInOutQuart" duration={400} offset={-90} className="hh-badge" aria-label="Scroll to projects">
    <svg viewBox="0 0 120 120" className="hh-badge-ring" aria-hidden="true">
      <defs><path id="hh-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
      <text><textPath href="#hh-circle" textLength="283" lengthAdjust="spacing">SABARI SURESH • FULL-STACK DEV • </textPath></text>
    </svg>
    <ArrowDown size={26} className="hh-badge-arrow" />
  </Link>
);

const CARDS = [
  { id: 'num', y: 16.6, x: -56, r: -4, depth: 14 },
  { id: 'work', y: 22.2, x: 10, r: 3, depth: -20 },
  { id: 'stack', y: 30.4, x: -30, r: -2, depth: 26 },
];

const chips = [FaAngular, FaNodeJs, SiMongodb, SiExpress, SiTypescript];

const CardBody = ({ id }) => {
  if (id === 'num') {
    return (
      <>
        <span className="hh-tag"><Layers size={13} /> In numbers</span>
        <p className="hh-row"><span className="hh-big"><Counter value="10+" /></span><span className="hh-sub">projects built</span></p>
      </>
    );
  }
  if (id === 'work') {
    return (
      <>
        <span className="hh-tag"><Briefcase size={13} /> Internship</span>
        <p className="hh-company">Inmakes Infotech Pvt. Ltd</p>
        <p className="hh-sub">10 Feb – 10 May 2025</p>
      </>
    );
  }
  return (
    <>
      <span className="hh-tag"><Code2 size={13} /> Core stack</span>
      <ul className="hh-chips">{chips.map((Icon, i) => <li key={i}><Icon /></li>)}</ul>
    </>
  );
};

/* portrait: reveals upward, keeps morphing its outline, tilts and shifts with the pointer */
function Portrait({ mx, my }) {
  const rx = useTransform(my, (v) => v * -12);
  const ry = useTransform(mx, (v) => v * 14);
  const ix = useTransform(mx, (v) => v * -14);
  const iy = useTransform(my, (v) => v * -8);
  return (
    <motion.div
      className="hh-portrait"
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      initial={{ opacity: 0, scale: 0.7, rotate: -14, y: 60 }}
      animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
    >
      <span className="hh-ring hh-ring-a" aria-hidden="true" />
      <span className="hh-ring hh-ring-b" aria-hidden="true" />
      <div className="hh-blob">
        <motion.img
          src={heroPhoto}
          alt="Sabari Suresh"
          style={{ x: ix, y: iy }}
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 1.3, delay: 0.7, ease: EASE }}
        />
      </div>
      <span className="hh-dot hh-dot-a" aria-hidden="true" />
      <span className="hh-dot hh-dot-b" aria-hidden="true" />
    </motion.div>
  );
}

/* a card that tilts toward the pointer at its own depth, floats, and fans out on hover */
function FloatCard({ card, index, mx, my, spread, entered }) {
  const rx = useTransform(my, (v) => v * -10);
  const ry = useTransform(mx, (v) => v * 12);
  const px = useTransform(mx, (v) => v * card.depth);
  return (
    <motion.div
      className={`hh-card hh-card-${card.id}`}
      style={{ rotateX: rx, rotateY: ry, x: px, transformPerspective: 900, zIndex: index + 1 }}
      initial={{ opacity: 0, x: 140, y: `${card.y + 4}rem`, rotate: 18 }}
      animate={{ opacity: 1, x: card.x * (spread ? 2.4 : 1), y: `${card.y * (spread ? 1.1 : 1)}rem`, rotate: spread ? 0 : card.r }}
      transition={{ type: 'spring', stiffness: 110, damping: 16, delay: entered ? 0 : 0.9 + index * 0.18 }}
    >
      <div className="hh-card-in" style={{ animationDelay: `${index * -1.3}s` }}>
        <CardBody id={card.id} />
      </div>
    </motion.div>
  );
}

const Hero = () => {
  const ref = useRef(null);
  const mx = useSpring(useMotionValue(0), { stiffness: 90, damping: 16 });
  const my = useSpring(useMotionValue(0), { stiffness: 90, damping: 16 });
  const [spread, setSpread] = useState(false);
  const [entered, setEntered] = useState(false);
  useEffect(() => { const t = window.setTimeout(() => setEntered(true), 2600); return () => window.clearTimeout(t); }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const headX = useTransform(scrollYProgress, [0, 1], ['0vw', '-12vw']);
  const headOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const deckY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <section ref={ref} className="hero hh" id="home" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="container hh-grid">
        <div className="hh-left">
          <motion.p className="hh-eyebrow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <span className="hh-index">(01)</span> Sabari Suresh — Full-Stack Developer
          </motion.p>

          <motion.h1 className="hh-title" style={{ x: headX, opacity: headOpacity }}>
            <span className="hh-line"><Decode text="I build" delay={200} /></span>
            <span className="hh-line"><CycleWord /></span>
            <span className="hh-line"><Decode text="that scale." delay={700} /></span>
          </motion.h1>

          <motion.p className="hh-lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.2 }}>
            MEAN stack developer crafting fast, reliable software, from Angular interfaces to Node.js APIs and MongoDB data.
          </motion.p>

          <motion.div className="hh-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.35 }}>
            <Magnetic strength={0.2}>
              <Link to="projects" smooth="easeInOutQuart" duration={400} offset={-90} className="hh-btn hh-btn-primary">
                View Projects <ArrowUpRight size={19} />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href={RESUME} target="_blank" rel="noreferrer" className="hh-btn hh-btn-outline">
                <Download size={18} /> Resume
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div className="hh-right" style={{ y: deckY }}>
          <div className="hh-deck" onMouseEnter={() => setSpread(true)} onMouseLeave={() => setSpread(false)}>
            <Portrait mx={mx} my={my} />
            {CARDS.map((card, i) => (
              <FloatCard key={card.id} card={card} index={i} mx={mx} my={my} spread={spread} entered={entered} />
            ))}
          </div>
          <motion.div className="hh-badge-pos" initial={{ opacity: 0, scale: 0.4, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 1.5, ease: EASE }}>
            <Badge />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
