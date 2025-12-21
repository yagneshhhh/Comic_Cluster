import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShimmerThumbnail } from "react-shimmer-effects";
import GlobalApi from "../api/GlobalApi";

function Home() {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);

  const getManga = () => {
    setLoading(true);

    GlobalApi.getManga()
      .then((res) => {
        const mangaData = res.data.data || [];

        const mangaDataWithCovers = mangaData.map((manga) => {
          const cover = manga.relationships?.find(
            (rel) => rel.type === "cover_art"
          )?.attributes?.fileName;

          return {
            id: manga.id,
            title: manga.attributes?.title?.en || "undefined",
            coverUrl: cover
              ? `https://uploads.mangadex.org/covers/${manga.id}/${cover}.256.jpg`
              : "",
          };
        });

        setManga(mangaDataWithCovers);
      })
      .catch((err) => {
        console.error("unable to fetch manga data", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getManga();
  }, []);

  const truncateTitle = (title) => {
    const words = title.split(" ");
    return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : title;
  };

  return (
    <section className="relative px-4 sm:px-6 lg:px-10">
      <h2 className="font-bold text-2xl p-4 text-slate-200">
        Explore Top Mangas 🔥
      </h2>

      <div
        className="
          grid gap-3
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
        "
      >
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <ShimmerThumbnail height={180} width={130} rounded />
                <div className="mt-2 w-full flex flex-col items-center">
                  <ShimmerThumbnail height={8} width={90} rounded />
                </div>
              </div>
            ))
          : manga.map((item) => (
              <div key={item.id} className="p-2">
                <Link to={`/manga/${item.id}`}>
                  <div className="flex flex-col items-center transition-transform duration-300 hover:scale-110">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="
                        h-[180px] w-[130px]
                        sm:h-[190px] sm:w-[150px]
                        md:h-[200px] md:w-[160px]
                        rounded-md object-cover
                      "
                    />
                    <h2 className="text-white font-semibold uppercase mt-1.5 text-center">
                      {truncateTitle(item.title)}
                    </h2>
                  </div>
                </Link>
              </div>
            ))}
      </div>
    </section>
  );
}

export default Home;
