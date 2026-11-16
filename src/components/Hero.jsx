import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Download, Hand } from 'lucide-react';
import { FaAngular, FaNodeJs } from 'react-icons/fa';
import { SiMongodb, SiExpress } from 'react-icons/si';
import { Link } from 'react-scroll';
import { Magnetic } from './Animations';
import heroPhoto from '../assets/me-new.png';
import './Hero.css';

const RESUME = 'https://drive.google.com/file/d/1FZVECtlgDd7GsdTKtOE5W6oslzuyePnT/view?usp=sharing';
const LEAD = 'MEAN stack developer building scalable, high-performance web apps with clean, tested code.';
const BAND = 'FULL-STACK ✦ MEAN STACK ✦ DEVELOPER ✦ ANGULAR ✦ NODE.JS ✦ MONGODB ✦ ';

const stickers = [
  { icon: FaAngular, className: 'hm-st-a', rotate: -12 },
  { icon: FaNodeJs, className: 'hm-st-b', rotate: 10 },
  { icon: SiMongodb, className: 'hm-st-c', rotate: -6 },
  { icon: SiExpress, className: 'hm-st-d', rotate: 14 },
];

/* a letter that drops in with a bounce and squashes like jelly when hovered */
const Jelly = ({ ch, i, delay }) => (
  <motion.span
    className="hm-letter"
    initial={{ y: -220, opacity: 0, rotate: -18 }}
    animate={{ y: 0, opacity: 1, rotate: 0 }}
    transition={{ type: 'spring', stiffness: 130, damping: 11, delay: delay + i * 0.07 }}
    whileHover={{ scaleY: 1.18, scaleX: 0.9, y: -6, transition: { type: 'spring', stiffness: 500, damping: 8 } }}
  >
    {ch}
  </motion.span>
);

const Word = ({ text, delay }) => (
  <span className="hm-word" aria-hidden="true">
    {text.split('').map((ch, i) => <Jelly key={i} ch={ch} i={i} delay={delay} />)}
  </span>
);

/* a draggable sticker that tilts as you pull it */
function Sticker({ icon: Icon, className, rotate, area, delay }) {
  const x = useMotionValue(0);
  const tilt = useTransform(x, [-120, 120], [rotate - 18, rotate + 18]);
  return (
    <motion.span
      className={`hm-sticker ${className}`}
      drag
      dragConstraints={area}
      dragElastic={0.25}
      style={{ x, rotate: tilt }}
      initial={{ opacity: 0, scale: 0, rotate }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ type: 'spring', stiffness: 200, damping: 12, delay }}
      whileHover={{ scale: 1.15 }}
      whileDrag={{ scale: 1.25, cursor: 'grabbing' }}
    >
      <Icon />
    </motion.span>
  );
}

const Hero = () => {
  const ref = useRef(null);
  const area = useRef(null);
  const [dragged, setDragged] = useState(false);

  /* the background bands lean with how fast you scroll */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const { scrollY: pageY } = useScroll();
  const velocity = useSpring(useVelocity(pageY), { damping: 50, stiffness: 400 });
  const skew = useTransform(velocity, [-2000, 2000], [-14, 14]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const rightY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  const px = useMotionValue(0);
  const polaroidTilt = useTransform(px, [-160, 160], [-10, 14]);

  return (
    <section ref={ref} className="hero hm" id="home">
      {/* ---------- scrolling type bands ---------- */}
      <motion.div className="hm-bands" style={{ skewX: skew }} aria-hidden="true">
        {[0, 1, 2].map((row) => (
          <div key={row} className={`hm-row hm-row-${row}`}>
            {[0, 1].map((k) => <span key={k} className="hm-band">{BAND.repeat(3)}</span>)}
          </div>
        ))}
      </motion.div>

      <div className="container hm-grid">
        {/* ---------- copy ---------- */}
        <motion.div className="hm-copy" style={{ y: copyY }}>
          <motion.p className="hm-hello" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <span className="hm-wave"><Hand size={22} /></span> Hello, I&apos;m
          </motion.p>

          <h1 className="hm-name" aria-label="Sabari Suresh">
            <Word text="SABARI" delay={0.2} />
            <Word text="SURESH" delay={0.55} />
          </h1>

          <motion.p className="hm-role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <span>Full-Stack Developer</span>
            <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 1.5 }} />
          </motion.p>

          <motion.p className="hm-lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.3 }}>
            {LEAD}
          </motion.p>

          <motion.div className="hm-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.45 }}>
            <Magnetic strength={0.2}>
              <Link to="projects" smooth="easeInOutQuart" duration={400} offset={-90} className="hm-btn hm-btn-primary">
                View Projects <ArrowUpRight size={19} />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href={RESUME} target="_blank" rel="noreferrer" className="hm-btn hm-btn-outline">
                <Download size={18} /> Resume
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* ---------- draggable polaroid + stickers ---------- */}
        <motion.div className="hm-right" style={{ y: rightY }}>
          <div ref={area} className="hm-area">
            <motion.figure
              className="hm-polaroid"
              drag
              dragConstraints={area}
              dragElastic={0.2}
              onDragStart={() => setDragged(true)}
              style={{ x: px, rotate: polaroidTilt }}
              initial={{ y: -520, rotate: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 70, damping: 11, delay: 0.5 }}
              whileHover={{ scale: 1.04 }}
              whileDrag={{ scale: 1.08, cursor: 'grabbing' }}
            >
              <span className="hm-tape" />
              <div className="hm-photo">
                <img src={heroPhoto} alt="Sabari Suresh" draggable={false} />
              </div>
              <figcaption>it&apos;s me, Sabari ✌</figcaption>
            </motion.figure>

            {stickers.map((s, i) => <Sticker key={s.className} {...s} area={area} delay={1.4 + i * 0.15} />)}

            <motion.p className="hm-hint" initial={{ opacity: 0 }} animate={{ opacity: dragged ? 0 : 1 }} transition={{ delay: dragged ? 0 : 2.2 }}>
              drag me around ↗
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
