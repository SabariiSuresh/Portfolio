import React, { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { ScrollProgress } from './components/Effects';
import { Preloader, CustomCursor } from './components/Animations';
import SmoothScroll from './components/SmoothScroll';
import './App.css';

function App() {
  const [ready, setReady] = useState(false);

  /* the hero mounts after the loading screen, which shifts everything below it:
     re-measure every scroll animation once it is in place and once fonts and images settle */
  useEffect(() => {
    if (!ready) return undefined;
    const timers = [60, 500, 1500].map((ms) => setTimeout(() => ScrollTrigger.refresh(), ms));
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    document.fonts?.ready.then(onLoad);
    return () => { timers.forEach(clearTimeout); window.removeEventListener('load', onLoad); };
  }, [ready]);

  return (
    <div className="App">
      <SmoothScroll enabled={ready} />
      <Preloader onDone={() => setReady(true)} />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main>
        {ready && <Hero />}
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}

export default App;
