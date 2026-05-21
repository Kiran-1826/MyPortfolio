import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import {
  ExternalLink,
  Filter,
  FolderUp,
  X,
  Maximize2,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "../lib/utils";

const CATEGORIES = [
  "All",
  "Branding",
  "Social Media",
  "UI/UX",
  "Catalog & Print",
  "Motion",
];

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: "Wellness Branding",
    category: "Branding",
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?q=80&w=1000",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Q3 Campaign Socials",
    category: "Social Media",
    image:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    title: "EcoApp UI Design",
    category: "UI/UX",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    id: 4,
    title: "Pharma Catalog 2024",
    category: "Catalog & Print",
    image:
      "https://images.unsplash.com/photo-1544640805-35c0fa948935?q=80&w=1000",
    span: "md:col-span-2 md:row-span-1",
  },
  {
    id: 5,
    title: "Animated Logo Intro",
    category: "Motion",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 6,
    title: "Modern Brand Identity",
    category: "Branding",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000",
    span: "md:col-span-1 md:row-span-1",
  },
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("All");
  const [imageUrls, setImageUrls] = useState("");
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const convertGoogleDriveUrl = (url: string): string => {
    url = url.trim();
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return url;
  };

  const addImageUrls = () => {
    if (!imageUrls.trim()) return;
    setError(null);

    try {
      const urls = imageUrls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
        .map(convertGoogleDriveUrl);

      if (urls.length === 0) {
        setError("Please paste at least one image URL");
        return;
      }

      const newProjects = urls.map((url: string, idx: number) => ({
        id: `gallery-${idx}`,
        title: `Image ${idx + 1}`,
        category: "Gallery",
        image: url,
        span:
          idx % 4 === 0
            ? "md:col-span-2 md:row-span-2"
            : "md:col-span-1 md:row-span-1",
      }));

      setProjects(newProjects);
      setImageUrls("");
      setActiveTab("All");
    } catch (err: any) {
      setError("Invalid URL format");
    }
  };

  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter(
          (p) => p.category.includes(activeTab) || activeTab === "All",
        );

  return (
    <section id="portfolio" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="flex flex-col">
            <span className="h-section">04 / Selected Works</span>
            <h2 className="text-5xl md:text-7xl font-serif">
              Curated Portfolio
            </h2>
          </div>

          {/* Direct Image URLs Input */}
          <div className="w-full md:w-auto flex flex-col gap-4">
            <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">
              Add Images (One URL per line)
            </p>
            <div className="flex flex-col gap-2 p-3 bg-white/[0.03] border border-brand-border rounded-[2px]">
              <textarea
                placeholder="Paste Google Drive image URLs here (one per line)"
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                className="bg-transparent border-none outline-none px-3 py-2 text-[11px] w-full md:w-64 placeholder:text-white/20 uppercase tracking-widest resize-none h-20"
              />
              <button
                onClick={addImageUrls}
                className="bg-brand-text text-brand-bg px-6 py-2 rounded-[2px] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all hover:opacity-90"
              >
                Add Images
              </button>
            </div>
            {error && (
              <p className="text-brand-accent text-[10px] mt-1 uppercase tracking-wider">
                {error}
              </p>
            )}
            <p className="text-[9px] text-brand-text/40 uppercase tracking-wider">
              💡 Paste Google Drive share links (right-click image → Share → Copy link). They'll auto-convert to direct URLs!
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-nowrap md:flex-wrap gap-8 md:gap-10 mb-12 border-b border-brand-text/10 pb-8 overflow-x-auto no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "text-[10px] uppercase font-black tracking-[0.25em] transition-all duration-300 relative pb-2 whitespace-nowrap",
                activeTab === cat
                  ? "text-brand-accent after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-accent"
                  : "text-brand-text/30 hover:text-brand-text",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedImage(project.image)}
                className="group relative cursor-pointer"
              >
                <div
                  className={cn(
                    "town-card p-0 overflow-hidden relative border border-brand-text/10",
                    i % 2 === 0
                      ? "bg-brand-accent/5 dark:bg-brand-accent/10"
                      : "bg-brand-text/5",
                  )}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      onError={(e) => {
                        console.error("Image failed to load:", project.image);
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                      }}
                      className="w-full h-full object-cover grayscale-0 group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Footer Info */}
                  <div className="p-6 flex flex-col gap-3 border-t border-brand-text/10 bg-brand-bg/50 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span
                        className={cn(
                          "font-mono text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 border border-brand-text/10 rounded-sm text-brand-bg",
                          i % 2 === 0 ? "bg-brand-accent" : "bg-brand-text",
                        )}
                      >
                        {project.category}
                      </span>
                      <div className="w-8 h-8 rounded-full border border-brand-text/10 flex items-center justify-center group-hover:bg-brand-accent group-hover:text-brand-bg transition-all">
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif tracking-tighter">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-10 right-10 text-white hover:text-brand-accent transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              className="max-w-full max-h-full object-contain shadow-2xl border border-white/10 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
