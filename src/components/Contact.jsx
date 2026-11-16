import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, X, ArrowUpRight } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { MaskLine, Magnetic } from './Animations';
import { WaveGrid } from './Lazy';
import './Contact.css';

const Contact = () => {
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const GOOGLE_FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfFpsCc90KabNvwqHAJJScAcJyk_d8wG8-_gG7DEJp4p31saA/formResponse";

    const data = new FormData();
    data.append("entry.103686451", formData.name);
    data.append("entry.255391379", formData.email);
    data.append("entry.1913224637", formData.message);

    try {
      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        body: data
      });

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <footer className="contact section-padding" id="contact">
      <div className="scene-wave"><WaveGrid /></div>

      <div className="container">
        <div className="contact-hero">
          <h4 className="section-subtitle">Get in touch</h4>
          <h2 className="contact-big">
            <MaskLine>Let's create</MaskLine><br />
            <MaskLine delay={0.1}><span className="outline">something</span> <span className="hl">great.</span></MaskLine>
          </h2>

          <Magnetic strength={0.25}>
            <a className="circle-cta" href="mailto:sabarisuresh65@gmail.com">
              <span>Say hello</span>
              <ArrowUpRight size={30} />
            </a>
          </Magnetic>
        </div>

        <div className="contact-wrapper">
          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <div className="form-group">
              <label htmlFor="name">01 — Name</label>
              <input id="name" type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">02 — Email</label>
              <input id="email" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="message">03 — Message</label>
              <textarea id="message" name="message" placeholder="Tell me about your project" rows="4" value={formData.message} onChange={handleChange} required></textarea>
            </div>

            <button
              type="submit"
              className={`btn btn-primary submit-btn ${status === 'loading' ? 'loading' : ''}`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
              <Send size={18} />
            </button>
          </motion.form>

          <motion.div
            className="contact-info"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="contact-blurb">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>

            <ul className="contact-methods">
              <li>
                <Mail size={18} />
                <div>
                  <span className="label">Email Me</span>
                  <a className="value" href="mailto:sabarisuresh65@gmail.com">sabarisuresh65@gmail.com</a>
                </div>
              </li>
              <li>
                <MapPin size={18} />
                <div>
                  <span className="label">Location</span>
                  <span className="value">India</span>
                </div>
              </li>
              <li>
                <Phone size={18} />
                <div>
                  <span className="label">Call Me</span>
                  <a className="value" href="tel:+917012573584">+91 7012573584</a>
                </div>
              </li>
            </ul>

            <div className="contact-socials">
              <a href="https://github.com/SabariiSuresh" target="_blank" rel="noreferrer" className="social-btn"><FaGithub /></a>
              <a href="https://linkedin.com/in/sabari-suresh-939301352" target="_blank" rel="noreferrer" className="social-btn"><FaLinkedin /></a>
              <a href="https://www.instagram.com/xenorez" target="_blank" rel="noreferrer" className="social-btn"><FaInstagram /></a>
            </div>
          </motion.div>
        </div>

        {/* Pop-up Modal */}
        <AnimatePresence>
          {status && status !== 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={() => setStatus(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`modal-content ${status}`}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={() => setStatus(null)}>
                  <X size={20} />
                </button>
                <div className="modal-icon">
                  {status === 'success' ? <CheckCircle size={48} /> : <AlertCircle size={48} />}
                </div>
                <h3>{status === 'success' ? 'Success!' : 'Oops!'}</h3>
                <p>
                  {status === 'success'
                    ? 'Your message has been sent successfully. I will get back to you soon!'
                    : 'Something went wrong while sending your message. Please try again later.'}
                </p>
                <button className="btn btn-primary" onClick={() => setStatus(null)}>
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Sabari Suresh. All rights reserved.</p>
          <p>Built with React &amp; Three.js</p>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
