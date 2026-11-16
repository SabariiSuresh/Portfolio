import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { MaskLine } from './Animations';
import './Projects.css';

const projects = [
  {
    title: 'Food-ordering-App',
    label: 'Full-stack project',
    description: 'A complete graduation of the MEAN stack, featuring Angular, Node.js, and MongoDB. Full e-commerce flow from cart to checkout.',
    tags: ['Angular', 'Node.js', 'MongoDB', 'Express'],
    github: 'https://github.com/SabariiSuresh/Food-ordering-App',
    link: 'https://food-express-mauve.vercel.app',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'NexCart',
    label: 'Full-stack project',
    description: 'A modern e-commerce application built with Angular.js and Node.js. Demonstrates full-stack capabilities in a commercial context.',
    tags: ['Angular.js', 'Node.js', 'Bootstrap'],
    github: 'https://github.com/SabariiSuresh/NexCart',
    link: 'https://nexcart-1-8w09.onrender.com/',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Hospital-Management-System',
    label: 'Full-stack project',
    description: 'Comprehensive full-stack web application designed to streamline hospital operations, including patient and doctor management.',
    tags: ['MEAN Stack', 'CRUD', 'Dashboard'],
    github: 'https://github.com/SabariiSuresh/Hospital-Management-System',
    link: 'https://hospital-management-system-1-hl7y.onrender.com/',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Expense-Tracker',
    label: 'Full-stack project',
    description: 'Functional application for tracking daily or monthly expenses, built with Angular and Node.js with data visualization.',
    tags: ['Angular', 'Node.js', 'Charts'],
    github: 'https://github.com/SabariiSuresh/Expense-Tracker',
    link: 'https://expense-tracker-yof5.onrender.com/',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
  },
];

const CARD_BG = ['#ffe9a8', '#ffc72c', '#fff6d6', '#ffffff'];
const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const easeOut = (v) => 1 - (1 - v) ** 3;
const n = projects.length;

/* desktop = pinned stack, mobile = pinned sideways slide, list = plain (reduced motion / short screens) */
const subscribe = (cb) => {
  window.addEventListener('resize', cb);
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  return () => { window.removeEventListener('resize', cb); mq.removeEventListener('change', cb); };
};
const getMode = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerHeight < 620) return 'list';
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
};
const useMode = () => useSyncExternalStore(subscribe, getMode, () => 'desktop');

/* ---------- shared card face ---------- */
const CardFace = ({ project, index, onOpen }) => (
  <>
    <div className="pc-info">
      <div className="pc-top"><span>0{index + 1}</span><span>{project.label}</span></div>
      <h3 className="pc-title">{project.title.replace(/-/g, ' ')}</h3>
      <p className="pc-kind">Personal project</p>
      <p className="pc-desc">{project.description}</p>
      <div className="pc-bottom">
        <div className="pc-tags">
          {project.tags.slice(0, 4).map((t) => <span key={t} className="pc-tag">{t}</span>)}
        </div>
        <button type="button" className="pc-open" onClick={() => onOpen(project)}>
          Open project <ArrowUpRight size={18} />
        </button>
      </div>
    </div>
    <button type="button" className="pc-pic" aria-label={`Open ${project.title.replace(/-/g, ' ')} details`} onClick={() => onOpen(project)}>
      <img src={project.image} alt="" loading="lazy" />
    </button>
  </>
);

/* ---------- desktop: pinned stack ---------- */
const StackCard = ({ project, index, progress, onOpen }) => {
  const arrival = (k, p) => (k === 0 ? 1 : clamp(p * (n - 1) - (k - 1)));
  const y = useTransform(progress, (p) => `${(1 - easeOut(arrival(index, p))) * 105}vh`);
  const later = (p) => { let s = 0; for (let k = index + 1; k < n; k++) s += arrival(k, p); return s; };
  const scale = useTransform(progress, (p) => 1 - 0.04 * later(p));
  const shade = useTransform(progress, (p) => Math.min(0.5, 0.12 * later(p)));
  return (
    <motion.article
      className="pc-card pc-stack"
      style={{ y, scale, zIndex: index + 1, top: `${index * 1.4}rem`, background: CARD_BG[index % CARD_BG.length] }}
    >
      <CardFace project={project} index={index} onOpen={onOpen} />
      <motion.span className="pc-shade" style={{ opacity: shade }} />
    </motion.article>
  );
};

