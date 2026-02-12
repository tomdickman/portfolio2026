'use client'

import { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { ChevronDownIcon } from '@radix-ui/react-icons'

export default function Hero() {
  const [scrollY, setScrollY] = useState(0)
  const [typedName, setTypedName] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Typewriter effect for the name, restarting every 10 seconds
  useEffect(() => {
    const fullName = 'Tom Dickman'
    let timeoutId: number | null = null
    let intervalId: number | null = null

    const startTyping = () => {
      // Clear any in-progress typing cycle
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }

      let currentIndex = 0
      setTypedName('')

      const typeNext = () => {
        // Advance to the next character
        currentIndex += 1
        setTypedName(fullName.slice(0, currentIndex))

        // If there are still characters left, schedule the next one
        if (currentIndex < fullName.length) {
          const baseDelay = 200 // base delay in ms between keystrokes
          const jitter = Math.random() * 50 // add up to 50ms of randomness
          timeoutId = window.setTimeout(typeNext, baseDelay + jitter)
        }
      }

      // Initial delay before typing starts for a more natural feel
      timeoutId = window.setTimeout(typeNext, 400)
    }

    // Start immediately on mount
    startTyping()
    // Restart the typing animation every 10 seconds
    intervalId = window.setInterval(startTyping, 10000)

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
      if (intervalId !== null) {
        window.clearInterval(intervalId)
      }
    }
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
    <section id="top" className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
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
            Hello, My name is...
          </p>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl font-bold text-foreground mb-6 text-balance"
        >
          <span>{typedName}</span>
          <span className="inline-block w-1 h-[1em] mb-[-5px] bg-foreground ml-1 animate-pulse" />
        </motion.h1>

        <motion.h2 variants={itemVariants} className="text-1xl sm:text-4xl font-bold m-2 text-foreground">
          Senior Software Engineer
        </motion.h2>

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
        <ChevronDownIcon className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  )
}
