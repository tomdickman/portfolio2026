'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function Experience() {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  }

  const experiences = [
    {
      role: 'Senior Full Stack Engineer',
      company: 'TechCorp',
      period: '2021 - Present',
      description:
        'Led development of core platform features serving 100K+ users. Mentored junior developers and established best practices for code quality and testing.',
      achievements: [
        'Architected microservices migration reducing latency by 40%',
        'Implemented automated testing increasing coverage to 85%',
        'Led technical interviews and onboarding of 5+ engineers',
      ],
    },
    {
      role: 'Full Stack Engineer',
      company: 'StartupXYZ',
      period: '2018 - 2021',
      description:
        'Built and scaled product from MVP to 50K active users. Worked across frontend, backend, and DevOps.',
      achievements: [
        'Designed and built REST API serving millions of requests monthly',
        'Optimized database queries reducing response times by 60%',
        'Implemented CI/CD pipeline reducing deployment time by 50%',
      ],
    },
    {
      role: 'Junior Developer',
      company: 'WebAgency',
      period: '2016 - 2018',
      description:
        'Developed responsive web applications using React and Node.js. Gained experience with modern web development practices.',
      achievements: [
        'Delivered 15+ client projects on time and within budget',
        'Built reusable component library reducing development time',
        'Improved website performance improving SEO rankings',
      ],
    },
  ]

  return (
    <section id="experience" className="py-24 bg-muted/30">
      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Experience</h2>
          <div className="w-12 h-1 bg-accent rounded" />
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.role}
              variants={itemVariants}
              className="relative pl-8 pb-8"
            >
              {/* Timeline connector */}
              {index !== experiences.length - 1 && (
                <div className="absolute left-3 top-10 bottom-0 w-0.5 bg-accent/20" />
              )}

              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-6 h-6 bg-accent rounded-full border-4 border-background" />

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {exp.role}
                    </h3>
                    <p className="text-accent font-medium">{exp.company}</p>
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">
                    {exp.period}
                  </p>
                </div>

                <p className="text-foreground/70 mb-4">{exp.description}</p>

                <ul className="space-y-2">
                  {exp.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="flex items-start gap-3 text-foreground/70"
                    >
                      <span className="text-accent mt-1.5 flex-shrink-0">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
