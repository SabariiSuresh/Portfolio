import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Briefcase, Download, Layers } from 'lucide-react';
import { Link } from 'react-scroll';
import { Magnetic, Counter } from './Animations';
import heroPhoto from '../assets/me-new.png';
import './Hero.css';

const EASE = [0.16, 1, 0.3, 1];
const RESUME = 'https://drive.google.com/file/d/1FZVECtlgDd7GsdTKtOE5W6oslzuyePnT/view?usp=sharing';
const WORDS = ['Web Apps', 'REST APIs', 'Dashboards', 'Products'];

/* one headline line slides up out of a mask */
const MaskLine = ({ children, delay = 0 }) => (
  <span className="hv-mask">
    <motion.span
      className="hv-mask-in"
      initial={{ y: '110%', rotate: 4 }}
      animate={{ y: 0, rotate: 0 }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);

/* slot-machine word: the old word rolls up, the next one rolls in */
function Slot() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % WORDS.length), 2300);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="hv-slot" aria-label={WORDS.join(', ')}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={WORDS[i]}
          className="hv-slot-word"
          initial={{ y: '105%', rotateX: -60, opacity: 0 }}
          animate={{ y: '0%', rotateX: 0, opacity: 1 }}
          exit={{ y: '-105%', rotateX: 60, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* circular text that keeps turning */
const Badge = () => (
  <Link to="projects" smooth="easeInOutQuart" duration={400} offset={-90} className="hv-badge" aria-label="Scroll to projects">
    <svg viewBox="0 0 120 120" className="hv-badge-ring" aria-hidden="true">
      <defs><path id="hv-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
      <text><textPath href="#hv-circle" textLength="283" lengthAdjust="spacing">SABARI SURESH • FULL-STACK DEV • </textPath></text>
    </svg>
    <ArrowDown size={26} className="hv-badge-arrow" />
  </Link>
);

/* the three cards of the deck */
const CARDS = [
  {
    id: 'photo',
    body: (
      <>
        <span className="hv-tag">Hello</span>
        <img src={heroPhoto} alt="Sabari Suresh" className="hv-photo" />
        <strong className="hv-cap">Sabari Suresh</strong>
      </>
    ),
  },
  {
    id: 'stats',
    body: (
      <>
        <span className="hv-tag"><Layers size={14} /> In numbers</span>
        <p className="hv-big"><Counter value="10+" /></p>
        <p className="hv-sub">projects built with Angular, Node.js &amp; MongoDB</p>
        <p className="hv-small">MEAN stack · SQL · REST</p>
      </>
    ),
  },
  {
    id: 'work',
    body: (
      <>
        <span className="hv-tag"><Briefcase size={14} /> Internship</span>
        <p className="hv-company">Inmakes Infotech Pvt. Ltd</p>
        <p className="hv-sub">10 Feb 2025 – 10 May 2025</p>
        <p className="hv-small">3 months · full-stack development</p>
      </>
    ),
  },
];

/* positions in the deck: 0 = front */
const POSE = [
  { x: 0, y: 0, rotate: -3, scale: 1 },
  { x: 26, y: -16, rotate: 6, scale: 0.95 },
  { x: -22, y: -30, rotate: -9, scale: 0.9 },
];

function Deck() {
  const [order, setOrder] = useState([0, 1, 2]);
  const [paused, setPaused] = useState(false);
  const next = () => setOrder((o) => [...o.slice(1), o[0]]);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = window.setInterval(next, 4200);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div className="hv-deck" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {CARDS.map((card, id) => {
        const pos = order.indexOf(id);
        return (
          <motion.button
            key={card.id}
            type="button"
            className={`hv-card hv-card-${card.id}`}
            style={{ zIndex: 10 - pos }}
            initial={{ opacity: 0, y: 120, rotate: 12 }}
            animate={{ ...POSE[pos], opacity: 1 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18, delay: pos === 0 && order[0] === 0 ? 0 : 0 }}
            whileHover={pos === 0 ? { y: -8, rotate: -1 } : undefined}
            onClick={next}
            aria-label={pos === 0 ? 'Show next card' : undefined}
            tabIndex={pos === 0 ? 0 : -1}
          >
            {card.body}
          </motion.button>
        );
      })}
      <p className="hv-hint">Click the card to shuffle</p>
    </div>
  );
}

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const headX = useTransform(scrollYProgress, [0, 1], ['0vw', '-12vw']);
  const headOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const deckY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <section ref={ref} className="hero hv" id="home">
      <div className="container hv-grid">
        <div className="hv-left">
          <motion.p className="hv-eyebrow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <span className="hv-index">(01)</span> Sabari Suresh — Full-Stack Developer
          </motion.p>

          <motion.h1 className="hv-title" style={{ x: headX, opacity: headOpacity }}>
            <MaskLine delay={0.2}>I build</MaskLine>
            <MaskLine delay={0.35}><Slot /></MaskLine>
            <MaskLine delay={0.5}>that scale.</MaskLine>
          </motion.h1>

          <motion.p className="hv-lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1 }}>
            MEAN stack developer crafting fast, reliable software, from Angular interfaces to Node.js APIs and MongoDB data.
          </motion.p>

          <motion.div className="hv-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.15 }}>
            <Magnetic strength={0.2}>
              <Link to="projects" smooth="easeInOutQuart" duration={400} offset={-90} className="hv-btn hv-btn-primary">
                View Projects <ArrowUpRight size={19} />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href={RESUME} target="_blank" rel="noreferrer" className="hv-btn hv-btn-outline">
                <Download size={18} /> Resume
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div className="hv-right" style={{ y: deckY }}>
          <Deck />
          <motion.div className="hv-badge-pos" initial={{ opacity: 0, scale: 0.4, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 1.2, ease: EASE }}>
            <Badge />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
