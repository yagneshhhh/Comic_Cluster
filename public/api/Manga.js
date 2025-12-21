import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      "https://api.mangadex.org/manga",
      {
        params: {
          limit: 80,
          availableTranslatedLanguage: ["en"],
          order: { rating: "desc" },
          includes: ["cover_art"],
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch manga" });
  }
}
