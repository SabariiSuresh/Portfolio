import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Heart, CheckCircle, AlertCircle, X } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
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
      <div className="container">
        <div className="contact-header">
          <h4 className="section-subtitle">GET IN TOUCH</h4>
          <h2 className="section-title">Let's Create <span className="text-gradient">Something </span> Great</h2>
        </div>

        <div className="contact-wrapper">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="contact-info"
          >
            <div className="contact-card glass-card">
              <h3>Contact Information</h3>
              <p>I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>

              <div className="contact-methods">
                <div className="method">
                  <div className="icon-box"><Mail size={20} /></div>
                  <div>
                    <p className="label">Email Me</p>
                    <p className="value">sabarisuresh65@gmail.com</p>
                  </div>
                </div>
                <div className="method">
                  <div className="icon-box"><MapPin size={20} /></div>
                  <div>
                    <p className="label">Location</p>
                    <p className="value">India</p>
                  </div>
                </div>
                <div className="method">
                  <div className="icon-box"><Phone size={20} /></div>
                  <div>
                    <p className="label">Call Me</p>
                    <p className="value">+91 7012573584</p>
                  </div>
                </div>
              </div>

              <div className="contact-socials">
                <a href="https://github.com/SabariiSuresh" target="_blank" rel="noreferrer" className="social-btn"><FaGithub /></a>
                <a href="https://linkedin.com/in/sabari-suresh-939301352" target="_blank" rel="noreferrer" className="social-btn"><FaLinkedin /></a>
                <a href="https://www.instagram.com/xenorez" className="social-btn"><FaInstagram /></a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="contact-form-container"
          >
            <form className="contact-form glass-card" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className={`btn btn-primary submit-btn ${status === 'loading' ? 'loading' : ''}`}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
                <Send size={18} />
              </button>
            </form>
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
                className={`modal-content glass-card ${status}`}
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
        </div>
      </div>
    </footer>
  );
};

export default Contact;
