import React from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Cpu, Globe, Code2, Layout, Smartphone, Terminal } from 'lucide-react';
import './Skills.css';

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <Globe size={24} />,
      skills: [
        { name: "Angular", level: 95 },
        { name: "JavaScript", level: 90 },
        { name: "TypeScript", level: 92 },
        { name: "HTML5 / CSS3", level: 98 },
      ]
    },
    {
      title: "Backend Development",
      icon: <Server size={24} />,
      skills: [
        { name: "Node.js", level: 90 },
        { name: "Express.js", level: 88 },
        { name: "RESTful APIs", level: 95 },
        { name: "Linux", level: 80 },
      ]
    },
    {
      title: "Database Solutions",
      icon: <Database size={24} />,
      skills: [
        { name: "MongoDB", level: 92 },
        { name: "PostgreSQL", level: 85 },
        { name: "MySQL", level: 80 },
      ]
    },
    {
      title: "Tools & DevOps",
      icon: <Terminal size={24} />,
      skills: [
        { name: "Git / GitHub", level: 95 },
        { name: "Postman", level: 80 },
        { name: "Jasmine and Karma", level: 75 },
      ]
    }
  ];

  return (
    <section className="skills section-padding" id="skills">
      <div className="container">
        <div className="skills-header">
          <h4 className="section-subtitle">EXPERT IN MEAN STACK</h4>
          <h2 className="section-title">Technical <span className="text-gradient">Proficiency</span></h2>
          <p className="skills-desc">
            A comprehensive set of tools and technologies I use to bring complex ideas to life,
            focusing on performance, scalability, and modern best practices.
          </p>
        </div>

        <div className="skills-grid">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="skill-category-card glass-card"
            >
              <div className="category-header">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.title}</h3>
              </div>

              <div className="skill-items">
                {category.skills.map(skill => (
                  <div key={skill.name} className="skill-item">
                    <div className="skill-info">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="skill-bar-bg">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="skill-bar-fill"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="skills-tags-cloud reveal active">
          {["MongoDB", "Express", "Angular", "Node.js", "MySql", "TypeScript", "JavaScript", "REST", "Firebase"].map((tag, i) => (
            <span key={tag} className="skill-tag">{tag}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
