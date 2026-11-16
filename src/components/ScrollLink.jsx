import React, { useEffect, useRef } from 'react';
import { scrollToId } from '../lib/scrollTo';

/* drop-in replacement for react-scroll's <Link>: scrolls through Lenis, and can report the active section */
const ScrollLink = ({ to, offset = 0, onSetActive, spy, onClick, children, className, smooth, duration, ...rest }) => {
  void smooth; void duration;
  const cb = useRef(onSetActive);
  useEffect(() => { cb.current = onSetActive; });

  useEffect(() => {
    if (!spy) return undefined;
    let io;
    /* the section may mount later (the hero appears after the loading screen), so wait for it */
    const attach = () => {
      const el = document.getElementById(to);
      if (!el) return false;
      io = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting && cb.current) cb.current(to); },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      io.observe(el);
      return true;
    };
    let timer;
    if (!attach()) timer = setInterval(() => { if (attach()) clearInterval(timer); }, 250);
    return () => { clearInterval(timer); if (io) io.disconnect(); };
  }, [spy, to]);

  const handle = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    scrollToId(to, offset);
  };

  return (
    <a href={`#${to}`} className={className} onClick={handle} {...rest}>
      {children}
    </a>
  );
};

export default ScrollLink;
