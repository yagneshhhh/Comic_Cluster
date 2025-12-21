import axios from "axios";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Manga ID required" });
  }

  try {
    const response = await axios.get(
      `https://api.mangadex.org/manga/${id}/feed`,
      {
        params: {
          translatedLanguage: ["en"],
          order: { chapter: "desc" },
          limit: 500,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chapters" });
  }
}
