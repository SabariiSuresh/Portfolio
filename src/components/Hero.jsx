import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Code2, Layers, Cpu } from 'lucide-react';
import { Link } from 'react-scroll';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-bg-elements">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="hero-blob blob-1"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="hero-blob blob-2"
        />
      </div>

      <div className="container hero-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-badge"
          >
            <span className="badge-dot"></span>
            MEAN Stack Developer
          </motion.div>

          <h1 className="hero-title">
            <span className="light">Hi, I'm</span> <br />
            <span className="text-gradient">SABARI SURESH</span>
          </h1>

          <p className="hero-subtitle">
            Building scalable, high-performance web applications with modern technologies and clean code.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="hero-cta"
          >
            <Link
              to='projects'
              smooth="easeInOutQuart"
              duration={100}
              offset={-70}
              className='btn btn-primary'>Explore My Work
            </Link>
            <a href="https://drive.google.com/file/d/1FZVECtlgDd7GsdTKtOE5W6oslzuyePnT/view?usp=sharing" target="_blank" rel="noreferrer" className="btn btn-secondary">Resume</a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hero-visual"
        >
          <div className="hero-card glass-card">
            <div className="card-item">
              <div className="icon-box"><Layers color="#ff3b30" /></div>
              <div>
                <h4>Angular Development</h4>
                <p>Modern Frontend Solutions</p>
              </div>
            </div>
            <div className="card-item">
              <div className="icon-box"><Cpu color="#ff3b30" /></div>
              <div>
                <h4>Node.js / Express</h4>
                <p>Scalable Backend Systems</p>
              </div>
            </div>
            <div className="card-item">
              <div className="icon-box"><Code2 color="#ff3b30" /></div>
              <div>
                <h4>MongoDB & SQL</h4>
                <p>Efficient Data Management</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="scroll-indicator"
      >
        <ChevronDown size={32} color="var(--text-secondary)" />
      </motion.div>
    </section>
  );
};

export default Hero;
