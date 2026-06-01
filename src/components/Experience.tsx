import { motion } from "motion/react";
import { Building } from "lucide-react";
import { cn } from "../lib/utils";
import { useExperience } from "../sanity/hooks";

export default function Experience() {
  const { data: experiences } = useExperience();

  return (
    <section id="experience" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-8 text-center mb-24">
          <span className="h-section">04 / The Journey</span>
          <h2 className="text-5xl md:text-8xl font-serif">Route <span className="text-brand-accent italic">Roadmap</span></h2>
        </div>
        <div className="relative pl-12 md:pl-0">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-brand-accent/20 -translate-x-1/2" />
          <div className="flex flex-col gap-24 relative">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn("relative flex flex-col md:flex-row items-center", index % 2 === 1 ? "md:flex-row-reverse" : "")}
              >
                <div className="absolute left-6 md:left-1/2 w-10 h-10 -translate-x-1/2 z-10 flex items-center justify-center">
                  <div className={cn("w-full h-full border border-black dark:border-brand-text/20 rounded-lg shadow-[4px_4px_0px_0px_var(--brand-accent)]", index % 2 === 0 ? "bg-brand-accent" : "bg-brand-text")} />
                </div>
                <div className="w-full md:w-1/2 px-4 md:px-12">
                  <div className={cn("town-card transition-transform hover:scale-[1.02] bg-white dark:bg-brand-muted/5", index % 2 === 1 ? "md:ml-12" : "md:mr-12")}>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <span className={cn("px-2 py-0.5 rounded-[4px] text-[9px] font-black w-fit uppercase tracking-[0.2em] shadow-sm", index % 2 === 0 ? "bg-brand-accent text-brand-bg" : "bg-brand-text text-brand-bg")}>
                          {experience.startYear} - {experience.endYear}
                        </span>
                        <h3 className="text-3xl font-serif tracking-tight mt-1">{experience.position}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-brand-accent font-bold">
                        <Building size={14} />
                        <span className="font-mono text-[10px] uppercase tracking-widest">{experience.company}</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed opacity-60 whitespace-pre-line">{experience.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
