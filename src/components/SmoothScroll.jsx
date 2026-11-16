import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Buttery wheel scrolling. Lenis drives the scroll position; GSAP ScrollTrigger follows it.
   It stays stopped while the loading screen is up, and is skipped for reduced motion. */
export default function SmoothScroll({ enabled }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1 });
    window.lenis = lenis;
    lenis.stop();
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  useEffect(() => {
    if (enabled && window.lenis) window.lenis.start();
  }, [enabled]);

  return null;
}
