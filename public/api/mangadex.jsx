export default async function handler(req, res) {
  const query = req.url.replace("/api/mangadex", "");

  const targetUrl = `https://api.mangadex.org${query}`;

  try {
    const response = await fetch(targetUrl);

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "MangaDex proxy failed" });
  }
}
