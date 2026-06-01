import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { useSkills } from "../sanity/hooks";

export default function SkillsTools() {
  const { data: categories } = useSkills();
  const tools = categories.find((category) => category.category === "Tools")?.skills ?? [];
  const designSkills = categories.filter((category) => category.category !== "Tools").flatMap((category) =>
    (category.skills ?? []).map((skill) => ({ ...skill, category: category.category })),
  );

  return (
    <section id="skills" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex flex-col gap-12">
            <div><span className="h-section">05 / Skills</span><h2 className="text-5xl font-serif">Power <span className="text-brand-accent italic">Ups</span></h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {designSkills.map((skill, index) => (
                <div key={`${skill.category}-${skill.name}`} className={cn("town-card flex flex-col gap-4 border border-black dark:border-brand-text/10", index % 2 === 0 ? "bg-brand-accent/5 dark:bg-brand-accent/10" : "bg-black/5 dark:bg-brand-muted/5")}>
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-xl tracking-tight">{skill.name}</span>
                    <span className="font-mono text-[10px] font-bold text-brand-accent">{skill.level ?? 90}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/50 dark:bg-black/20 border border-black/20 dark:border-brand-text/20 rounded-sm overflow-hidden relative">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level ?? 90}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "circOut" }} className={cn("absolute top-0 left-0 h-full", index % 2 === 0 ? "bg-brand-accent" : "bg-brand-text")} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-12">
            <div><span className="h-section">06 / Hardware</span><h2 className="text-5xl font-serif">The <span className="text-brand-accent italic">Stack</span></h2></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tools.map((tool, index) => (
                <motion.div key={tool.name} whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 3 : -3 }} className="town-card p-6 flex flex-col items-center gap-4 group bg-white dark:bg-brand-muted/5 border border-brand-text/10 rounded-2xl transition-all">
                  <div className={cn("w-12 h-12 rounded-xl border border-brand-text/20 flex items-center justify-center font-black text-lg transition-all shadow-[4px_4px_0px_0px_var(--brand-accent)] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px]", index % 2 === 0 ? "bg-brand-accent text-brand-bg" : "bg-brand-text text-brand-bg")}>{tool.icon || tool.name.slice(0, 2)}</div>
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100 transition-opacity text-center">{tool.name}</span>
                </motion.div>
              ))}
            </div>
            <div className="town-card bg-brand-accent text-brand-bg mt-auto border-none relative overflow-hidden group">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] font-black leading-relaxed relative z-10 opacity-100">ALL_TOOLS_UPDATED_TO_INDUSTRY_STANDARDS.<br />PROFICIENT_IN_CLOUD_ECOSYSTEMS.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
