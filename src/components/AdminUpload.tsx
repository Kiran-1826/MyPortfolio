const studioUrl = import.meta.env.VITE_SANITY_STUDIO_URL ?? "http://localhost:3333";

export default function AdminUpload() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center px-6">
      <div className="town-card max-w-lg text-center flex flex-col gap-6">
        <h1 className="text-4xl font-serif">Portfolio CMS</h1>
        <p className="text-sm font-medium leading-relaxed opacity-70">
          Images and portfolio content are now managed in Sanity Studio.
        </p>
        <a href={studioUrl} className="retro-btn bg-brand-accent text-brand-bg" target="_blank" rel="noreferrer">
          Open Sanity Studio
        </a>
        <a href="/" className="font-mono text-[10px] uppercase tracking-widest opacity-60 hover:text-brand-accent">
          Back to portfolio
        </a>
      </div>
    </div>
  );
}
