import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-scroll';
import './Navbar.css';

const navLinks = [
  { name: 'Home', to: 'home' },
  { name: 'About', to: 'about' },
  { name: 'Skills', to: 'skills' },
  { name: 'Projects', to: 'projects' },
  { name: 'Contact', to: 'contact' },
];

const socials = [
  { icon: FaGithub, href: 'https://github.com/SabariiSuresh' },
  { icon: FaLinkedin, href: 'https://linkedin.com/in/sabari-suresh-939301352' },
  { icon: FaInstagram, href: 'https://www.instagram.com/xenorez' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('home');
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 200 && !isOpen);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isOpen]);

  return (
    <>
      <motion.header
        className="topnav"
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden ? -120 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="topnav-bar">
          <Link to="home" smooth duration={400} className="topnav-logo">
            <span className="logo-mark">SS</span>
            <span className="logo-text">
              <strong>Sabari Suresh</strong>
              <small>MEAN Stack Developer</small>
            </span>
          </Link>

          <nav className="topnav-links">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                smooth="easeInOutQuart"
                duration={400}
                spy
                offset={-90}
                onSetActive={() => setActive(link.to)}
                className={`topnav-link ${active === link.to ? 'is-active' : ''}`}
              >
                {active === link.to && (
                  <motion.span layoutId="nav-active" className="topnav-pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <span className="topnav-label">{link.name}</span>
              </Link>
            ))}
          </nav>

          <div className="topnav-right">
            <Link to="contact" smooth="easeInOutQuart" duration={400} offset={-90} className="topnav-cta">
              Let's Connect <ArrowUpRight size={18} />
            </Link>
            <button className="topnav-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ul>
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                >
                  <Link to={link.to} smooth duration={400} offset={-90} onClick={() => setIsOpen(false)}>
                    <span>0{i + 1}</span> {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mobile-socials">
              {socials.map(({ icon: Icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noreferrer"><Icon size={22} /></a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