const Desktop = ({ onOpen }) => {
  const track = useRef(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  return (
    <div ref={track} className="pc-track" style={{ height: `${n * 100}svh` }}>
      <div className="pc-stage" style={{ '--n': n }}>
        {projects.map((p, i) => <StackCard key={p.title} project={p} index={i} progress={scrollYProgress} onOpen={onOpen} />)}
      </div>
    </div>
  );
};

/* ---------- phones: vertical scroll slides the row sideways ---------- */
const SlideCard = ({ project, index, progress, onOpen }) => {
  const d = (p) => clamp(Math.abs(p * (n - 1) - index));
  const scale = useTransform(progress, (p) => 1 - 0.06 * d(p));
  const opacity = useTransform(progress, (p) => 1 - 0.45 * d(p));
  return (
    <motion.article className="pc-card pc-slide" style={{ scale, opacity, background: CARD_BG[index % CARD_BG.length] }}>
      <CardFace project={project} index={index} onOpen={onOpen} />
    </motion.article>
  );
};

const Mobile = ({ onOpen }) => {
  const track = useRef(null);
  const probe = useRef(null);
  const row = useRef(null);
  const [fit, setFit] = useState(1);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (p) => `${-p * (n - 1) * 87}vw`);
  const bar = useTransform(scrollYProgress, (p) => clamp(p));

  useEffect(() => {
    const measure = () => {
      const h = probe.current.offsetHeight;
      let tallest = 0;
      row.current.querySelectorAll('.pc-card').forEach((c) => { tallest = Math.max(tallest, c.offsetHeight); });
      if (tallest) setFit(clamp((h - 80 - 56) / tallest, 0.5, 1));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(probe.current);
    row.current.querySelectorAll('.pc-card').forEach((c) => ro.observe(c));
    window.addEventListener('orientationchange', measure);
    return () => { ro.disconnect(); window.removeEventListener('orientationchange', measure); };
  }, []);

  return (
    <div ref={track} className="pc-track" style={{ height: `${(n - 1) * 38 + 100}svh` }}>
      <div className="pc-mstage">
        <div ref={probe} className="pc-probe" aria-hidden="true" />
        <div className="pc-fit" style={{ transform: `scale(${fit})` }}>
          <motion.div ref={row} className="pc-row" style={{ x }}>
            {projects.map((p, i) => <SlideCard key={p.title} project={p} index={i} progress={scrollYProgress} onOpen={onOpen} />)}
          </motion.div>
        </div>
        <div className="pc-progress"><motion.span style={{ scaleX: bar }} /></div>
        <p className="pc-hint">Scroll to slide</p>
      </div>
    </div>
  );
};

/* ---------- plain list ---------- */
const List = ({ onOpen }) => (
  <div className="pc-list">
    {projects.map((p, i) => (
      <article key={p.title} className="pc-card pc-plain" style={{ background: CARD_BG[i % CARD_BG.length] }}>
        <CardFace project={p} index={i} onOpen={onOpen} />
      </article>
    ))}
  </div>
);

/* ---------- details window ---------- */
const Details = ({ project, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const name = project.title.replace(/-/g, ' ');
  return (
    <motion.div className="pm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="pm-window" role="dialog" aria-modal="true" aria-label={name}
        initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="pm-close" aria-label="Close" onClick={onClose}><X size={20} /></button>
        <img className="pm-img" src={project.image} alt={name} />
        <p className="pm-meta">{project.label} · Personal project</p>
        <h3 className="pm-title">{name}</h3>
        <div className="pm-tags">{project.tags.map((t) => <span key={t}>{t}</span>)}</div>
        <p className="pm-desc">{project.description}</p>
        <div className="pm-actions">
          <a href={project.link} target="_blank" rel="noreferrer" className="pm-btn pm-btn-main">Live demo <ArrowUpRight size={18} /></a>
          <a href={project.github} target="_blank" rel="noreferrer" className="pm-btn"><FaGithub size={18} /> Source code</a>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const mode = useMode();
  const [open, setOpen] = useState(null);
  const Body = mode === 'desktop' ? Desktop : mode === 'mobile' ? Mobile : List;

  return (
    <section className="projects" id="projects">
      <div className="container projects-header-wrap section-padding">
        <div className="projects-header">
          <h4 className="section-subtitle">Recent work</h4>
          <h2 className="section-title"><MaskLine>Showcasing <span className="hl">Innovation</span></MaskLine></h2>
        </div>
      </div>

      <Body key={mode} onOpen={setOpen} />

      <div className="container projects-footer section-padding">
        <a href="https://github.com/SabariiSuresh" target="_blank" rel="noreferrer" className="btn btn-secondary">
          See More on GitHub <ArrowUpRight size={18} />
        </a>
      </div>

      <AnimatePresence>{open && <Details project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
};

export default Projects;
