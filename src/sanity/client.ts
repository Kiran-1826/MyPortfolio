import { createClient } from "@sanity/client";

export const sanityProjectId = import.meta.env.VITE_SANITY_PROJECT_ID ?? "";
export const sanityDataset =
  import.meta.env.VITE_SANITY_DATASET ?? "production";
export const isSanityConfigured = Boolean(sanityProjectId);

export const sanityClient = createClient({
  projectId: sanityProjectId || "placeholder",
  dataset: sanityDataset,
  apiVersion: "2025-01-01",
  useCdn: true,
  perspective: "published",
});
