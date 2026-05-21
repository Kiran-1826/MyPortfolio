import { motion } from "motion/react";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 px-6 py-2 bg-brand-accent text-brand-bg rounded-full font-mono text-[9px] font-black uppercase tracking-[0.3em] shadow-[4px_4px_0px_0px_var(--brand-text)] border border-brand-accent/20"
          >
            Welcome to Kiran's Visual Playground 🎨
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[14vw] md:text-[9vw] font-serif uppercase leading-[0.8] tracking-tighter mb-10"
          >
            Graphic <span className="text-brand-accent">Story</span><br />
            <span className="italic font-light lowercase opacity-80 decoration-brand-accent/30 decoration-thickness-thin underline underline-offset-[1vw]">Teller</span> & UX
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-xl flex flex-col items-center gap-12"
          >
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              <span className="px-4 py-1.5 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                Senior Designer
              </span>
              <span className="px-4 py-1.5 bg-brand-text/5 border border-brand-text/20 text-brand-text rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                UI/UX Enthusiast
              </span>
              <span className="px-4 py-1.5 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                5+ Years Experience
              </span>
            </div>

            <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-lg opacity-80">
              I build <span className="italic font-serif text-brand-accent">vibrant visual identities</span> and digital systems that bridge the gap between brands and humanity.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mt-4 w-full sm:w-auto">
              <motion.a 
                href="#portfolio" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="retro-btn bg-brand-accent text-brand-bg text-center"
              >
                View Works
              </motion.a>
              <motion.a 
                href="#contact" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="retro-btn bg-brand-bg text-brand-text text-center border-brand-text/20"
              >
                Say Hello! 👋
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Playful Floating Icons */}
      <div className="absolute top-[20%] right-[10%] hidden lg:block opacity-20">
         <div className="w-16 h-16 border border-brand-accent rounded-lg rotate-12" />
      </div>
      <div className="absolute bottom-[20%] left-[10%] hidden lg:block opacity-20">
         <div className="w-12 h-12 border border-brand-text rounded-lg rotate-[-12deg]" />
      </div>
    </section>
  );
}
