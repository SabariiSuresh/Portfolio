import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform,
} from 'framer-motion';
import { ArrowRight, Download, MapPin } from 'lucide-react';
import { Link } from 'react-scroll';
import { Magnetic, Counter } from './Animations';
import heroPhoto from '../assets/me-new.png';
import './Hero.css';

const EASE = [0.16, 1, 0.3, 1];

const STATS = [
  { value: '10+', label: 'Projects built' },
  { value: '3 Months', label: 'Internship' },
  { value: 'MEAN Stack', label: 'Specialization' },
];
const STATUS_LINES = ['Open to new opportunities', 'Building MEAN stack apps', 'Shipping clean, tested code'];
const ROLES = ['Full-Stack Developer', 'MEAN Stack Engineer', 'API Designer', 'Problem Solver'];
const INTRO_TEXT =
  'I design and build scalable, high-performance web applications with the MEAN stack: Angular, Node.js, MongoDB and Express, with clean, tested code.';
const KEYWORDS = ['scalable', 'high-performance', 'MEAN', 'Angular', 'MongoDB'];
const RESUME = 'https://drive.google.com/file/d/1FZVECtlgDd7GsdTKtOE5W6oslzuyePnT/view?usp=sharing';

/* wide + tall + motion allowed => pinned scene; otherwise a plain stacked hero */
const QUERIES = ['(max-width: 1023px)', '(max-height: 619px)', '(prefers-reduced-motion: reduce)'];
const subscribe = (cb) => {
  const mqs = QUERIES.map((q) => window.matchMedia(q));
  mqs.forEach((m) => m.addEventListener('change', cb));
  return () => mqs.forEach((m) => m.removeEventListener('change', cb));
};
const usePlain = () => useSyncExternalStore(subscribe, () => QUERIES.some((q) => window.matchMedia(q).matches), () => false);

/* local time in Kerala, ticking every second */
function useKeralaTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(now);
}

/* short lines that slide up one after another */
function RotatingStatus() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % STATUS_LINES.length), 3200);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="hr-status-text">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {STATUS_LINES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* "I'm a ..." typed, deleted, typed again */
function TypedRole() {
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
      let wait = deleting ? 38 : 75;
      if (!deleting && n === word.length) { deleting = true; wait = 1500; }
      else if (deleting && n === 0) { deleting = false; role = (role + 1) % ROLES.length; wait = 350; }
      timer = window.setTimeout(tick, wait);
    };
    timer = window.setTimeout(tick, 1400);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <p className="hr-typed" aria-label={`I am a ${ROLES.join(', ')}`}>
      <span className="hr-typed-dim">I&apos;m a</span>
      <span className="hr-typed-word" aria-hidden="true">{text}<i className="hr-caret" /></span>
    </p>
  );
}

/* words fade up one by one */
function WordsFade({ text, delay = 0, className = '' }) {
  return (
    <p className={className}>
      {text.split(' ').map((w, i) => (
        <motion.span
          key={i}
          className="hr-word"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: delay + i * 0.035, ease: EASE }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </p>
  );
}

const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}#';
/* a label that decodes itself, left to right */
function Scramble({ text, run }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!run) return undefined;
    let step = 0;
    const id = window.setInterval(() => {
      step += 1;
      const settled = step / 2;
      if (settled >= text.length) { window.clearInterval(id); setOut(text); return; }
      setOut(text.split('').map((ch, i) => (ch === ' ' || i < settled ? ch : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)])).join(''));
    }, 45);
    return () => window.clearInterval(id);
  }, [run, text]);
  return <span aria-label={text}><span aria-hidden="true">{out}</span></span>;
}

/* intro sentence: words fade in, key terms get an amber line drawn under them */
function Highlighted({ text, run, className = '' }) {
  return (
    <p className={className}>
      {text.split(' ').map((w, i) => {
        const key = KEYWORDS.some((k) => w.replace(/[,.:]$/, '') === k);
        return (
          <motion.span
            key={i}
            className="hr-word"
            initial={{ opacity: 0, y: 10 }}
            animate={run ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.03, ease: EASE }}
          >
            <span
              className={key ? 'hr-key' : ''}
              style={key ? { backgroundSize: run ? '100% 2px' : '0% 2px', transitionDelay: `${0.6 + i * 0.03}s` } : undefined}
            >
              {w}
            </span>
            &nbsp;
          </motion.span>
        );
      })}
    </p>
  );
}

