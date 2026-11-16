import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { MaskLine } from './Animations';
import { KnotScene, DistortImage } from './Lazy';
import './Projects.css';

const projects = [
  {
    title: 'Food-ordering-App',
    label: 'Full-stack project',
    tagline: 'MEAN stack food ordering platform',
    description: 'A complete graduation of the MEAN stack, featuring Angular, Node.js, and MongoDB. Full e-commerce flow from cart to checkout.',
    points: ['Cart-to-checkout ordering flow', 'Angular front end with Node.js & Express API', 'MongoDB data layer'],
    tags: ['Angular', 'Node.js', 'MongoDB', 'Express'],
    github: 'https://github.com/SabariiSuresh/Food-ordering-App',
    link: 'https://food-express-mauve.vercel.app',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop',
    theme: 'white',
  },
  {
    title: 'NexCart',
    label: 'Full-stack project',
    tagline: 'Modern e-commerce application',
    description: 'A modern e-commerce application built with Angular.js and Node.js. Demonstrates full-stack capabilities in a commercial context.',
    points: ['Complete online shopping experience', 'Angular.js front end styled with Bootstrap', 'Node.js back end'],
    tags: ['Angular.js', 'Node.js', 'Bootstrap'],
    github: 'https://github.com/SabariiSuresh/NexCart',
    link: 'https://nexcart-1-8w09.onrender.com/',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop',
    theme: 'accent',
  },
  {
    title: 'Hospital-Management-System',
    label: 'Full-stack project',
    tagline: 'Hospital operations, streamlined',
    description: 'Comprehensive full-stack web application designed to streamline hospital operations, including patient and doctor management.',
    points: ['Patient and doctor management', 'Full CRUD operations', 'Dashboard for hospital operations'],
    tags: ['MEAN Stack', 'CRUD', 'Dashboard'],
    github: 'https://github.com/SabariiSuresh/Hospital-Management-System',
    link: 'https://hospital-management-system-1-hl7y.onrender.com/',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop',
    theme: 'dark',
  },
  {
    title: 'Expense-Tracker',
    label: 'Full-stack project',
    tagline: 'Track spending with clear visuals',
    description: 'Functional application for tracking daily or monthly expenses, built with Angular and Node.js with data visualization.',
    points: ['Daily and monthly expense tracking', 'Charts for data visualization', 'Angular front end, Node.js back end'],
    tags: ['Angular', 'Node.js', 'Charts'],
    github: 'https://github.com/SabariiSuresh/Expense-Tracker',
    link: 'https://expense-tracker-yof5.onrender.com/',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
    theme: 'white',
  },
];

/*
 * Scroll timeline (progress 0 -> 1 across the pinned track), in m = 2 * (n - 1) equal steps:
 *   steps 1 .. n-1   card i slides up from below and stacks under the previous ones
 *   steps n .. 2n-2  cards are peeled off upward one by one, back card first;
 *                    the cards left behind each move up one notch
 */
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (v) => (v < 0.5 ? 4 * v * v * v : 1 - ((-2 * v + 2) ** 3) / 2);

const cardY = (i, n, p) => {
  const m = 2 * (n - 1);
  const t = p * m;
  const offset = window.innerWidth < 900 ? 58 : 118;
  const vh = window.innerHeight;

  let shift = 0;
  for (let j = 0; j < i; j++) shift += ease(clamp01(t - (n - 1 + j)));
  const rest = (i - shift) * offset;

  const enter = i === 0 ? 1 : ease(clamp01(t - (i - 1)));
  let y = vh + (rest - vh) * enter;

  if (i <= n - 2) {
    const leave = ease(clamp01(t - (n - 1 + i)));
    y += (-vh - y) * leave;
  }
  return y;
};

const StackCard = ({ project, index, total, progress }) => {
  const y = useTransform(progress, (p) => cardY(index, total, p));

  return (
    <motion.article className={`stack-card theme-${project.theme}`} style={{ y, zIndex: index + 1 }}>
      <div className="stack-info">
        <div className="stack-top">
          <span>0{index + 1}</span>
          <span>{project.label}</span>
        </div>

        <h3 className="stack-title"><MaskLine>{project.title.replace(/-/g, ' ')}</MaskLine></h3>
        <p className="stack-tagline">{project.tagline}</p>
        <p className="stack-desc">{project.description}</p>

        <ul className="stack-points">
          {project.points.map((pt) => (
            <li key={pt}><span>→</span> {pt}</li>
          ))}
        </ul>

        <div className="stack-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <div className="stack-bottom">
          <span className="stack-role">Full Stack Developer</span>
          <div className="project-links">
            <a href={project.link} target="_blank" rel="noreferrer" className="project-link">
              Live Demo <ArrowUpRight size={16} />
            </a>
            <a href={project.github} target="_blank" rel="noreferrer" className="project-link alt">
              <FaGithub size={16} /> Repository
            </a>
          </div>
        </div>
      </div>

      <a href={project.link} target="_blank" rel="noreferrer" className="project-thumb">
        <DistortImage src={project.image} alt={project.title} />
        <span className="thumb-arrow"><ArrowUpRight size={24} /></span>
      </a>
    </motion.article>
  );
};

const Projects = () => {
  const trackRef = useRef(null);
  const n = projects.length;
  const steps = 2 * (n - 1);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });

  return (
    <section className="projects" id="projects">
      <div className="scene-dodeca"><KnotScene variant="dodeca" /></div>

      <div className="container projects-header-wrap section-padding">
        <div className="projects-header">
          <h4 className="section-subtitle">Recent work</h4>
          <h2 className="section-title"><MaskLine>Showcasing <span className="hl">Innovation</span></MaskLine></h2>
        </div>
      </div>

      <div className="container">
        <div className="stack-track" ref={trackRef} style={{ height: `calc(${steps} * 85vh + 100vh)` }}>
          <div className="stack-stage">
            {projects.map((project, index) => (
              <StackCard key={project.title} project={project} index={index} total={n} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>

      <div className="container projects-footer section-padding">
        <a href="https://github.com/SabariiSuresh" target="_blank" rel="noreferrer" className="btn btn-secondary">
          See More on GitHub <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default Projects;
