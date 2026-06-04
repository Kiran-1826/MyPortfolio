import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { cn } from "../lib/utils";
import { usePortfolio } from "../sanity/hooks";
import { optimizedImageUrl } from "../sanity/imageBuilder";
import type { PortfolioDocument } from "../sanity/types";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const categories = [
  "All",
  "UI Design",
  "Website Design",
  "Mobile App Design",
  "Branding",
  "Logos",
  "Social Media",
  "Brochures",
  "Marketing Creatives",
];

export default function ImageKitGallery() {
  const { data: images, isLoading, error, refresh } = usePortfolio();
  const [selectedImage, setSelectedImage] = useState<PortfolioDocument | null>(
    null,
  );
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((image) => image.category === activeCategory);

  if (isLoading) {
    return (
      <section id="portfolio" className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
          <Loader2 size={48} className="animate-spin text-brand-accent mb-4" />
          <p className="text-brand-text/60 text-sm uppercase tracking-widest">
            Loading portfolio...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="portfolio" className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
          <AlertCircle
            size={48}
            className="text-brand-accent mb-4 opacity-60"
          />
          <p className="text-brand-accent text-sm uppercase tracking-widest text-center mb-2">
            {error}
          </p>
          <button
            onClick={refresh}
            className="mt-6 text-[10px] uppercase font-black tracking-[0.25em] text-brand-text/50 hover:text-brand-accent transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 flex flex-col gap-4">
          <span className="h-section">04 / Selected Works</span>
          <h2 className="text-5xl md:text-7xl font-serif">Curated Portfolio</h2>
        </div>
        <div className="flex flex-nowrap md:flex-wrap gap-8 md:gap-10 mb-12 border-b border-brand-text/10 pb-8 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "text-[10px] uppercase font-black tracking-[0.25em] transition-all duration-300 relative pb-2 whitespace-nowrap",
                activeCategory === category
                  ? "text-brand-accent after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-accent"
                  : "text-brand-text/30 hover:text-brand-text",
              )}
            >
              {category}
            </button>
          ))}
        </div>
        {filteredImages.length === 0 && (
          <p className="py-12 text-center text-brand-text/50 text-sm uppercase tracking-widest">
            Portfolio items will appear here after they are published in Sanity.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                layout
                key={image._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedImage(image)}
                className="group relative cursor-pointer"
              >
                <div
                  className={cn(
                    "overflow-hidden relative border border-brand-text/10 rounded-lg",
                    index % 2 === 0 ? "bg-brand-accent/5" : "bg-brand-text/5",
                  )}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={optimizedImageUrl(image.image, 800, 600)}
                      alt={image.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 flex flex-col gap-3 border-t border-brand-text/10">
                    <span
                      className={cn(
                        "font-mono text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm text-brand-bg w-fit",
                        index % 2 === 0 ? "bg-brand-accent" : "bg-brand-text",
                      )}
                    >
                      {image.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-serif tracking-tighter line-clamp-2">
                      {image.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] bg-black/95"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-8 right-8 z-50 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full flex flex-col"
            >
              <div className="flex-1 overflow-hidden">
                <TransformWrapper
                  initialScale={1}
                  minScale={0.5}
                  maxScale={5}
                  wheel={{ step: 0.15 }}
                  doubleClick={{ disabled: false }}
                >
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      <div className="absolute top-8 left-8 z-50 flex gap-2">
                        <button
                          onClick={() => zoomIn()}
                          className="bg-white/10 text-white px-4 py-2 rounded"
                        >
                          +
                        </button>

                        <button
                          onClick={() => zoomOut()}
                          className="bg-white/10 text-white px-4 py-2 rounded"
                        >
                          -
                        </button>

                        <button
                          onClick={() => resetTransform()}
                          className="bg-white/10 text-white px-4 py-2 rounded"
                        >
                          Reset
                        </button>
                      </div>

                      <TransformComponent
                        wrapperClass="!w-full !h-full"
                        contentClass="flex items-center justify-center min-h-full"
                      >
                        <img
                          src={optimizedImageUrl(
                            selectedImage.image,
                            2000,
                            2000,
                          )}
                          alt={selectedImage.title}
                          className="max-w-none"
                        />
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>
              </div>

              <div className="text-center py-6">
                <p className="text-white/60 text-xs uppercase tracking-widest">
                  {selectedImage.category}
                </p>

                <h3 className="text-white text-2xl font-serif">
                  {selectedImage.title}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
