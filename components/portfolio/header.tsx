"use client";

import { useEffect, useState } from "react";
import {
  Cross2Icon,
  HamburgerMenuIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { createSmoothScrollHandler } from "@/lib/scroll-utils";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const smoothScroll = createSmoothScrollHandler();

  // While not ideal, we need to wait for render cycle before setting
  // mounted to avoid hydration issues with the theme.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a
            href="#top"
            onClick={smoothScroll}
            className="text-xl font-bold text-primary hover:text-accent transition cursor-pointer"
          >
            Tom Dickman
          </a>

          <div className="flex items-center gap-4">
            <ul className="hidden md:flex gap-6 text-sm font-medium text-foreground/80 hover:text-foreground transition">
              <li>
                <a
                  href="#about"
                  onClick={smoothScroll}
                  className="hover:text-accent transition"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  onClick={smoothScroll}
                  className="hover:text-accent transition"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  onClick={smoothScroll}
                  className="hover:text-accent transition"
                >
                  Experience
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={smoothScroll}
                  className="hover:text-accent transition"
                >
                  Contact
                </a>
              </li>
            </ul>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-foreground hover:bg-muted"
              >
                {theme === "dark" ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </Button>

              {/* Mobile menu trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-foreground hover:bg-muted"
                onClick={() => setIsMenuOpen(true)}
              >
                <HamburgerMenuIcon className="h-5 w-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile slideout menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-200 ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Slideout panel */}
        <div
          className={`absolute inset-y-0 right-0 w-64 max-w-[75%] bg-background border-l border-border shadow-lg transform transition-transform duration-200 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 h-16 border-b border-border">
            <span className="text-sm font-semibold text-foreground/80">
              Navigation
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <Cross2Icon className="h-5 w-5" />
              <span className="sr-only">Close navigation menu</span>
            </Button>
          </div>

          <ul className="flex flex-col gap-4 px-4 py-6 text-base font-medium text-foreground/90">
            <li>
              <a
                href="#about"
                onClick={(event) => {
                  setIsMenuOpen(false);
                  smoothScroll(event);
                }}
                className="block py-1 hover:text-accent transition"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#projects"
                onClick={(event) => {
                  setIsMenuOpen(false);
                  smoothScroll(event);
                }}
                className="block py-1 hover:text-accent transition"
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#experience"
                onClick={(event) => {
                  setIsMenuOpen(false);
                  smoothScroll(event);
                }}
                className="block py-1 hover:text-accent transition"
              >
                Experience
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(event) => {
                  setIsMenuOpen(false);
                  smoothScroll(event);
                }}
                className="block py-1 hover:text-accent transition"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
