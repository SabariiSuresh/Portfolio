import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

/* headline lines; every letter rises in on scroll while the section is pinned */
const LINES = [
  [{ text: 'CRAFTING' }],
  [{ text: 'RESPONSIVE' }, { text: 'MEAN', hl: true }],
  [{ text: 'APPLICATIONS.', dim: true }],
];

const BIO =
  'I am Sabari Suresh, a full stack developer specializing in the MEAN stack, based in Kerala. ' +
  'I build scalable, high-performance web applications with Angular, Node.js, MongoDB and Express, joining clean front-end work with solid back-end APIs. ' +
  'I completed a three month full stack internship at Inmakes Infotech Pvt. Ltd (10 Feb 2025 to 10 May 2025) and have built 10+ projects, from e-commerce and food ordering to hospital management. ' +
  'Strong in SQL and problem solving, I write clean, tested, maintainable code and keep learning so I can deliver effective solutions.';

const About = () => {
  const root = useRef(null);
  const stage = useRef(null);
  const bio = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const letters = root.current.querySelectorAll('.ab-letter');
      const words = root.current.querySelectorAll('.ab-word');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(letters, { y: 0, opacity: 1, rotateX: 0 });
        gsap.set(words, { opacity: 1 });
        return;
      }

      /* 1. headline: letters rise from below, pinned for a short scroll */
      gsap.set(letters, { y: '20vh', opacity: 0, rotateX: -25 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage.current, start: 'top top', end: '+=55%', pin: true, scrub: true,
          refreshPriority: 10, invalidateOnRefresh: true,
        },
      });
      tl.to(letters, { y: 0, opacity: 1, rotateX: 0, stagger: { each: 0.024, from: 'start', ease: 'power2.out' }, duration: 0.55, ease: 'power3.out' }, 0);
      tl.to({}, { duration: 0.25 });

      /* 2. bio: words light up one by one as it scrolls through */
      gsap.fromTo(
        words,
        { opacity: 0.18 },
        { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: bio.current, start: 'top 78%', end: 'bottom 48%', scrub: 0.4 } },
      );
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="about" className="ab" aria-label="About Sabari Suresh">
      <div ref={stage} className="ab-stage">
        <div className="ab-stack">
        <h4 className="section-subtitle">About me</h4>
        <h2 className="ab-headline" aria-label="Crafting responsive MEAN applications.">
          {LINES.map((line, i) => (
            <div key={i} className="ab-line" aria-hidden="true">
              {line.map((w) => (
                <span key={w.text} className={`ab-wordwrap ${w.dim ? 'is-dim' : ''} ${w.hl ? 'is-hl' : ''}`}>
                  {w.text.split('').map((ch, k) => <span key={k} className="ab-letter">{ch}</span>)}
                </span>
              ))}
            </div>
          ))}
        </h2>
        </div>
      </div>

      <div className="ab-body">
        <p ref={bio} className="ab-bio">
          {BIO.split(' ').map((w, i) => <span key={`${w}-${i}`} className="ab-word">{w}</span>)}
        </p>
      </div>
    </section>
  );
};

export default About;
