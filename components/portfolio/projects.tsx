"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export default function Projects() {
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

  const projects = [
    {
      title: "Modernisation",
      description:
        "Modernisation of the web order pad used for all domestic ordering on Commsec and additional of international trading to this platform. A high volume of trading goes through this application with the largest market share in Australia for domestic equities trading, so there was a high level of focus on accuracy and reliability",
      tech: ["React", "TypeScript", "Node.js", "C#", "MUI", "Playwright"],
      link: "https://www2.commsec.com.au/secure/order-pad",
    },
    {
      title: "Event driven architechture",
      description:
        "Implementation of microservice APIs for me&u to handle large volume of ordering across local and international venues, while supporting legacy platform APIs. Handle refunds using Kafka topics to ensure reliability and prevent duplication of refund requests and processing. Update of existing APIs to handle multi-venue clients where orders could be made from multiple venues at once and reconciled in one bill.",
      tech: [
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Docker",
        "K8s",
        "Stripe",
        "AWS",
        "Kafka",
      ],
      link: "https://www.meandu.com.au",
    },
    {
      title: "Design System",
      description:
        "Creation of a bespoke design system for Target Australia with a focus on speed and performance, no off the shelf bulky packages. Implementation of Figma token based syncing with design changes to speed up development and iteration process.",
      tech: ["React", "TypeScript", "CSS", "Storybook", "Figma"],
      link: "https://www.target.com.au",
    },
    {
      title: "Web Performance and Page Speed",
      description:
        "Uplift of the Target Australia product pages to new modern stack with a focus on page speed, performance and resultant improvement in click-through rates. Implementation of a monorepo with Nx, addition of page speed and performance metrics, feature flagging and new analytics tools to allow AB testing and measure effect of changes.",
      tech: ["Next.js", "React", "TypeScript", "Node.js", "K8s", "Nx"],
      link: "https://www.target.com.au",
    },
  ];

  return (
    <section id="projects" className="py-24">
      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Projects</h2>
          <div className="w-12 h-1 bg-accent rounded" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, _index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="group bg-card border border-border rounded-lg p-6 hover:border-accent/50 hover:shadow-lg transition duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition">
                  {project.title}
                </h3>
                <ArrowRightIcon className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-1" />
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
                target="_blank"
                className="inline-flex items-center gap-2 mt-6 text-accent font-medium hover:gap-3 transition"
              >
                Learn More
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
