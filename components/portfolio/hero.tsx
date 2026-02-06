'use client'

import { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Parallax background elements */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted opacity-40"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />

      {/* Topographic-style circles */}
      <div
        className="absolute top-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div
        className="absolute -bottom-40 left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6"
        >
          <p className="text-accent font-semibold text-sm tracking-widest uppercase">
            Welcome to my portfolio
          </p>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl font-bold text-foreground mb-6 text-balance"
        >
          Senior Software Engineer
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-8 text-balance"
        >
          Specializing in TypeScript, React, and Python. Building scalable,
          elegant solutions for complex problems.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex gap-4 justify-center flex-wrap"
        >
          <a
            href="#projects"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition"
          >
            Get In Touch
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  )
}
