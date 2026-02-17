"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function About() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const skills = [
    {
      category: "Frontend",
      items: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    },
    {
      category: "Backend",
      items: ["Python", "Node.js", "PostgreSQL", "GraphQL"],
    },
    { category: "Tools", items: ["Git", "Docker", "AWS", "Vercel"] },
  ];

  return (
    <section id="about" className="py-24 bg-muted/30">
      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">About Me</h2>
          <div className="w-12 h-1 bg-accent rounded" />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-12 mb-16"
        >
          <div>
            <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
              I&apos;m a software engineer with 8+ years of experience building
              software that solve real problems. I believe in writing clean,
              maintainable code and creating intuitive user experiences.
            </p>
            <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
              My passion lies at the intersection of thoughtful design and
              robust engineering. Whether building a new product from scratch or
              optimizing existing systems, I approach every project with
              attention to detail and a focus on scalability.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              When I&apos;m not coding, you can find me running long distances,
              enjoying the outdoors, learning about new technologies, creating
              machine learning models for fantasy football, or hanging out with
              my wonderful wife and kids.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-8">
              Skills & Technologies
            </h3>
            <div className="space-y-8">
              {skills.map((skillGroup) => (
                <motion.div key={skillGroup.category} variants={itemVariants}>
                  <h4 className="font-semibold text-accent mb-3">
                    {skillGroup.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium hover:bg-accent/20 transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
