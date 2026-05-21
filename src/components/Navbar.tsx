import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/src/lib/utils";

const NAV_LINKS = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Selected Works", href: "#portfolio" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

interface NavbarProps {
  onThemeToggle: () => void;
  theme: "dark" | "light";
}

export default function Navbar({ onThemeToggle, theme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 py-8",
        scrolled ? "bg-brand-bg/95 backdrop-blur-sm py-4 border-b border-brand-border" : "bg-transparent border-b border-brand-border/0"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-16">
          <motion.a
            href="#"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-serif tracking-tighter bg-brand-accent text-brand-bg px-3 py-1 rounded-lg border border-black dark:border-brand-text/20 hover:bg-brand-text hover:text-brand-bg transition-colors"
          >
            DK.
          </motion.a>
 
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, idx) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-[10px] font-black font-mono uppercase tracking-[0.2em] hover:text-brand-accent transition-colors"
              >
                {link.name}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 border border-black dark:border-brand-text/20 rounded-full text-[9px] font-mono text-brand-text font-bold uppercase tracking-widest bg-brand-accent/10">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            Active_In_Visual_Town
          </div>

          <button
            onClick={onThemeToggle}
            className="w-10 h-10 border border-black dark:border-brand-text/20 rounded-lg flex items-center justify-center hover:bg-brand-accent hover:text-brand-bg transition-all text-brand-text"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Mobile Toggle */}
          <button
            className="md:hidden w-10 h-10 border border-brand-border flex items-center justify-center text-brand-text"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-brand-bg border-b border-white/5"
      >
        <div className="px-6 py-10 flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-serif hover:text-brand-accent"
            >
              {link.name}
            </a>
          ))}
        </div>
      </motion.div>
    </nav>
  );
}
