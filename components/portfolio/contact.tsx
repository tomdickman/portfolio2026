"use client";

import { SubmitEvent, useRef, useState } from "react";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSmoothScrollHandler } from "@/lib/scroll-utils";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: Actually submit this.
    setTimeout(() => setSubmitted(false), 3000);
  };

  const socialLinks = [
    {
      icon: GitHubLogoIcon,
      href: "https://www.github.com/tomdickman",
      label: "GitHub",
    },
    {
      icon: LinkedInLogoIcon,
      href: "https://www.linkedin.com/in/twdickman",
      label: "LinkedIn",
    },
    {
      icon: EnvelopeClosedIcon,
      href: "mailto:tom@tomdickman.com.au",
      label: "Email",
    },
  ];

  return (
    <section id="contact" className="py-24">
      <motion.div
        ref={ref}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Get In Touch
          </h2>
          <div className="w-12 h-1 bg-accent rounded mx-auto mb-6" />
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Have a project in mind or just want to chat? Feel free to reach out.
            I&apos;m always interested in hearing about interesting
            opportunities and ideas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Your message here..."
                  rows={5}
                  className="w-full"
                  required
                />
              </div>

              {submitted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-accent font-medium"
                >
                  Thanks for reaching out! I&apos;ll get back to you soon.
                </motion.p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Let&apos;s Connect
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">EMAIL</p>
                  <a
                    href="mailto:tom@tomdickman.com.au"
                    className="text-lg font-medium text-foreground hover:text-accent transition"
                  >
                    tom@tomdickman.com.au
                  </a>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">LOCATION</p>
                  <p className="text-lg font-medium text-foreground">
                    Melbourne, Australia
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-4">FOLLOW</p>
                  <div className="flex gap-4">
                    {socialLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition"
                          aria-label={link.label}
                          target="_blank"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="pt-8 border-t border-border mt-8">
              <p className="text-sm text-muted-foreground mb-4">QUICK LINKS</p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#about"
                    onClick={createSmoothScrollHandler()}
                    className="text-foreground hover:text-accent transition"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    onClick={createSmoothScrollHandler()}
                    className="text-foreground hover:text-accent transition"
                  >
                    Projects
                  </a>
                </li>
                <li>
                  <a
                    href="#experience"
                    onClick={createSmoothScrollHandler()}
                    className="text-foreground hover:text-accent transition"
                  >
                    Experience
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="text-center pt-12 border-t border-border"
        >
          <p className="text-muted-foreground text-sm">
            © 2026 Tom Dickman. Built with React, TypeScript, and Tailwind CSS.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
