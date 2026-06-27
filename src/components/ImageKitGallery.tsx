import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
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
 * Measures the scroll panel's pixel width via ResizeObserver, then sets the
 * wrapper to (panelWidth × zoom) px so the browser knows the true layout size
 * and renders scrollbars correctly on both axes.
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(0);

  useEffect(() => {
    const panel = wrapperRef.current?.closest(
      ".website-scroll-panel",
    ) as HTMLElement | null;
    const target = panel ?? wrapperRef.current;
    if (!target) return;
    const ro = new ResizeObserver(([entry]) => {
      setPanelWidth(entry.contentRect.width);
    });
    ro.observe(target);
    setPanelWidth(target.clientWidth);
    return () => ro.disconnect();
  }, []);

  const pxWidth = panelWidth > 0 ? panelWidth * zoom : undefined;

  return (
    <div ref={wrapperRef} style={{ width: pxWidth, minWidth: "100%" }}>
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
  const [descExpanded, setDescExpanded] = useState(false);

  const isWebsiteDesign = selectedImage?.category === "Website Design";

  // ── Lock body scroll when modal is open ───────────────────────────────────
  useEffect(() => {
    if (selectedImage) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // iOS Safari also needs this on html
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
        document.documentElement.style.overflow = "";
      };
    }
  }, [selectedImage]);

  // ── Keyboard close ────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Reset zoom + description state on image change ────────────────────────
  useEffect(() => {
    if (selectedImage) {
      setModalZoom(1);
      setDescExpanded(false);
    }
  }, [selectedImage]);

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const zoomIn = () => setModalZoom((z) => Math.min(z + 0.25, 5));
  const zoomOut = () => setModalZoom((z) => Math.max(z - 0.25, 0.25));
  const resetZoom = () => setModalZoom(1);

  // ── Loading / error states ────────────────────────────────────────────────
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
        {/* Heading */}
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

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // touch-none prevents iOS from propagating scroll to the body
            className="fixed inset-0 z-[10001] bg-black/95 touch-none"
            style={{ overscrollBehavior: "none" }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              // Full height flex column — nothing overflows the viewport
              className="w-full h-full flex flex-col p-3 md:p-6"
            >
              {/* ── Top bar ─────────────────────────────────────────────── */}
              <div className="shrink-0 flex items-center justify-between gap-3 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={zoomOut}
                    disabled={modalZoom <= 0.25}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-full size-9 md:size-11 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Zoom out"
                    title="Zoom out"
                  >
                    <ZoomOut size={18} />
                  </button>

                  <span className="min-w-12 md:min-w-14 rounded-full border border-white/15 bg-white/10 px-2 md:px-3 py-1.5 md:py-2 text-center font-mono text-[10px] font-black text-white">
                    {Math.round(modalZoom * 100)}%
                  </span>

                  <button
                    onClick={zoomIn}
                    disabled={modalZoom >= 5}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-full size-9 md:size-11 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Zoom in"
                    title="Zoom in"
                  >
                    <ZoomIn size={18} />
                  </button>

                  <button
                    onClick={resetZoom}
                    disabled={modalZoom === 1}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-full size-9 md:size-11 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Reset zoom"
                    title="Reset zoom"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>

                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-full size-9 md:size-11 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* ── Body ────────────────────────────────────────────────── */}

              {/* DESKTOP (md+): side-by-side, image 60 / desc 40 */}
              <div className="hidden md:flex flex-1 gap-4 min-h-0">
                {/* Image panel */}
                <div
                  className={cn(
                    "website-scroll-panel rounded-lg border border-white/10 bg-black/30 w-[60%] shrink-0 overflow-auto overscroll-contain",
                    !isWebsiteDesign && "flex items-center justify-center",
                  )}
                  style={{ overscrollBehavior: "contain" }}
                >
                  {isWebsiteDesign ? (
                    <WebsiteImageZoom
                      src={optimizedImageUrl(selectedImage.image, 2400, 9999)}
                      alt={selectedImage.title}
                      zoom={modalZoom}
                    />
                  ) : (
                    <img
                      src={optimizedImageUrl(selectedImage.image, 2400, 2400)}
                      alt={selectedImage.title}
                      draggable={false}
                      className="block object-contain select-none transition-transform duration-200"
                      style={{
                        transform: `scale(${modalZoom})`,
                        transformOrigin: "center center",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "auto",
                        height: "auto",
                      }}
                    />
                  )}
                </div>

                {/* Description panel */}
                {selectedImage.description ? (
                  <div
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 p-6 flex flex-col gap-5 overflow-y-auto"
                    style={{ overscrollBehavior: "contain" }}
                  >
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm bg-brand-accent text-brand-bg w-fit">
                      {selectedImage.category}
                    </span>
                    <h3 className="text-white text-2xl font-serif leading-tight tracking-tight">
                      {selectedImage.title}
                    </h3>
                    <div className="h-px bg-white/10 w-full" />
                    <p className="text-white/60 text-sm leading-relaxed">
                      {selectedImage.description}
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-2">
                      {selectedImage.category}
                    </p>
                    <h3 className="text-white text-2xl font-serif">
                      {selectedImage.title}
                    </h3>
                  </div>
                )}
              </div>

              {/* MOBILE: image on top (fixed height), description below with read more */}
              <div
                className="flex md:hidden flex-col flex-1 gap-3 min-h-0 overflow-y-auto"
                style={{ overscrollBehavior: "contain" }}
              >
                {/* Image — fixed height so it's always visible */}
                <div
                  className={cn(
                    "website-scroll-panel-mobile rounded-lg border border-white/10 bg-black/30 shrink-0 overflow-auto",
                    isWebsiteDesign
                      ? "h-[52vw]"
                      : "h-[56vw] flex items-center justify-center",
                  )}
                  style={{ overscrollBehavior: "contain" }}
                >
                  {isWebsiteDesign ? (
                    <WebsiteImageZoom
                      src={optimizedImageUrl(selectedImage.image, 1200, 9999)}
                      alt={selectedImage.title}
                      zoom={modalZoom}
                    />
                  ) : (
                    <img
                      src={optimizedImageUrl(selectedImage.image, 1200, 1200)}
                      alt={selectedImage.title}
                      draggable={false}
                      className="block object-contain select-none"
                      style={{
                        transform: `scale(${modalZoom})`,
                        transformOrigin: "center center",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "auto",
                        height: "auto",
                      }}
                    />
                  )}
                </div>

                {/* Info + description */}
                <div className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm bg-brand-accent text-brand-bg w-fit">
                    {selectedImage.category}
                  </span>
                  <h3 className="text-white text-xl font-serif leading-tight tracking-tight">
                    {selectedImage.title}
                  </h3>

                  {selectedImage.description && (
                    <>
                      <div className="h-px bg-white/10 w-full" />
                      <p
                        className={cn(
                          "text-white/60 text-sm leading-relaxed transition-all",
                          !descExpanded && "line-clamp-3",
                        )}
                      >
                        {selectedImage.description}
                      </p>
                      <button
                        onClick={() => setDescExpanded((v) => !v)}
                        className="flex items-center gap-1 text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] w-fit"
                      >
                        {descExpanded ? (
                          <>
                            Show less <ChevronUp size={12} />
                          </>
                        ) : (
                          <>
                            Read more <ChevronDown size={12} />
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
