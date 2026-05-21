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

    // Map files to verified object structural types
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

// ===== DEVELOPMENT FRONTEND INTERCEPT ONLY =====
// Vercel completely bypasses local static file mapping via Express.
// This block only spins up the Vite development proxy locally.
if (process.env.NODE_ENV !== "production") {
  async function setupDevFrontend() {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running locally on http://localhost:${PORT}`);
    });
  }
  setupDevFrontend();
}

// CRITICAL FOR VERCEL: Export the application layer instance.
export default app;
