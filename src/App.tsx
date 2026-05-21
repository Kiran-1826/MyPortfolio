/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import ImageKitGallery from "./components/ImageKitGallery";
import SkillsTools from "./components/SkillsTools";
import Contact from "./components/Contact";
import { motion, useScroll, useSpring } from "motion/react";
import { useState, useEffect } from "react";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className={`relative selection:bg-brand-accent/30 ${theme}`}>
      <LoadingScreen />
      <CustomCursor />
      <div className="noise-overlay" />

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-accent origin-left z-[60]"
        style={{ scaleX }}
      />

      <Navbar onThemeToggle={toggleTheme} theme={theme} />

      <main>
        <Hero />
        <About />
        <Experience />
        <ImageKitGallery />
        <SkillsTools />
        <Contact />
      </main>

      <footer className="py-20 px-6 border-t border-brand-text/5 text-center bg-brand-bg relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-3xl font-serif text-brand-accent tracking-tighter">
              DK.
            </span>
            <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-70">
              © 2026 Bodem Divya Kiran. Crafting Visual Stories.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <a
              href="#"
              className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-70 hover:opacity-100 hover:text-brand-accent transition-all"
            >
              Privacy_Policy
            </a>
            <a
              href="#"
              className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-70 hover:opacity-100 hover:text-brand-accent transition-all"
            >
              Terms_Of_Service
            </a>
            <a
              href="#"
              className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-70 hover:opacity-100 hover:text-brand-accent transition-all"
            >
              Colophon
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
