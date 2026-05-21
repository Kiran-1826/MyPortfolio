import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: "public_h1NCM6jp5z7vekDFJzjFN9Zqaow",
  privateKey: "private_LgDmlH/LjLaDRKik+tEX865AOiM=",
  urlEndpoint: "https://ik.imagekit.io/uaog52xykd",
});

export default async function handler(req, res) {
  try {
    const result = await imagekit.listFiles({
      path: "/portfolio/",
    });

    const formatted = result.map((file) => ({
      fileId: file.fileId,
      name: file.name,
      url: file.url,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch images",
    });
  }
}
