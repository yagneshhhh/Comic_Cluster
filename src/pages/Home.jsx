import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShimmerThumbnail } from "react-shimmer-effects";
import GlobalApi from "../API/GlobalApi";

const getMangaTitle = (attributes) => {
  const titles = attributes?.title || {};
  const englishAltTitle = attributes?.altTitles?.find((title) => title.en)?.en;

  return (
    titles.en ||
    englishAltTitle ||
    titles["ja-ro"] ||
    titles.ja ||
    Object.values(titles)[0] ||
    "Untitled"
  );
};

const getCoverUrl = (manga) => {
  const coverFileName = manga.relationships?.find(
    (rel) => rel.type === "cover_art"
  )?.attributes?.fileName;

  return coverFileName
    ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.256.jpg`
    : "";
};

function Home() {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManga();
  }, []);

  const fetchManga = () => {
    setLoading(true);

    GlobalApi.getManga()
      .then((res) => {
        const mangaData = res.data.data;

        const formattedData = mangaData.map((item) => ({
          id: item.id,
          title: getMangaTitle(item.attributes),
          coverUrl: getCoverUrl(item),
        }));

        setManga(formattedData);
      })
      .catch((err) => {
        console.error("Failed to fetch manga:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const truncateTitle = (title) => {
    const words = title.split(" ");
    return words.length > 3
      ? words.slice(0, 3).join(" ") + "..."
      : title;
  };

  return (
    <section className="relative px-4 sm:px-6 lg:px-10">
      <h2 className="font-bold text-2xl p-4 text-slate-200">
        Explore Top Mangas 🔥
      </h2>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <ShimmerThumbnail height={180} width={130} rounded />
                <div className="mt-2 w-full flex flex-col items-center">
                  <ShimmerThumbnail height={6} width={80} rounded />
                </div>
              </div>
            ))
          : manga.map((item) => (
              <Link
                key={item.id}
                to={`/manga/${item.id}`}
                className="p-2"
              >
                <div className="flex flex-col items-center transition-transform hover:scale-105">
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="h-[180px] w-[130px] sm:h-[190px] sm:w-[150px] md:h-[200px] md:w-[160px] rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-[180px] w-[130px] sm:h-[190px] sm:w-[150px] md:h-[200px] md:w-[160px] rounded-md bg-slate-800/70 flex items-center justify-center px-3 text-center text-xs text-slate-200">
                      No cover
                    </div>
                  )}
                  <h2 className="text-white font-semibold mt-1.5 uppercase text-center">
                    {truncateTitle(item.title)}
                  </h2>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}

export default Home;
