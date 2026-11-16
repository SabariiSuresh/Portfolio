import React, { useEffect, useRef } from 'react';
import { scrollToId } from '../lib/scrollTo';

/* drop-in replacement for react-scroll's <Link>: scrolls through Lenis, and can report the active section */
const ScrollLink = ({ to, offset = 0, onSetActive, spy, onClick, children, className, smooth, duration, ...rest }) => {
  void smooth; void duration;
  const cb = useRef(onSetActive);
  useEffect(() => { cb.current = onSetActive; });

  useEffect(() => {
    if (!spy) return undefined;
    const el = document.getElementById(to);
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && cb.current) cb.current(to); },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
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
