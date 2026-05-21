import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { cn } from "../lib/utils";

// ─── Cloudinary Config ────────────────────────────────────────────────────────
// To fix 401: Cloudinary Dashboard → Settings → Security →
// uncheck "Resource list" under Restricted image types → Save
const CLOUD_NAME = "dwfd7ga1a";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ImageItem {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  category: string;
  title: string;
}

interface GalleryState {
  images: ImageItem[];
  isLoading: boolean;
  error: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Mirrors your original parseFileName logic exactly
function parseFileName(publicId: string): {
  category: string;
  title: string;
} {
  // Remove folder path
  const baseName = publicId.split("/").pop() ?? publicId;

  // Remove extension if present
  const cleanName = baseName.replace(/\.[^/.]+$/, "");

  // Detect category and title using "-"
  if (cleanName.includes("-")) {
    const [category, ...titleParts] = cleanName.split("-");

    return {
      category: category.trim(),
      title: titleParts.join("-").trim(),
    };
  }

  // Fallback
  return {
    category: "Project",
    title: cleanName
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()),
  };
}

// Cloudinary image URL with transformations matching your original ?tr=w-800,h-600,c-maintain,q-85
function buildUrl(publicId: string, width = 800, height = 600): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},h_${height},c_limit,q_85,f_auto/${publicId}`;
}

// Fetch all images tagged "portfolio" from Cloudinary
async function fetchCloudinaryImages(): Promise<ImageItem[]> {
  const res = await fetch(
    `https://res.cloudinary.com/${CLOUD_NAME}/image/list/portfolio.json`,
    { cache: "no-store" },
  );

  if (res.status === 401) {
    throw new Error("401_RESTRICTED");
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch images (${res.status})`);
  }

  const data = await res.json();
  const resources: Array<{
    public_id: string;
    format: string;
    width: number;
    height: number;
  }> = data.resources ?? [];

  return resources.map((r, idx) => {
    const { category, title } = parseFileName(r.public_id);
    return {
      fileId: r.public_id || `img-${idx}`,
      name: r.public_id,
      url: buildUrl(r.public_id),
      thumbnailUrl: buildUrl(r.public_id, 800, 600),
      category,
      title,
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
const ImageKitGallery = () => {
  const [galleryState, setGalleryState] = useState<GalleryState>({
    images: [],
    isLoading: true,
    error: null,
  });

  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const fetchImages = useCallback(async () => {
    setGalleryState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const images = await fetchCloudinaryImages();
      setGalleryState({ images, isLoading: false, error: null });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      const is401 = msg.includes("401_RESTRICTED");
      console.error("[ImageKitGallery]", msg);
      setGalleryState({
        images: [],
        isLoading: false,
        error: is401
          ? 'Gallery access restricted.\nFix: Cloudinary Dashboard → Settings → Security → uncheck "Resource list" → Save.'
          : "Failed to load portfolio images.",
      });
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Auto-refresh when AdminUpload finishes
  useEffect(() => {
    const handler = () => fetchImages();
    window.addEventListener("gallery:refresh", handler);
    return () => window.removeEventListener("gallery:refresh", handler);
  }, [fetchImages]);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const categories = [
    "All",
    ...Array.from(
      new Set(galleryState.images.map((img) => img.category)),
    ).sort(),
  ];

  const filteredImages =
    activeCategory === "All"
      ? galleryState.images
      : galleryState.images.filter((img) => img.category === activeCategory);

  // ── Loading state — EXACTLY your original ─────────────────────────────────
  if (galleryState.isLoading) {
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

  // ── Error state — EXACTLY your original ───────────────────────────────────
  if (galleryState.error) {
    return (
      <section id="portfolio" className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
          <AlertCircle
            size={48}
            className="text-brand-accent mb-4 opacity-60"
          />
          <p
            className="text-brand-accent text-sm uppercase tracking-widest text-center mb-2"
            style={{ whiteSpace: "pre-line" }}
          >
            {galleryState.error}
          </p>
          <button
            onClick={fetchImages}
            className="mt-6 text-[10px] uppercase font-black tracking-[0.25em] text-brand-text/50 hover:text-brand-accent transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // ── Main gallery — EXACTLY your original UI ───────────────────────────────
  return (
    <section id="portfolio" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 flex flex-col gap-4">
          <span className="h-section">04 / Selected Works</span>
          <h2 className="text-5xl md:text-7xl font-serif">Curated Portfolio</h2>
        </div>

        {categories.length > 1 && (
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
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, idx) => (
              <motion.div
                layout
                key={image.fileId}
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
                    idx % 2 === 0 ? "bg-brand-accent/5" : "bg-brand-text/5",
                  )}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={image.thumbnailUrl}
                      alt={image.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 flex flex-col gap-3 border-t border-brand-text/10">
                    <span
                      className={cn(
                        "font-mono text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm text-brand-bg w-fit",
                        idx % 2 === 0 ? "bg-brand-accent" : "bg-brand-text",
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

      {/* Lightbox Modal — EXACTLY your original */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] bg-black/95 flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-10 right-10 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-4"
            >
              <img
                src={buildUrl(selectedImage.fileId, 1600, 1200)}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="text-center">
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
};

export default ImageKitGallery;
