import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useMotionValue, useTransform } from 'framer-motion';
import './Effects.css';

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
};

export const CursorGlow = () => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return <motion.div className="cursor-glow" style={{ x: sx, y: sy }} />;
};

export const Typewriter = ({ words, speed = 70, pause = 1400 }) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    let delay = deleting ? speed / 2 : speed;
    if (!deleting && text === word) delay = pause;
    const t = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === '') {
        setDeleting(false);
        setIndex((index + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, words, speed, pause]);

  return (
    <span className="typewriter">
      {text}
      <span className="typewriter-caret" />
    </span>
  );
};

export const TiltCard = ({ children, className = '', max = 10 }) => {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useTransform(
    [glowX, glowY],
    ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,59,48,0.18), transparent 55%)`
  );

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div className="tilt-glow" style={{ background: glow }} />
      {children}
    </motion.div>
  );
};

export const SplitText = ({ text, className = '', delay = 0 }) => (
  <span className={className} aria-label={text}>
    {text.split('').map((ch, i) => (
      <motion.span
        key={i}
        aria-hidden="true"
        style={{ display: 'inline-block', whiteSpace: 'pre' }}
        initial={{ opacity: 0, y: 40, rotateX: -80 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: delay + i * 0.04, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {ch}
      </motion.span>
    ))}
  </span>
);

export const Marquee = ({ items }) => (
  <div className="marquee">
    <div className="marquee-track">
      {[...items, ...items].map((item, i) => (
        <span key={i} className="marquee-item">
          <span className="marquee-star">✦</span> {item}
        </span>
      ))}
    </div>
  </div>
);
