import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { ScrollProgress } from './components/Effects';
import { Preloader, CustomCursor } from './components/Animations';
import './App.css';

function App() {
  const [ready, setReady] = useState(false);

  return (
    <div className="App">
      <Preloader onDone={() => setReady(true)} />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main>
        {ready && <Hero />}
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}

export default App;
