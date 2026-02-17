"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  const experiences = [
    {
      role: "Senior Software Engineer",
      company: "DiUS",
      period: "2023 - Present",
      description:
        "React, NodeJS, Python, GraphQL and PostgreSQL engineering on AWS cloud platforms.",
      achievements: [
        "Architected and delivered e-commerce modernisation increasing platform speed by ~50% and improving web sales by ~14 basis points for a major Australian retailer",
        "Development of robust gRPC micro-service based APIs, with a focus on speed, performance and scalability",
        "Designed and delivered bespoke token based design systems fully integrated with Figma and Storybook, built for performance",
      ],
    },
    {
      role: "Software Engineer",
      company: "DiUS",
      period: "2021 - 2023",
      description:
        "React, NodeJS, Python and Java engineering for multiple large enterprises",
      achievements: [
        "Designed and built micro-frontend applications for a large multi-national financial institution",
        "Developed custom design system components using web components to remain framework agnostic",
        "Management and delivery of web applications using cloud infrastructure including IAC (infrastructure as code) management",
      ],
    },
    {
      role: "Web Developer",
      company: "Catalyst IT",
      period: "2018 - 2020",
      description:
        "Developed responsive cloud based web applications using PHP, Python, Javascript, HTML and CSS. Gained experience with modern web development practices.",
      achievements: [
        "Made continuous open source contributions to the largest LMS (Learning Management System) in the world",
        "Developed various plugins including a media transcoding tool for multiple devices and a PDF conversion tool",
        "Worked on automation tools to carry out scheduled tasks using lambda functions",
      ],
    },
  ];

  return (
    <section id="experience" className="py-24 bg-muted/30">
      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Experience
          </h2>
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
                      <span className="text-accent mt-1.5 flex-shrink-0">
                        •
                      </span>
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
  );
}