function Buttons() {
  return (
    <div className="hr-buttons">
      <Magnetic strength={0.2}>
        <Link to="projects" smooth="easeInOutQuart" duration={400} offset={-90} className="hr-btn hr-btn-primary">
          View Projects <ArrowRight size={19} />
        </Link>
      </Magnetic>
      <Magnetic strength={0.2}>
        <a href={RESUME} target="_blank" rel="noreferrer" className="hr-btn hr-btn-outline">
          <Download size={18} /> Download Resume
        </a>
      </Magnetic>
    </div>
  );
}

const Stat = ({ s }) => (/^\d/.test(s.value) ? <Counter value={s.value} /> : s.value);

function Stats({ right = false }) {
  return (
    <ul className={`hr-stats ${right ? 'hr-stats-right' : ''}`}>
      {STATS.map((s) => (
        <li key={s.label}>
          <strong><Stat s={s} /></strong>
          <span>{s.label}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- plain stacked version ---------------- */
function Stacked({ time }) {
  const fade = (delay) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } });
  return (
    <section className="hero hr-plain" id="home">
      <div className="hr-plain-in">
        <motion.span {...fade(0.05)} className="hr-pill"><span className="hr-dot" /><RotatingStatus /></motion.span>
        <div className="hr-plain-head">
          <h1 className="hr-plain-name" aria-label="Sabari Suresh">
            <span>Sabari</span>
            <span className="hr-outline">Suresh</span>
          </h1>
          <motion.img {...fade(0.3)} src={heroPhoto} alt="Sabari Suresh" className="hr-plain-photo" />
        </div>
        <WordsFade delay={0.5} text={INTRO_TEXT} className="hr-plain-lead" />
        <TypedRole />
        <motion.div {...fade(0.9)}><Buttons /></motion.div>
        <motion.div {...fade(1)} className="hr-plain-stats"><Stats /></motion.div>
        <p className="hr-loc"><MapPin size={16} /> Kerala · <b>{time}</b></p>
      </div>
    </section>
  );
}

/* ---------------- pinned scene ---------------- */
/* one letter of the big name: rises on load, then flies outward and tilts away as you scroll */
function FlyLetter({ ch, i, count, dir, p, rise, outline }) {
  const t = i / Math.max(1, count - 1);
  const x = useTransform(p, [0, 0.65], ['0vw', `${dir * (18 + t * 26)}vw`]);
  const rotate = useTransform(p, [0, 0.65], [0, dir * (6 + t * 14)]);
  const y = useTransform(p, [0, 0.65], ['0vh', `${-4 - t * 10}vh`]);
  const opacity = useTransform(p, [0, 0.3 + t * 0.2], [1, 0]);
  return (
    <motion.span className="hp-fly" style={{ x, y, rotate, opacity }}>
      <span className="hp-bob" style={{ animationDelay: `${1.6 + i * 0.28}s` }}>
        <span className="hp-mask">
          <motion.span
            className={`hp-char ${outline ? 'hp-char-outline' : ''}`}
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            whileHover={{ y: '-6%', scale: 1.08, transition: { type: 'spring', stiffness: 400, damping: 14 } }}
            transition={{ duration: 0.9, delay: rise + i * 0.06, ease: EASE }}
          >
            {ch}
          </motion.span>
        </span>
      </span>
    </motion.span>
  );
}

function Pinned({ time }) {
  const ref = useRef(null);
  const stageRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const nextRipple = useRef(0);
  const ripple = (e) => {
    const id = (nextRipple.current += 1);
    setRipples((r) => [...r.slice(-4), { id, x: e.clientX, y: e.clientY }]);
  };

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const photoScale = useTransform(p, [0, 1], [1, 1.18]);
  const ringScale = useTransform(p, [0, 1], [0.82, 1.3]);
  const ringRotate = useTransform(p, [0, 1], [0, 140]);
  const ringRotateBack = useTransform(p, [0, 1], [0, -220]);
  const echoX = useTransform(p, [0, 1], ['6vw', '-30vw']);
  const echoOpacity = useTransform(p, [0, 0.4, 1], [0.35, 1, 1]);
  const leftCardX = useTransform(p, [0.3, 0.7], [-60, 0]);
  const rightCardX = useTransform(p, [0.3, 0.7], [60, 0]);
  const cardOpacity = useTransform(p, [0.3, 0.65], [0, 1]);
  const hintOpacity = useTransform(p, [0, 0.2], [1, 0]);
  const railFill = useTransform(p, [0, 1], [0, 1]);
  const sceneOpacity = useTransform(p, [0.82, 1], [1, 0]);

  /* card text starts animating once the cards have appeared */
  const [shown, setShown] = useState(false);
  useMotionValueEvent(p, 'change', (v) => { if (v > 0.45) setShown((x) => x || true); });

  /* portrait leans toward the pointer (written straight to the DOM) */
  const lean = (e) => {
    const el = stageRef.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    el.style.setProperty('--tx', ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
    el.style.setProperty('--ty', ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
  };

  const FIRST = 'SABARI'.split('');
  const LAST = 'SURESH'.split('');

  return (
    <section className="hero hp" id="home">
      <div ref={ref} className="hp-track">
        <motion.div ref={stageRef} className="hp-stage" onPointerMove={lean} onPointerDown={ripple} style={{ '--tx': 0, '--ty': 0, opacity: sceneOpacity }}>
          {/* outlined copy of the full name drifting behind everything */}
          <motion.p aria-hidden="true" className="hp-echo" style={{ x: echoX, opacity: echoOpacity }}>
            Sabari Suresh · Sabari Suresh
          </motion.p>

          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: EASE }} className="hp-status">
            <span className="hr-pill"><span className="hr-dot hr-dot-ping" /><RotatingStatus /></span>
          </motion.div>

          {/* rings that turn as you scroll, each with a dot riding on it */}
          <div className="hp-ring-pos hp-ring-pos-a" aria-hidden="true">
            <motion.div className="hp-ring" style={{ scale: ringScale, rotate: ringRotate }}>
              <span className="hp-ring-line hp-ring-dashed" />
              <span className="hp-ring-dot hp-ring-dot-top" />
            </motion.div>
          </div>
          <div className="hp-ring-pos hp-ring-pos-b" aria-hidden="true">
            <motion.div className="hp-ring" style={{ scale: ringScale, rotate: ringRotateBack }}>
              <span className="hp-ring-line hp-ring-solid" />
              <span className="hp-ring-dot hp-ring-dot-bottom" />
            </motion.div>
          </div>

          {ripples.map((r) => (
            <span key={r.id} aria-hidden="true" className="hp-ripple" style={{ left: r.x, top: r.y }} onAnimationEnd={() => setRipples((l) => l.filter((x) => x.id !== r.id))} />
          ))}

          {/* the name, letter by letter, either side of the portrait */}
          <h1 aria-label="Sabari Suresh" className="hp-h1">
            <span aria-hidden="true" className="hp-name">
              <span className="hp-line">
                {FIRST.map((ch, i) => <FlyLetter key={i} ch={ch} i={i} count={FIRST.length} dir={-1} p={p} rise={0.2} />)}
              </span>
              <span className="hp-line">
                {LAST.map((ch, i) => <FlyLetter key={i} ch={ch} i={i} count={LAST.length} dir={-1} p={p} rise={0.4} />)}
              </span>
            </span>
          </h1>

          {/* portrait anchored to the bottom, growing with scroll */}
          <div className="hp-photo-pos">
            <motion.div style={{ scale: photoScale, transformOrigin: '50% 100%' }} initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.3, delay: 0.4, ease: EASE }}>
              <img src={heroPhoto} alt="Sabari Suresh" className="hp-photo" />
            </motion.div>
          </div>

          {/* cards slide in from the sides as the name leaves */}
          <motion.div className="hp-card hp-card-l" style={{ opacity: cardOpacity, x: leftCardX }}>
            <span className="hp-sweep" aria-hidden="true" />
            <p className="hp-card-label"><Scramble text="About me" run={shown} /></p>
            <Highlighted text={INTRO_TEXT} run={shown} className="hp-card-text" />
            <TypedRole />
          </motion.div>

          <motion.div className="hp-card hp-card-r" style={{ opacity: cardOpacity, x: rightCardX }}>
            <span className="hp-sweep" aria-hidden="true" />
            <p className="hp-card-label hp-card-label-r"><Scramble text="In numbers" run={shown} /></p>
            <Stats right />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1, ease: EASE }} className="hp-buttons">
            <Buttons />
          </motion.div>
          <p className="hp-loc hr-loc"><MapPin size={16} /> Kerala · <b>{time}</b></p>

          <div className="hp-rail" aria-hidden="true">
            <motion.span className="hp-rail-hint" style={{ opacity: hintOpacity }}>Scroll</motion.span>
            <span className="hp-rail-bar"><motion.span style={{ scaleY: railFill }} /></span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Hero() {
  const plain = usePlain();
  const time = useKeralaTime();
  return plain ? <Stacked time={time} /> : <Pinned time={time} />;
}
