import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ===== IMAGEKIT API ENDPOINT =====
  // This endpoint fetches images from ImageKit's /portfolio folder
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
            "Missing ImageKit credentials. Ensure .env file has IMAGEKIT_PRIVATE_KEY and IMAGEKIT_ID",
        });
      }

      // Encode credentials for Basic Auth
      const credentials = Buffer.from(
        `${IMAGEKIT_PRIVATE_KEY}:`,
      ).toString("base64");

      // Call ImageKit API to list files in /portfolio folder
      const response = await axios.get(
        `https://api.imagekit.io/v1/files?path=/portfolio&limit=50&sort=DESC_CREATED`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      // Transform response to include image URLs
      const images = response.data.map((file: any) => ({
        fileId: file.fileId,
        name: file.name,
        filePath: file.filePath,
        url: `https://ik.imagekit.io/${IMAGEKIT_ID}${file.filePath}?tr=w-800,h-600,c-maintain,q-85`,
      }));

      console.log(`Found ${images.length} images in /portfolio folder`);
      res.json({ images });
    } catch (error: any) {
      console.error("ImageKit API error:", error.message);
      console.error("Error details:", error.response?.data || error.message);
      res.status(500).json({
        error:
          error?.response?.data?.message ||
          "Failed to fetch from ImageKit. Check your credentials.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
