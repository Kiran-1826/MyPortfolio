import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default async function handler(req, res) {
  try {
    const result = await imagekit.listFiles({});

    const portfolioImages = result.filter(
      (file) => file.filePath && file.filePath.startsWith("/portfolio/"),
    );

    return res.status(200).json(
      portfolioImages.map((file) => ({
        fileId: file.fileId,
        name: file.name,
        url: file.url,
      })),
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
}
