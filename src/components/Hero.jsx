import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Download, MapPin } from 'lucide-react';
import { FaAngular, FaNodeJs } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiTypescript } from 'react-icons/si';
import { Link } from 'react-scroll';
import { Magnetic } from './Animations';
import heroPhoto from '../assets/me-new.png';
import './Hero.css';

const EASE = [0.16, 1, 0.3, 1];
const RESUME = 'https://drive.google.com/file/d/1FZVECtlgDd7GsdTKtOE5W6oslzuyePnT/view?usp=sharing';

const LEAD = 'I build scalable, high-performance web apps with the MEAN stack and clean, tested code.';
const HELLO = '// hello, world';
const MARQUEE = ['Angular', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'REST APIs', 'SQL', 'Git & GitHub', 'Responsive UI'];

const TERMINAL = [
  '$ ng build --prod',
  '✔ compiled successfully',
  '$ node server.js',
  '✔ api listening on :3000',
  '$ mongosh connect',
  '✔ database connected',
];

const floaters = [
  { icon: FaAngular, depth: 38, className: 'hs-float-a' },
  { icon: FaNodeJs, depth: -30, className: 'hs-float-b' },
  { icon: SiMongodb, depth: 22, className: 'hs-float-c' },
  { icon: SiExpress, depth: -44, className: 'hs-float-d' },
  { icon: SiTypescript, depth: 30, className: 'hs-float-e' },
];

/* "// hello, world" typed once with a blinking caret */
function Hello() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setN((v) => (v < HELLO.length ? v + 1 : v)), 70);
    return () => window.clearInterval(id);
  }, []);
  return <p className="hs-hello">{HELLO.slice(0, n)}<i className="hs-caret" /></p>;
}

/* every letter flips up out of the dark, one after another */
function FlipName({ text, delay }) {
  return (
    <span className="hs-line" aria-hidden="true">
      {text.split('').map((ch, i) => (
        <span key={i} className="hs-letter-box">
          <motion.span
            className="hs-letter"
            initial={{ rotateX: -95, y: '60%', opacity: 0 }}
            animate={{ rotateX: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease: EASE }}
            style={{ transformOrigin: '50% 100%' }}
          >
            <span className="hs-letter-in" style={{ animationDelay: `${2 + i * 0.12}s` }}>{ch}</span>
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* words fade up one by one */
function Words({ text, delay }) {
  return (
    <p className="hs-lead">
      {text.split(' ').map((w, i) => (
        <motion.span
          key={i}
          className="hs-word"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: delay + i * 0.045, ease: EASE }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </p>
  );
}

/* a tiny terminal that types commands, then starts over */
function Terminal() {
  const full = TERMINAL.join('\n');
  const [n, setN] = useState(0);
  useEffect(() => {
    let timer = 0;
    let count = 0;
    const tick = () => {
      count = count > full.length + 40 ? 0 : count + 1;
      setN(Math.min(count, full.length));
      timer = window.setTimeout(tick, count >= full.length ? 60 : full[count] === '\n' ? 420 : 45);
    };
    timer = window.setTimeout(tick, 1800);
    return () => window.clearTimeout(timer);
  }, [full]);
  const lines = full.slice(0, n).split('\n');
  return (
    <div className="hs-term" aria-hidden="true">
      <div className="hs-term-dots"><i /><i /><i /></div>
      <pre>
        {lines.map((l, i) => (
          <span key={i} className={l.startsWith('✔') ? 'ok' : ''}>{l}{i === lines.length - 1 && <i className="hs-caret" />}{'\n'}</span>
        ))}
      </pre>
    </div>
  );
}

const Hero = () => {
  const ref = useRef(null);
  const mx = useSpring(useMotionValue(0), { stiffness: 110, damping: 16 });
  const my = useSpring(useMotionValue(0), { stiffness: 110, damping: 16 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const rotY = useTransform(mx, (v) => v * 16);
  const rotX = useTransform(my, (v) => v * -12);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    mx.set(px);
    my.set(py);
    const card = ref.current.querySelector('.hs-card');
    if (card) {
      card.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
      card.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
    }
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <section ref={ref} className="hero hs" id="home" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="container hs-grid">
        <motion.div className="hs-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <Hello />
          <h1 className="hs-name" aria-label="Sabari Suresh">
            <FlipName text="SABARI" delay={0.2} />
            <FlipName text="SURESH" delay={0.5} />
          </h1>
          <p className="hs-role">Full-Stack Developer · MEAN Stack</p>
          <Words text={LEAD} delay={1} />

          <motion.div className="hs-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.5, ease: EASE }}>
            <Magnetic strength={0.2}>
              <Link to="projects" smooth="easeInOutQuart" duration={400} offset={-90} className="hs-btn hs-btn-primary">
                View Projects <ArrowUpRight size={19} />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href={RESUME} target="_blank" rel="noreferrer" className="hs-btn hs-btn-outline">
                <Download size={18} /> Resume
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div className="hs-stage" style={{ y: cardY }}>
          <motion.div
            className="hs-card"
            style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1100 }}
            initial={{ opacity: 0, rotateY: -50, y: 60 }}
            animate={{ opacity: 1, rotateY: 0, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
          >
            <span className="hs-glare" aria-hidden="true" />
            <div className="hs-card-top">
              <span className="hs-badge"><i /> Open to work</span>
              <span className="hs-id">SS · 2025</span>
            </div>
            <img src={heroPhoto} alt="Sabari Suresh" className="hs-photo" />
            <div className="hs-card-bottom">
              <strong>Sabari Suresh</strong>
              <span><MapPin size={14} /> Kerala, India</span>
            </div>
          </motion.div>

          {floaters.map(({ icon: Icon, depth, className }, i) => (
            <Floater key={className} mx={mx} my={my} depth={depth} className={className} delay={0.9 + i * 0.12}>
              <Icon />
            </Floater>
          ))}

          <motion.div className="hs-term-pos" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 1.3, ease: EASE }}>
            <Terminal />
          </motion.div>
        </motion.div>
      </div>

      <div className="hs-marquee" aria-hidden="true">
        <div className="hs-marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="hs-marquee-set">
              {MARQUEE.map((m) => (<span key={m + k}>{m}<b>✦</b></span>))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* a chip that drifts with the pointer at its own depth */
function Floater({ mx, my, depth, className, delay, children }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth * 0.7);
  return (
    <motion.span className={`hs-float ${className}`} style={{ x, y }} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay, ease: EASE }}>
      <span className="hs-float-in">{children}</span>
    </motion.span>
  );
}

export default Hero;
