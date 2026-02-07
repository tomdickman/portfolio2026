'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { createSmoothScrollHandler } from '@/lib/scroll-utils'

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="text-xl font-bold text-primary">Tom Dickman</div>
        
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex gap-6 text-sm font-medium text-foreground/80 hover:text-foreground transition">
            <li>
              <a href="#about" onClick={createSmoothScrollHandler()} className="hover:text-accent transition">
                About
              </a>
            </li>
            <li>
              <a href="#projects" onClick={createSmoothScrollHandler()} className="hover:text-accent transition">
                Projects
              </a>
            </li>
            <li>
              <a href="#experience" onClick={createSmoothScrollHandler()} className="hover:text-accent transition">
                Experience
              </a>
            </li>
            <li>
              <a href="#contact" onClick={createSmoothScrollHandler()} className="hover:text-accent transition">
                Contact
              </a>
            </li>
          </ul>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-foreground hover:bg-muted"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>
    </header>
  )
}
