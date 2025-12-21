import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Components/Header";

function MangaPage() {
  const { id } = useParams();

  const [chapters, setChapters] = useState([]);
  const [chapterID, setChapterID] = useState(null);
  const [chapterContent, setChapterContent] = useState(null);
  const [nameDetails, setNameDetails] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* --------------------------------------------------
     1️⃣ Fetch chapters list + manga details
  -------------------------------------------------- */
  useEffect(() => {
    if (!id) return;

    // Fetch chapters
    axios
      .get(`/api/chapters?id=${id}`)
      .then((res) => {
        const data = res.data.data;
        setChapters(data);

        // Select latest chapter by default
        if (data.length > 0) {
          setChapterID(data[0].id);
          setCurrentIndex(0);
        }
      })
      .catch((err) =>
        console.error("unable to fetch manga chapters", err)
      );

    // Fetch manga title/details
    axios
      .get(`/api/mangaDetails?id=${id}`)
      .then((res) => {
        setNameDetails(res.data.data);
      })
      .catch((err) =>
        console.error("unable to fetch manga details", err)
      );
  }, [id]);

  /* --------------------------------------------------
     2️⃣ Fetch selected chapter pages
  -------------------------------------------------- */
  useEffect(() => {
    if (!chapterID) return;

    axios
      .get(`/api/chapterContent?chapterId=${chapterID}`)
      .then((res) => {
        setChapterContent(res.data);
      })
      .catch((err) =>
        console.error("unable to fetch chapter content", err)
      );
  }, [chapterID]);

  const selectedChapter = chapters.find(
    (ch) => ch.id === chapterID
  );

  return (
    <div className="w-full min-h-screen rounded-xl bg-white/50 backdrop-blur-md border-white border-3 text-white flex flex-col items-center py-6 px-3 sm:px-6 md:px-10">
      
      {/* Manga Title */}
      <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-50 text-center mb-2">
        {nameDetails?.attributes?.title?.en || "Loading..."}
      </h1>

      {/* Chapter Title */}
      <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-slate-50 text-center mb-6">
        Chapter {selectedChapter?.attributes?.chapter || "N/A"}{" "}
        {selectedChapter?.attributes?.title
          ? `– ${selectedChapter.attributes.title}`
          : ""}
      </h2>

      {/* Chapter Selector */}
      <div className="w-full flex justify-center mb-6">
        <select
          value={chapterID || ""}
          onChange={(e) => {
            setChapterID(e.target.value);
            setCurrentIndex(
              chapters.findIndex((ch) => ch.id === e.target.value)
            );
          }}
          className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] bg-gray-400 border border-white rounded-lg p-2 text-white"
        >
          {chapters.map((chapter, index) => (
            <option
              key={chapter.id}
              value={chapter.id}
              className="bg-gray-500 text-white"
            >
              Chapter {chapter.attributes.chapter || "N/A"}{" "}
              {chapter.attributes.title
                ? `- ${chapter.attributes.title}`
                : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Chapter Images */}
      <div className="w-full bg-gray-400/40 rounded-lg shadow-md shadow-zinc-700 p-3 sm:p-6 md:p-10 flex flex-col items-center gap-4">
        {chapterContent?.chapter?.data?.map((img, index) => (
          <img
            key={index}
            src={`${chapterContent.baseUrl}/data/${chapterContent.chapter.hash}/${img}`}
            alt={`Page ${index + 1}`}
            className="w-full sm:w-[90%] md:w-[70%] lg:w-[60%] object-contain rounded-md shadow-md"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

export default MangaPage;
