import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  { id: 'education', year: '2021', period: '2021 — 2024', company: 'Sree Sabareesa College', role: 'Undergraduate Student', place: 'Murikkumvayal, Kottayam' },
  { id: 'inmakes', year: '2025', period: '10 FEB 2025 — 10 MAY 2025', company: 'Inmakes Infotech Pvt. Ltd', role: 'Full Stack Intern', place: 'Kerala, India' },
];

const Experience = () => {
  const root = useRef(null);
  const track = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const line = root.current.querySelector('.ex-line-fill');
      const head = root.current.querySelector('.ex-head-dot');
      const entries = root.current.querySelectorAll('.ex-entry');
      const dots = root.current.querySelectorAll('.ex-dot');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(line, { scaleY: 1 });
        gsap.set([entries, dots], { opacity: 1, y: 0, x: 0, scale: 1 });
        return;
      }

      /* the glowing line is drawn down the page as you scroll, with a bright head at its tip */
      gsap.set(line, { scaleY: 0, transformOrigin: 'top' });
      gsap.to(line, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: track.current, start: 'top 65%', end: 'bottom 70%', scrub: 0.3 },
      });
      gsap.to(head, {
        top: '100%', ease: 'none',
        scrollTrigger: { trigger: track.current, start: 'top 65%', end: 'bottom 70%', scrub: 0.3 },
      });

      /* each milestone: dot pops, text slides in from its own side */
      entries.forEach((entry, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const copy = entry.querySelector('.ex-copy');
        const dot = entry.querySelector('.ex-dot');
        gsap.set(copy, { opacity: 0, x: side * 60 });
        gsap.set(dot, { scale: 0 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: entry, start: 'top 75%', end: 'top 40%', scrub: 0.3 } });
        tl.to(dot, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, 0);
        tl.to(copy, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0.1);
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="experience" className="ex" aria-label="Experience and education">
      <div className="ex-intro">
        <h4 className="section-subtitle">My journey</h4>
        <h2 className="ex-title">Experience &amp; <span className="hl">Education</span></h2>
      </div>

      <div className="ex-top">
        <span>CAREER RECORD</span>
        <span className="ex-top-mid">2021 — 2025</span>
        <span>02 MILESTONES / CHRONOLOGICAL</span>
      </div>

      <div ref={track} className="ex-track">
        <span className="ex-line" aria-hidden="true">
          <i className="ex-line-fill" />
          <i className="ex-head-dot" />
        </span>

        {ITEMS.map((item, i) => {
          const left = i % 2 === 0;
          return (
            <article key={item.id} className="ex-entry" aria-labelledby={`ex-${item.id}`}>
              <div className={`ex-side ${left ? 'ex-left' : ''}`}>
                {left ? (
                  <div className="ex-copy ex-copy-left">
                    <span className="ex-period">{item.period}</span>
                    <span className="ex-year">{item.year}</span>
                    <h3 id={`ex-${item.id}`}>{item.company}</h3>
                    <p>{item.role}</p>
                    <small>{item.place}</small>
                  </div>
                ) : null}
              </div>
              <div className="ex-mid"><i className="ex-dot" /></div>
              <div className={`ex-side ${left ? '' : 'ex-right'}`}>
                {!left ? (
                  <div className="ex-copy ex-copy-right">
                    <span className="ex-period">{item.period}</span>
                    <span className="ex-year">{item.year}</span>
                    <h3 id={`ex-${item.id}`}>{item.company}</h3>
                    <p>{item.role}</p>
                    <small>{item.place}</small>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Experience;
