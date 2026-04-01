import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { User, Mail, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import meImage from '../assets/meee.png';
import './About.css';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // const stats = [
  //   { label: "Projects Completed", value: "20+" },
  //   { label: "Success Rate", value: "100%" },
  //   { label: "Years Experience", value: "2+" },
  //   { label: "Happy Clients", value: "10+" },
  // ];

  return (
    <section className="about section-padding" id="about" ref={ref}>
      <div className="container about-container">
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 }
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="about-image-wrapper"
        >
          <div className="about-image-frame glass-card">
            <img src={meImage} alt="Sabari Suresh" className="about-personal-img" />
          </div>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0 }
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.8, delay: 0.2, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="about-content"
        >
          <h4 className="section-subtitle">ABOUT ME</h4>
          <h2 className="section-title">
            Passionate Software Engineer <br />
            Based in <span className="text-gradient">India</span>
          </h2>

          <p className="about-description">
            I am a highly skilled Software Engineer with a primary focus on the <strong>MEAN Stack</strong>.
            I specialize in crafting robust, scalable, and user-centric web applications that provide
            seamless digital experiences. My approach combines technical excellence with creative
            problem-solving to deliver high-quality code.
          </p>

          <div className="about-info-grid">
            <div className="info-item">
              <Mail size={18} color="var(--accent-red)" />
              <span>sabarisuresh65@gmail.com</span>
            </div>
            <div className="info-item">
              <MapPin size={18} color="var(--accent-red)" />
              <span>India</span>
            </div>
            <div className="info-item">
              <Calendar size={18} color="var(--accent-red)" />
              <span>Available for Hire</span>
            </div>
          </div>

          <div className="about-bullets">
            <div className="bullet">
              <CheckCircle2 color="var(--accent-red)" size={20} />
              <span>Full-Stack Development Expertise</span>
            </div>
            <div className="bullet">
              <CheckCircle2 color="var(--accent-red)" size={20} />
              <span>Frontend Specialist (Angular)</span>
            </div>
            <div className="bullet">
              <CheckCircle2 color="var(--accent-red)" size={20} />
              <span>Scalable Backend Systems (Node.js)</span>
            </div>
          </div>

          {/* <div className="about-stats-grid">
            {stats.map((stat, i) => (
              <div key={stat.label} className="stat-card glass-card">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div> */}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
