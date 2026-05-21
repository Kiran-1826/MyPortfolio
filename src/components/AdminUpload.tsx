import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Cloudinary Config ────────────────────────────────────────────────────────
const CLOUD_NAME = "dwfd7ga1a";
const UPLOAD_PRESET = "portfolio_uploads";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
  publicId?: string;
  previewUrl: string;
}

// ─── Upload single file via XHR (for progress events) ────────────────────────
function uploadToCloudinary(
  file: File,
  onProgress: (pct: number) => void,
): Promise<{ public_id: string }> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    // Tag every upload → shows up in /image/list/portfolio.json
    formData.append("tags", "portfolio");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", UPLOAD_URL);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(
            new Error(
              errData?.error?.message ?? `Upload failed (${xhr.status})`,
            ),
          );
        } catch {
          reject(new Error(`Upload failed (${xhr.status})`));
        }
      }
    };

    xhr.onerror = () =>
      reject(new Error("Network error — check your connection."));
    xhr.send(formData);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminUpload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Add files ───────────────────────────────────────────────────────────────
  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;
    setAllDone(false);
    setFiles((prev) => [
      ...prev,
      ...arr.map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        progress: 0,
        status: "pending" as const,
        previewUrl: URL.createObjectURL(f),
      })),
    ]);
  }, []);

  // ── Drag & Drop ─────────────────────────────────────────────────────────────
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node))
      setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  // ── Patch a single file ─────────────────────────────────────────────────────
  const patchFile = (id: string, patch: Partial<UploadFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  // ── Upload all pending ──────────────────────────────────────────────────────
  const startUpload = async () => {
    const pending = files.filter((f) => f.status === "pending");
    if (!pending.length || isUploading) return;

    setIsUploading(true);
    setAllDone(false);

    await Promise.all(
      pending.map(async (item) => {
        patchFile(item.id, { status: "uploading", progress: 0 });
        try {
          const result = await uploadToCloudinary(item.file, (pct) => {
            patchFile(item.id, { progress: pct });
          });
          patchFile(item.id, {
            status: "done",
            progress: 100,
            publicId: result.public_id,
          });
        } catch (err: unknown) {
          patchFile(item.id, {
            status: "error",
            error: err instanceof Error ? err.message : "Upload failed",
          });
        }
      }),
    );

    setIsUploading(false);
    setAllDone(true);
    // Dispatch event so ImageKitGallery auto-refreshes if on same page
    window.dispatchEvent(new Event("gallery:refresh"));
  };

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
    setAllDone(false);
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const doneCount = files.filter((f) => f.status === "done").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Upload</h1>
          <p style={styles.subtitle}>
            Upload images directly to Cloudinary. They appear in the portfolio
            gallery automatically.
          </p>
          <div style={styles.hint}>
            💡 Name files like{" "}
            <code style={styles.code}>Branding - Project Name.jpg</code> to set
            category &amp; title automatically.
          </div>
        </div>

        {/* Drop Zone */}
        <motion.div
          style={{
            ...styles.dropZone,
            ...(isDragging ? styles.dropZoneDragging : {}),
          }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          whileHover={{ borderColor: "#555" }}
          whileTap={{ scale: 0.99 }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          <div style={styles.dropIcon}>{isDragging ? "📂" : "🖼️"}</div>
          <p style={styles.dropText}>
            {isDragging ? "Drop images here…" : "Click or drag & drop images"}
          </p>
          <p style={styles.dropSub}>
            JPG · PNG · WebP · GIF · Multiple files OK
          </p>
        </motion.div>

        {/* File Queue */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              style={styles.queue}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div style={styles.queueHeader}>
                <span style={styles.queueCount}>
                  {files.length} file{files.length !== 1 ? "s" : ""}
                  {doneCount > 0 && ` · ${doneCount} uploaded`}
                  {errorCount > 0 && ` · ${errorCount} failed`}
                </span>
                <button
                  style={styles.clearBtn}
                  onClick={clearAll}
                  disabled={isUploading}
                >
                  Clear all
                </button>
              </div>

              {files.map((item) => (
                <motion.div
                  key={item.id}
                  style={{
                    ...styles.fileRow,
                    ...(item.status === "done" ? styles.fileRowDone : {}),
                    ...(item.status === "error" ? styles.fileRowError : {}),
                  }}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  {/* Thumbnail */}
                  <img src={item.previewUrl} alt="" style={styles.thumb} />

                  {/* Info */}
                  <div style={styles.fileInfo}>
                    <span style={styles.fileName}>{item.file.name}</span>
                    <span style={styles.fileSize}>
                      {(item.file.size / 1024).toFixed(0)} KB
                    </span>

                    {/* Progress bar */}
                    {item.status === "uploading" && (
                      <div style={styles.progressWrap}>
                        <div style={styles.progressTrack}>
                          <motion.div
                            style={styles.progressBar}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ ease: "easeOut" }}
                          />
                        </div>
                        <span style={styles.progressPct}>{item.progress}%</span>
                      </div>
                    )}

                    {item.status === "error" && (
                      <span style={styles.errorMsg} title={item.error}>
                        ✕ {item.error ?? "Failed"}
                      </span>
                    )}
                  </div>

                  {/* Status / Action */}
                  <div style={styles.fileAction}>
                    {item.status === "done" && (
                      <span style={styles.badgeDone}>✓ Done</span>
                    )}
                    {item.status === "uploading" && (
                      <span style={styles.badgeUploading}>Uploading…</span>
                    )}
                    {item.status === "pending" && (
                      <button
                        style={styles.removeBtn}
                        onClick={() => removeFile(item.id)}
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    )}
                    {item.status === "error" && (
                      <button
                        style={styles.removeBtn}
                        onClick={() => removeFile(item.id)}
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Banner */}
        <AnimatePresence>
          {allDone && errorCount === 0 && (
            <motion.div
              style={styles.successBanner}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              ✅ All {doneCount} image{doneCount !== 1 ? "s" : ""} uploaded
              successfully! The gallery will refresh automatically.
            </motion.div>
          )}
          {allDone && errorCount > 0 && (
            <motion.div
              style={styles.partialBanner}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              ⚠️ {doneCount} uploaded, {errorCount} failed. Check errors above
              and retry.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Button */}
        {pendingCount > 0 && (
          <motion.button
            style={{
              ...styles.uploadBtn,
              ...(isUploading ? styles.uploadBtnDisabled : {}),
            }}
            onClick={startUpload}
            disabled={isUploading}
            whileHover={!isUploading ? { scale: 1.03 } : {}}
            whileTap={!isUploading ? { scale: 0.97 } : {}}
          >
            {isUploading
              ? "Uploading…"
              : `Upload ${pendingCount} Image${pendingCount !== 1 ? "s" : ""}`}
          </motion.button>
        )}

        {/* Back to portfolio link */}
        <div style={styles.backRow}>
          <a href="/" style={styles.backLink}>
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#f0f0f0",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "2rem 1rem",
  },
  container: {
    maxWidth: "660px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    margin: "0 0 0.4rem",
    color: "#ffffff",
  },
  subtitle: {
    color: "#888",
    fontSize: "0.9rem",
    lineHeight: 1.6,
    margin: "0 0 0.8rem",
  },
  hint: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: "8px",
    padding: "0.7rem 1rem",
    fontSize: "0.85rem",
    color: "#aaa",
    lineHeight: 1.5,
  },
  code: {
    background: "#1e1e1e",
    padding: "0.1em 0.4em",
    borderRadius: "4px",
    color: "#7dd3fc",
    fontSize: "0.9em",
    fontFamily: "monospace",
  },
  // Drop zone
  dropZone: {
    border: "2px dashed #2a2a2a",
    borderRadius: "14px",
    padding: "3rem 2rem",
    textAlign: "center" as const,
    cursor: "pointer",
    background: "#0f0f0f",
    transition: "border-color 0.2s, background 0.2s",
    marginBottom: "1.5rem",
    userSelect: "none" as const,
  },
  dropZoneDragging: {
    borderColor: "#7dd3fc",
    background: "#0c1a24",
  },
  dropIcon: { fontSize: "2.5rem", marginBottom: "0.6rem" },
  dropText: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#e0e0e0",
    margin: "0 0 0.3rem",
  },
  dropSub: { fontSize: "0.8rem", color: "#555", margin: 0 },
  // Queue
  queue: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
    marginBottom: "1.2rem",
  },
  queueHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.4rem",
  },
  queueCount: { fontSize: "0.82rem", color: "#666" },
  clearBtn: {
    background: "none",
    border: "none",
    color: "#555",
    cursor: "pointer",
    fontSize: "0.82rem",
    padding: "0.2rem 0.4rem",
    transition: "color 0.15s",
  },
  // File rows
  fileRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    background: "#141414",
    border: "1px solid #1e1e1e",
    borderRadius: "10px",
    padding: "0.6rem 0.8rem",
    transition: "border-color 0.2s",
  },
  fileRowDone: { borderColor: "#14532d40" },
  fileRowError: { borderColor: "#7f1d1d40" },
  thumb: {
    width: "44px",
    height: "44px",
    objectFit: "cover" as const,
    borderRadius: "6px",
    flexShrink: 0,
    background: "#222",
  },
  fileInfo: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.15rem",
  },
  fileName: {
    fontSize: "0.85rem",
    color: "#ddd",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  fileSize: { fontSize: "0.72rem", color: "#555" },
  progressWrap: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "0.2rem",
  },
  progressTrack: {
    flex: 1,
    height: "5px",
    background: "#222",
    borderRadius: "99px",
    overflow: "hidden",
    position: "relative" as const,
  },
  progressBar: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    bottom: 0,
    background: "#7dd3fc",
    borderRadius: "99px",
  },
  progressPct: { fontSize: "0.72rem", color: "#7dd3fc", minWidth: "32px" },
  errorMsg: { fontSize: "0.72rem", color: "#f87171", marginTop: "0.15rem" },
  fileAction: { flexShrink: 0 },
  badgeDone: {
    fontSize: "0.75rem",
    fontWeight: 600,
    background: "#14532d",
    color: "#6ee7b7",
    padding: "0.2em 0.6em",
    borderRadius: "99px",
  },
  badgeUploading: {
    fontSize: "0.75rem",
    color: "#7dd3fc",
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "#444",
    cursor: "pointer",
    fontSize: "0.85rem",
    padding: "0.3rem",
    lineHeight: 1,
    transition: "color 0.15s",
  },
  // Banners
  successBanner: {
    background: "#052e16",
    border: "1px solid #16a34a",
    color: "#86efac",
    borderRadius: "10px",
    padding: "0.9rem 1.1rem",
    fontSize: "0.88rem",
    marginBottom: "1rem",
  },
  partialBanner: {
    background: "#1c1200",
    border: "1px solid #ca8a04",
    color: "#fde68a",
    borderRadius: "10px",
    padding: "0.9rem 1.1rem",
    fontSize: "0.88rem",
    marginBottom: "1rem",
  },
  // Upload button
  uploadBtn: {
    display: "block",
    width: "100%",
    background: "#7dd3fc",
    color: "#0a0a0a",
    fontWeight: 700,
    fontSize: "0.95rem",
    border: "none",
    borderRadius: "10px",
    padding: "0.85rem",
    cursor: "pointer",
    marginBottom: "1rem",
    transition: "background 0.2s",
  },
  uploadBtnDisabled: {
    background: "#1e3a4a",
    color: "#4a7a94",
    cursor: "not-allowed",
  },
  backRow: {
    textAlign: "center" as const,
    marginTop: "1.5rem",
  },
  backLink: {
    color: "#555",
    fontSize: "0.85rem",
    textDecoration: "none",
    transition: "color 0.15s",
  },
};
