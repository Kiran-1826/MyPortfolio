import { Mail, Phone, Instagram, Linkedin, ArrowUpRight, Send } from "lucide-react";
import { cn } from "../lib/utils";

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Side */}
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <span className="h-section">07 / Transmission</span>
              <h2 className="text-5xl md:text-8xl font-serif leading-[0.85] uppercase tracking-tighter">
                Drop a <br />
                <span className="text-brand-accent">Line</span> in the <br />
                <span className="italic lowercase font-light opacity-60">Inbox.</span>
              </h2>
            </div>
 
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <a href="mailto:bodemkiran098@gmail.com" className="town-card bg-brand-accent text-brand-bg group hover:opacity-90 border-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                  <div className="flex flex-col gap-4">
                     <div className="w-10 h-10 bg-brand-bg text-brand-accent border border-brand-accent/20 rounded-full flex items-center justify-center">
                        <Mail size={18} />
                     </div>
                     <div>
                       <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Mailbox</span>
                       <p className="text-sm font-black truncate">bodemkiran098@gmail.com</p>
                     </div>
                  </div>
               </a>

               <a href="tel:+917032698038" className="town-card bg-brand-text text-brand-bg group hover:opacity-90 border-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                  <div className="flex flex-col gap-4">
                     <div className="w-10 h-10 bg-brand-bg text-brand-text border border-brand-text/10 rounded-full flex items-center justify-center">
                        <Phone size={18} />
                     </div>
                     <div>
                       <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Hotline</span>
                       <p className="text-sm font-black">+91 7032698038</p>
                     </div>
                  </div>
               </a>
            </div>

            <div className="flex flex-wrap gap-3">
               {[
                 { name: "LinkedIn", url: "https://linkedin.com/in/bodem-divya-kiran" },
                 { name: "Instagram", url: "https://instagram.com" },
                 { name: "Behance", url: "https://behance.net" }
               ].map((social, i) => (
                 <a 
                   key={social.name} 
                   href={social.url} 
                   target="_blank"
                   rel="noreferrer"
                   className={cn(
                     "px-6 py-2 border border-brand-text/10 text-brand-bg rounded-full font-black text-[9px] uppercase tracking-[0.2em] transition-all hover:scale-110",
                     i % 2 === 0 ? "bg-brand-accent" : "bg-brand-text"
                   )}
                 >
                   {social.name}
                 </a>
               ))}
            </div>
          </div>
 
          {/* Form Side */}
          <div className="town-card bg-white dark:bg-brand-muted/5 border border-brand-text/10 relative flex flex-col p-8 md:p-12">
            
            <form className="flex flex-col gap-10 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="flex flex-col gap-2">
                   <label className="font-mono text-[9px] uppercase font-black tracking-[0.3em] opacity-80">Resident Name</label>
                   <input 
                     type="text" 
                     placeholder="ENTER FULL NAME"
                     className="bg-transparent border-b border-brand-text/10 py-3 focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text/40 font-bold text-sm uppercase tracking-wide"
                   />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="font-mono text-[9px] uppercase font-black tracking-[0.3em] opacity-80">Signal Address</label>
                   <input 
                     type="email" 
                     placeholder="YOUR EMAIL"
                     className="bg-transparent border-b border-brand-text/10 py-3 focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text/40 font-bold text-sm uppercase tracking-wide"
                   />
                 </div>
              </div>
 
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] uppercase font-black tracking-[0.3em] opacity-80">The Message</label>
                <textarea 
                  rows={4}
                  placeholder="WHATS ON YOUR MIND?"
                  className="bg-transparent border-b border-brand-text/10 py-4 focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text/40 resize-none font-bold text-sm uppercase tracking-wide"
                />
              </div>
 
              <button className="retro-btn bg-brand-accent text-brand-bg flex items-center justify-center gap-3 w-full group">
                <span className="font-black text-[11px] uppercase tracking-[0.2em] group-hover:tracking-[0.4em] transition-all">Send Transmission</span>
                <Send size={16} />
              </button>
            </form>

            <div className="mt-12 flex justify-between font-mono text-[9px] opacity-20 uppercase font-black tracking-widest border-t border-brand-text/10 pt-8">
               <span>Encrypted Link 💠</span>
               <span>VISAKHAPATNAM_AP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
