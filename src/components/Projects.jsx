import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      title: "Food-ordering-App",
      description: "A complete graduation of the MEAN stack, featuring Angular, Node.js, and MongoDB. Full e-commerce flow from cart to checkout.",
      tags: ["Angular", "Node.js", "MongoDB", "Express"],
      github: "https://github.com/SabariiSuresh/Food-ordering-App",
      link: "https://food-express-mauve.vercel.app",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "NexCart",
      description: "A modern e-commerce application built with Angular.js and Node.js. Demonstrates full-stack capabilities in a commercial context.",
      tags: ["Angular.js", "Node.js", "Bootstrap"],
      github: "https://github.com/SabariiSuresh/NexCart",
      link: "https://nexcart-1-8w09.onrender.com/",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Hospital-Management-System",
      description: "Comprehensive full-stack web application designed to streamline hospital operations, including patient and doctor management.",
      tags: ["MEAN Stack", "CRUD", "Dashboard"],
      github: "https://github.com/SabariiSuresh/Hospital-Management-System",
      link: "https://hospital-management-system-1-hl7y.onrender.com/",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Expense-Tracker",
      description: "Functional application for tracking daily or monthly expenses, built with Angular and Node.js with data visualization.",
      tags: ["Angular", "Node.js", "Charts"],
      github: "https://github.com/SabariiSuresh/Expense-Tracker",
      link: "https://expense-tracker-yof5.onrender.com/",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <section className="projects section-padding" id="projects">
      <div className="container">
        <div className="projects-header">
          <h4 className="section-subtitle">RECENT WORK</h4>
          <h2 className="section-title">Showcasing <span className="text-gradient">Innovation</span></h2>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="project-card glass-card"
            >
              <div className="project-image-container">
                <img src={project.image} alt={project.title} className="project-img" />
                <div className="project-overlay">
                  <div className="overlay-links">
                    <a href={project.github} target="_blank" rel="noreferrer" className="overlay-btn"><FaGithub size={20} /></a>
                    <a href={project.link} className="overlay-btn"><ExternalLink size={20} /></a>
                  </div>
                </div>
              </div>

              <div className="project-body">
                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a href={project.github} className="project-link">
                  View Repository <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="projects-footer">
          <a href="https://github.com/SabariiSuresh" target="_blank" rel="noreferrer" className="btn btn-secondary">
            See More on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
