import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Loader2, X } from "lucide-react";
import ImageKit from "imagekit-javascript"; // Import the client SDK
import { cn } from "../lib/utils";

// Initialize ImageKit with your Public URL Endpoint
// (Safe to expose in frontend code because it only allows reading public media)
const ikClient = new ImageKit({
  urlEndpoint: "https://ik.imagekit.io/YOUR_IMAGEKIT_ID_HERE",
});

interface ImageItem {
  fileId: string;
  name: string;
  url: string;
  category: string;
  title: string;
}

interface GalleryState {
  images: ImageItem[];
  isLoading: boolean;
  error: string | null;
}

const ImageKitGallery = () => {
  const [galleryState, setGalleryState] = useState<GalleryState>({
    images: [],
    isLoading: true,
    error: null,
  });

  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const parseFileName = (
    fileName: string,
  ): { category: string; title: string } => {
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    if (nameWithoutExt.includes(" - ")) {
      const [category, ...titleParts] = nameWithoutExt.split(" - ");
      return {
        category: category.trim(),
        title: titleParts.join(" - ").trim(),
      };
    }
    return {
      category: "Gallery",
      title: nameWithoutExt.trim(),
    };
  };

  useEffect(() => {
    const fetchPortfolioImages = async () => {
      try {
        setGalleryState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Directly list files from the ImageKit folder using the frontend SDK
        ikClient.listFiles(
          {
            path: "/portfolio",
            limit: 50,
          },
          (err, result) => {
            if (err) {
              throw new Error(
                err.message || "Failed to fetch images from ImageKit",
              );
            }

            if (!result || result.length === 0) {
              setGalleryState({
                images: [],
                isLoading: false,
                error: "No images found in your ImageKit /portfolio folder.",
              });
              return;
            }

            // Transform the files array directly inside React
            const processedImages: ImageItem[] = result.map(
              (file: any, idx: number) => {
                const { category, title } = parseFileName(file.name);
                return {
                  fileId: file.fileId || `img-${idx}`,
                  name: file.name,
                  // Automatically append real-time image resizing parameters
                  url: `${file.url}?tr=w-800,h-600,c-maintain,q-85`,
                  category,
                  title,
                };
              },
            );

            setGalleryState({
              images: processedImages,
              isLoading: false,
              error: null,
            });
          },
        );
      } catch (err: any) {
        console.error("Portfolio fetch error:", err);
        setGalleryState({
          images: [],
          isLoading: false,
          error: err.message || "Failed to load portfolio images.",
        });
      }
    };

    fetchPortfolioImages();
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

  if (galleryState.error) {
    return (
      <section id="portfolio" className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
          <AlertCircle
            size={48}
            className="text-brand-accent mb-4 opacity-60"
          />
          <p className="text-brand-accent text-sm uppercase tracking-widest text-center mb-2">
            {galleryState.error}
          </p>
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
                      src={image.url}
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

      {/* Lightbox Modal */}
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
                src={selectedImage.url}
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
