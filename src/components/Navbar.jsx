import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-scroll';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', to: 'home' },
    { name: 'About', to: 'about' },
    { name: 'Skills', to: 'skills' },
    { name: 'Projects', to: 'projects' },
    { name: 'Contact', to: 'contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="logo"
        >
          <Link to="home" smooth duration={100} offset={-70}>
            <span className="logo-text">SABARI</span>
          </Link>
          <span className="logo-dot">.</span>
        </motion.div>

        <ul className="nav-links desktop-only">
          {navLinks.map((link , i) => (
            <motion.li key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={link.to}
                smooth="easeInOutQuart"
                duration={100}
                spy={true}
                offset={-70}
                activeClass="active-link"
                isDynamic={true}
              >
                {link.name}
              </Link>
            </motion.li>
          ))}
        </ul>

        <div className="nav-socials desktop-only">
          <a href="https://github.com/SabariiSuresh" target="_blank" rel="noreferrer"><FaGithub size={20} /></a>
          <a href="https://linkedin.com/in/sabari-suresh-939301352" target="_blank" rel="noreferrer"><FaLinkedin size={20} /></a>
          <a href="https://www.instagram.com/xenorez"><FaInstagram size={20} /></a>
        </div>

        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu"
          >
            <ul className="mobile-nav-links">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    smooth="easeInOutQuart"
                    duration={100}
                    offset={-70}

                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="mobile-socials">
                <a href="https://github.com/SabariiSuresh" target="_blank" rel="noreferrer"><FaGithub size={24} /></a>
                <a href="https://linkedin.com/in/sabari-suresh-939301352" target="_blank" rel="noreferrer"><FaLinkedin size={24} /></a>
                <a href="#"><FaInstagram size={24} /></a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
