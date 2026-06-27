import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  Loader2,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "../lib/utils";
import { usePortfolio } from "../sanity/hooks";
import { optimizedImageUrl } from "../sanity/imageBuilder";
import type { PortfolioDocument } from "../sanity/types";

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

/**
 * WebsiteImageZoom
 * Renders a tall webpage screenshot inside a scrollable panel with proper zoom.
 *
 * Strategy:
 *  - Measure the panel's width via a ResizeObserver.
 *  - Set the wrapper div's width to (panelWidth * zoom) px — this is a real
 *    layout dimension so the scroll container sees the correct scrollable area.
 *  - The <img> fills 100% of that wrapper and keeps its natural aspect ratio.
 *  - At zoom=1 the image fills the panel exactly; at zoom=2 it doubles, etc.
 */
function WebsiteImageZoom({
  src,
  alt,
  zoom,
}: {
  src: string;
  alt: string;
  zoom: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(0);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    // Measure the scrollable panel (the parent of this component)
    const parent = el.closest(".website-scroll-panel") as HTMLElement | null;
    const target = parent ?? el;
    const ro = new ResizeObserver(([entry]) => {
      setPanelWidth(entry.contentRect.width);
    });
    ro.observe(target);
    setPanelWidth(target.clientWidth);
    return () => ro.disconnect();
  }, []);

  const pxWidth = panelWidth > 0 ? panelWidth * zoom : undefined;

  return (
    <div ref={panelRef} style={{ width: pxWidth, minWidth: "100%" }}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="block w-full h-auto select-none"
        style={{ display: "block", verticalAlign: "top" }}
      />
    </div>
  );
}

export default function ImageKitGallery() {
  const { data: images, isLoading, error, refresh } = usePortfolio();
  const [selectedImage, setSelectedImage] = useState<PortfolioDocument | null>(
    null,
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [modalZoom, setModalZoom] = useState(1);
  const isWebsiteDesign = selectedImage?.category === "Website Design";

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      setModalZoom(1);
    }
  }, [selectedImage]);

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((image) => image.category === activeCategory);

  const zoomIn = () => setModalZoom((z) => Math.min(z + 0.25, 5));
  const zoomOut = () => setModalZoom((z) => Math.max(z - 0.25, 1));
  const resetZoom = () => setModalZoom(1);

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

        {/* Category filter */}
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

        {/* Grid */}
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
                    {image.description && (
                      <p className="text-brand-text/50 text-xs leading-relaxed line-clamp-2">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] bg-black/95 p-3 md:p-6 flex flex-col"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full flex flex-col"
            >
              {/* Top bar: zoom controls + close */}
              <div className="shrink-0 flex items-center justify-between gap-3 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={zoomOut}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-full size-11 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={modalZoom <= 1}
                    aria-label="Zoom out"
                    title="Zoom out"
                  >
                    <ZoomOut size={20} />
                  </button>

                  <span className="min-w-14 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-center font-mono text-[10px] font-black text-white">
                    {Math.round(modalZoom * 100)}%
                  </span>

                  <button
                    onClick={zoomIn}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-full size-11 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={modalZoom >= 5}
                    aria-label="Zoom in"
                    title="Zoom in"
                  >
                    <ZoomIn size={20} />
                  </button>

                  <button
                    onClick={resetZoom}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-full size-11 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={modalZoom === 1}
                    aria-label="Reset zoom"
                    title="Reset zoom"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>

                <button
                  className="text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-full size-11 flex items-center justify-center transition-colors"
                  onClick={() => setSelectedImage(null)}
                  aria-label="Close image modal"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Main content: image left, description right */}
              <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
                {/* Image panel — 60% width */}
                <div
                  className={cn(
                    "website-scroll-panel rounded-lg border border-white/10 bg-black/30 flex-1 md:w-[60%] md:flex-none overflow-auto overscroll-contain",
                    !isWebsiteDesign && "flex items-center justify-center",
                  )}
                >
                  {isWebsiteDesign ? (
                    /*
                     * Website design: use a sized wrapper so the scroll container
                     * knows the true dimensions at every zoom level.
                     * The img is 100% of the wrapper; the wrapper width is
                     * zoom * 100% of the panel — giving real layout-based zoom.
                     * overflow-auto on the outer panel handles both axes.
                     */
                    <WebsiteImageZoom
                      src={optimizedImageUrl(selectedImage.image, 2400, 9999)}
                      alt={selectedImage.title}
                      zoom={modalZoom}
                    />
                  ) : (
                    /* All other images: centered, contained, transform-scale zoom */
                    <img
                      src={optimizedImageUrl(selectedImage.image, 2400, 2400)}
                      alt={selectedImage.title}
                      draggable={false}
                      className="block object-contain select-none transition-transform duration-200"
                      style={{
                        transform: `scale(${modalZoom})`,
                        transformOrigin: "center center",
                        maxWidth: "100%",
                        maxHeight: "calc(100vh - 180px)",
                        width: "auto",
                        height: "auto",
                      }}
                    />
                  )}
                </div>

                {/* Description panel — only rendered when description exists */}
                {selectedImage.description && (
                  <div className="shrink-0 md:w-[40%] rounded-lg border border-white/10 bg-white/5 p-6 flex flex-col gap-5 overflow-y-auto">
                    {/* Category badge */}
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm bg-brand-accent text-brand-bg w-fit">
                      {selectedImage.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-white text-2xl font-serif leading-tight tracking-tight">
                      {selectedImage.title}
                    </h3>

                    {/* Divider */}
                    <div className="h-px bg-white/10 w-full" />

                    {/* Description */}
                    <p className="text-white/60 text-sm leading-relaxed">
                      {selectedImage.description}
                    </p>
                  </div>
                )}

                {/* If no description, show title/category below on all screens */}
                {!selectedImage.description && (
                  <div className="shrink-0 md:hidden text-center px-6 pt-2">
                    <p className="text-white/60 text-xs uppercase tracking-widest">
                      {selectedImage.category}
                    </p>
                    <h3 className="text-white text-2xl font-serif">
                      {selectedImage.title}
                    </h3>
                  </div>
                )}
              </div>

              {/* Bottom title bar — only shown on desktop when no description panel */}
              {!selectedImage.description && (
                <div className="hidden md:block shrink-0 text-center px-6 pt-4">
                  <p className="text-white/60 text-xs uppercase tracking-widest">
                    {selectedImage.category}
                  </p>
                  <h3 className="text-white text-2xl font-serif">
                    {selectedImage.title}
                  </h3>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
