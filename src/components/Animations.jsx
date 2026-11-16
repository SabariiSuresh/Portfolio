import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import './Animations.css';

/* ---------- Preloader ---------- */
export const Preloader = ({ onDone }) => {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 2,
      ease: 'easeInOut',
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setTimeout(() => setShow(false), 250),
    });
    return () => controls.stop();
  }, []);

  // Lock scroll only while the loader is visible. A leftover overflow:hidden on <body>
  // turns it into a scroll container and breaks position: sticky further down the page.
  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          className="preloader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="preloader-word">
            {'SABARI'.split('').map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {ch}
              </motion.span>
            ))}
          </div>
          <div className="preloader-bar"><motion.i style={{ scaleX: count / 100 }} /></div>
          <div className="preloader-count">{String(count).padStart(3, '0')}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------- Custom cursor ---------- */
export const CustomCursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 220, damping: 22 });
  const ry = useSpring(y, { stiffness: 220, damping: 22 });
  const [active, setActive] = useState(false);
  const [enabled] = useState(() => !window.matchMedia('(pointer: coarse)').matches);

  useEffect(() => {
    if (!enabled) return undefined;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setActive(!!e.target.closest('a, button, input, textarea, .magnetic'));
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y, enabled]);

  if (!enabled) return null;
  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} />
      <motion.div className={`cursor-ring ${active ? 'active' : ''}`} style={{ x: rx, y: ry }} />
    </>
  );
};

/* ---------- Magnetic wrapper ---------- */
export const Magnetic = ({ children, strength = 0.35 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="magnetic"
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
};

/* ---------- Masked text reveal ---------- */
/* The observer watches the (visible) mask wrapper, not the translated child: a child that is
   clipped by its own overflow:hidden parent never counts as "in view". */
export const MaskLine = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <span className="mask-line" ref={ref}>
      <motion.span
        className="mask-inner"
        initial={{ y: '115%' }}
        animate={{ y: inView ? 0 : '115%' }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
};

/* ---------- Clip-path wipe (observer on the wrapper, clip applied to the inner layer) ---------- */
export const WipeIn = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return (
    <div ref={ref} className={className}>
      <motion.div
        className="wipe-inner"
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={{ clipPath: inView ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)' }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ---------- Counter ---------- */
export const Counter = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const match = String(value).match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : '';
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, target, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, target]);

  return <span ref={ref}>{n}{suffix}</span>;
};

/* ---------- Parallax image ---------- */
export const ParallaxImg = ({ src, alt }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  return (
    <div ref={ref} className="parallax-wrap">
      <motion.img src={src} alt={alt} style={{ y }} className="parallax-img" />
    </div>
  );
};

/* ---------- Particle network ---------- */
export const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w, h, raf;
    const mouse = { x: -1000, y: -1000 };
    let particles = [];

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const count = Math.min(90, Math.floor((w * h) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.6,
        o: Math.random() < 0.25,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 120) {
          p.x += (dx / d) * 1.5;
          p.y += (dy / d) * 1.5;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.o ? 'rgba(255,199,44,0.9)' : 'rgba(255,255,255,0.55)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(${p.o || q.o ? '255,199,44' : '255,255,255'},${(1 - dist / 130) * 0.25})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

/* ---------- Rotating circular badge ---------- */
export const RotatingBadge = ({ text = 'SCROLL DOWN • EXPLORE MORE • ', onClick }) => (
  <button className="rot-badge" onClick={onClick} aria-label="Scroll down">
    <svg viewBox="0 0 120 120" className="rot-badge-svg">
      <defs>
        <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
      </defs>
      <text>
        <textPath href="#badge-circle">{text}</textPath>
      </text>
    </svg>
    <span className="rot-badge-arrow">↓</span>
  </button>
);

/* ---------- Second marquee row (opposite direction) ---------- */
export const MarqueeReverse = ({ items }) => (
  <div className="marquee marquee-reverse">
    <div className="marquee-track">
      {[...items, ...items].map((item, i) => (
        <span key={i} className="marquee-item solid">
          <span className="marquee-star">✦</span> {item}
        </span>
      ))}
    </div>
  </div>
);

/* ---------- Scroll-lit words: each word brightens as you scroll through the paragraph ---------- */
const LitWord = ({ word, range, progress }) => {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }} className="lit-word">{word} </motion.span>;
};

export const ScrollWords = ({ text, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <LitWord key={i} word={w} range={[i / words.length, (i + 1) / words.length]} progress={scrollYProgress} />
      ))}
    </p>
  );
};
