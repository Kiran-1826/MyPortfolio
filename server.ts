import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// ===== IMAGEKIT API ENDPOINT =====
app.get("/api/imagekit/portfolio", async (req, res) => {
  try {
    const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
    const IMAGEKIT_ID = process.env.IMAGEKIT_ID;

    console.log("ImageKit Config:", {
      hasPrivateKey: !!IMAGEKIT_PRIVATE_KEY,
      hasID: !!IMAGEKIT_ID,
      id: IMAGEKIT_ID,
    });

    if (!IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_ID) {
      return res.status(500).json({
        error:
          "Missing ImageKit credentials. Ensure Vercel environment variables have IMAGEKIT_PRIVATE_KEY and IMAGEKIT_ID",
      });
    }

    // Encode credentials for Basic Auth
    const credentials = Buffer.from(`${IMAGEKIT_PRIVATE_KEY}:`).toString(
      "base64",
    );

    // Call ImageKit API to list files in /portfolio folder
    const response = await axios.get(
      `https://api.imagekit.io/v1/files?path=/portfolio&limit=50&sort=DESC_CREATED`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      },
    );

    // Fixed mapping type definition from (file: any)
    const images = response.data.map(
      (file: { fileId: string; name: string; filePath: string }) => ({
        fileId: file.fileId,
        name: file.name,
        filePath: file.filePath,
        url: `https://ik.imagekit.io/${IMAGEKIT_ID}${file.filePath}?tr=w-800,h-600,c-maintain,q-85`,
      }),
    );

    console.log(`Found ${images.length} images in /portfolio folder`);
    return res.json({ images });
  } catch (error: any) {
    console.error("ImageKit API error:", error.message);
    console.error("Error details:", error.response?.data || error.message);
    return res.status(500).json({
      error:
        error?.response?.data?.message ||
        "Failed to fetch from ImageKit. Check your credentials.",
    });
  }
});

// ===== SERVING FRONTEND IN DEVELOPMENT vs PRODUCTION =====
async function setupFrontend() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Wildcard fallback serves index.html safely for single page apps
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

// Only listen locally during development; Vercel handles routing automatically in production
if (process.env.NODE_ENV !== "production") {
  setupFrontend().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running locally on http://localhost:${PORT}`);
    });
  });
} else {
  // Production initialization for serverless rendering paths
  setupFrontend();
}

// CRITICAL FOR VERCEL: Export the app instance so Vercel can convert endpoints to serverless functions
export default app;
