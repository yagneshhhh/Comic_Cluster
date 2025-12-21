import axios from "axios";

export default async function handler(req, res) {
  const { chapterId } = req.query;

  if (!chapterId) {
    return res.status(400).json({ error: "Chapter ID required" });
  }

  try {
    const response = await axios.get(
      `https://api.mangadex.org/at-home/server/${chapterId}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chapter content" });
  }
}
