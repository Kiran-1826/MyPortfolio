const ImageKit = require("imagekit");
import type { VercelRequest, VercelResponse } from "@vercel/node";

const imagekit = new ImageKit({
  publicKey:
    process.env.VITE_IMAGEKIT_PUBLIC_KEY ||
    "public_h1NCM6jp5z7vekDFJzjFN9Zqaow=",
  privateKey:
    process.env.IMAGEKIT_PRIVATE_KEY || "private_LgDmlH/LjLaDRKik+tEX865AOiM=",
  urlEndpoint: "https://ik.imagekit.io/uaog52xykd",
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const files = await imagekit.listFiles({
      searchQuery: 'path = "/portfolio/"',
      limit: 50,
    });

    if (!files || !Array.isArray(files)) {
      return res.status(200).json([]);
    }

    const fileNames = files.map((file: any) => file.name);
    return res.status(200).json(fileNames);
  } catch (error: any) {
    console.error(
      "ImageKit automated parsing error details:",
      error.message || error,
    );
    return res.status(500).json({
      error: "Failed to read portfolio folder assets dynamically.",
      details: error.message || error,
    });
  }
}
