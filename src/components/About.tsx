import { motion } from "motion/react";
import { Languages } from "lucide-react";

const SKILLS = [
  "Branding", "Catalog Design", "Typography", "Social Media Design", 
  "Campaign Design", "Figma", "Adobe Photoshop", "Adobe Illustrator", 
  "Adobe InDesign", "Premiere Pro", "After Effects"
];

const LANGUAGES = [
  { name: "English", level: "Professional" },
  { name: "Telugu", level: "Native" },
  { name: "Hindi", level: "Working" }
];

export default function About() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Badge Side */}
          <div className="lg:col-span-3">
            <div className="town-card bg-brand-accent text-brand-bg flex flex-col gap-6 rotate-[-2deg] border-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
              <div className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center border border-brand-accent/20 font-bold text-xl">
                👋
              </div>
              <div>
                <h3 className="font-serif text-3xl tracking-tighter mb-1">The Host</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Bodem Divya Kiran</p>
              </div>
              <div className="pt-4 border-t border-brand-bg/20 flex flex-col gap-2">
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span>Role</span>
                    <span className="px-2 py-0.5 bg-brand-bg/20 rounded">Sr. Designer</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span>Exp</span>
                    <span>05_Years</span>
                 </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4">
               {[
                 { label: "Creative Direction", color: "bg-brand-accent" },
                 { label: "UI Design", color: "bg-brand-text" },
                 { label: "Logo Design", color: "bg-brand-accent/50" }
               ].map((tag) => (
                 <div key={tag.label} className="flex items-center gap-3 group cursor-crosshair">
                    <div className={`w-3 h-3 rounded-full ${tag.color} border border-brand-text/10 group-hover:scale-125 transition-transform`} />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider opacity-70 group-hover:opacity-100 transition-opacity">{tag.label}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Main Info */}
          <div className="lg:col-span-6 flex flex-col gap-10">
            <h2 className="text-4xl md:text-6xl font-serif">
               Welcome to my <br />
               <span className="text-brand-accent">Visual Neighborhood</span>.
            </h2>

            <div className="space-y-6 text-lg font-medium leading-relaxed max-w-lg">
              <p>
                Imagine a place where <span className="px-2 py-0.5 bg-brand-accent/10 text-brand-accent rounded border-b border-brand-accent">design meets clarity</span>. That's what I strive for in every project.
              </p>
              <p>
                Currently navigating the creative landscape at Nexii IT Labs, I specialize in building robust brand identities and intuitive UI/UX systems.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="town-card bg-white dark:bg-brand-muted/5 hover:bg-brand-accent/5 transition-colors">
                  <span className="h-section !mb-2 opacity-50">Services</span>
                  <p className="text-sm font-bold leading-relaxed uppercase tracking-widest text-brand-text/80">
                    Branding, Website Design, App UI, Catalog, Motion.
                  </p>
               </div>
               <div className="town-card bg-white dark:bg-brand-muted/5 hover:bg-brand-accent/5 transition-colors">
                  <span className="h-section !mb-2 opacity-50">Location</span>
                  <p className="text-sm font-bold leading-relaxed uppercase tracking-widest text-brand-text/80">
                    Visakhapatnam, Global Reach. Available Remote.
                  </p>
               </div>
            </div>
          </div>

          {/* Portrait */}
          <div className="lg:col-span-3">
             <motion.div 
               whileHover={{ rotate: 3, scale: 1.05 }}
               className="relative"
             >
                <div className="aspect-[3/4] rounded-[32px] overflow-hidden border border-brand-text/20 shadow-[12px_12px_0px_0px_var(--brand-accent)] bg-neutral-100 dark:bg-neutral-900">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop" 
                    alt="Bodem Divya Kiran"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
             </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
