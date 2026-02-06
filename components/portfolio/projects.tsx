'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

export default function Projects() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  const projects = [
    {
      title: 'CloudDash',
      description:
        'Real-time analytics dashboard for cloud infrastructure monitoring. Built with React, TypeScript, and WebSockets for live data updates.',
      tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'WebSockets'],
      link: '#',
    },
    {
      title: 'PyMetrics',
      description:
        'Python-based metrics collection library with automatic instrumentation. Used by 500+ developers for application monitoring.',
      tech: ['Python', 'FastAPI', 'Prometheus', 'Redis'],
      link: '#',
    },
    {
      title: 'Design System',
      description:
        'Comprehensive design system and component library. Includes 50+ components, documentation, and accessibility guidelines.',
      tech: ['React', 'TypeScript', 'Tailwind CSS', 'Storybook'],
      link: '#',
    },
    {
      title: 'Data Pipeline',
      description:
        'ETL pipeline processing 100M+ events daily. Built with Python and optimized for cost and performance.',
      tech: ['Python', 'Apache Airflow', 'Spark', 'AWS'],
      link: '#',
    },
  ]

  return (
    <section id="projects" className="py-24">
      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Projects</h2>
          <div className="w-12 h-1 bg-accent rounded" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="group bg-card border border-border rounded-lg p-6 hover:border-accent/50 hover:shadow-lg transition duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition">
                  {project.title}
                </h3>
                <ArrowRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-1" />
              </div>

              <p className="text-foreground/70 mb-6 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                className="inline-flex items-center gap-2 mt-6 text-accent font-medium hover:gap-3 transition"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
