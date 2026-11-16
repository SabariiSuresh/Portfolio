import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Network } from 'lucide-react';
import { FaCss3Alt, FaAngular, FaNodeJs, FaGitAlt, FaGithub, FaHtml5 } from 'react-icons/fa';
import {
  SiJavascript, SiTypescript, SiExpress, SiMongodb, SiPostgresql, SiMysql, SiPostman, SiJasmine, SiLinux,
} from 'react-icons/si';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

/* the original skill set */
const TOOLS = [
  { name: 'Angular', icon: FaAngular, color: '#dd0031' },
  { name: 'JavaScript', icon: SiJavascript, color: '#f7df1e' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178c6' },
  { name: 'HTML5', icon: FaHtml5, color: '#e34f26' },
  { name: 'CSS3', icon: FaCss3Alt, color: '#1572b6' },
  { name: 'Node.js', icon: FaNodeJs, color: '#6cc24a' },
  { name: 'Express.js', icon: SiExpress, color: '#d9d9d9' },
  { name: 'RESTful APIs', icon: Network, color: '#38bdf8' },
  { name: 'Linux', icon: SiLinux, color: '#fcc624' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47a248' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169e1' },
  { name: 'MySQL', icon: SiMysql, color: '#00a6d6' },
  { name: 'Git', icon: FaGitAlt, color: '#f05032' },
  { name: 'GitHub', icon: FaGithub, color: '#ffffff' },
  { name: 'Postman', icon: SiPostman, color: '#ff6c37' },
  { name: 'Jasmine & Karma', icon: SiJasmine, color: '#b45ad0' },
];

const WORD = 'CAPABILITIES';

const Skills = () => {
  const root = useRef(null);
  const stage = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const chars = root.current.querySelectorAll('.sk-char');
      const tiles = root.current.querySelectorAll('.sk-tile');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set([chars, tiles], { y: 0, opacity: 1, rotateX: 0 });
        return;
      }
      /* everything starts far below, tilted back, then cascades up while the section is pinned */
      const from = { y: '65vh', opacity: 0, rotateX: -35 };
      gsap.set(chars, from);
      gsap.set(tiles, from);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage.current, start: 'top top', end: '+=70%', pin: true, scrub: true,
          refreshPriority: 5, invalidateOnRefresh: true,
        },
      });
      tl.to(chars, { y: '0vh', opacity: 1, rotateX: 0, stagger: { each: 0.018, from: 'start', ease: 'power2.out' }, duration: 0.41, ease: 'power3.out' }, 0);
      tl.to(tiles, { y: '0vh', opacity: 1, rotateX: 0, stagger: { each: 0.024, from: 'start', ease: 'power2.out' }, duration: 0.55, ease: 'power3.out' }, 0.12);
      tl.to({}, { duration: 0.25 });
    }, root);
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="skills" className="sk" aria-label="Technical skills">
      <div ref={stage} className="sk-stage">
        <h2 className="sk-title" aria-label={WORD}>
          {WORD.split('').map((ch, i) => <span key={i} className="sk-char" aria-hidden="true">{ch}</span>)}
        </h2>

        <div className="sk-grid">
          {TOOLS.map(({ name, icon: Icon, color }) => (
            <div key={name} className="sk-tile">
              <div className="sk-card" style={{ '--c': color }}>
                <Icon className="sk-icon" aria-hidden="true" />
                <span className="sk-name">{name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
