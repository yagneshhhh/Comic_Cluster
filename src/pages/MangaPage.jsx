import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function ChapterPageImage({ baseUrl, hash, fileName, dataSaverFileName, index }) {
  const [useDataSaver, setUseDataSaver] = useState(false);
  const [failed, setFailed] = useState(false);
  const fullImageUrl = `${baseUrl}/data/${hash}/${fileName}`;
  const dataSaverUrl = dataSaverFileName
    ? `${baseUrl}/data-saver/${hash}/${dataSaverFileName}`
    : null;

  if (failed) {
    return (
      <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[60%] rounded-md bg-slate-900/70 p-4 text-center text-slate-100">
        Page {index + 1} could not be loaded.
      </div>
    );
  }

  return (
    <img
      src={useDataSaver ? dataSaverUrl : fullImageUrl}
      alt={`Page ${index + 1}`}
      referrerPolicy="no-referrer"
      className="w-full sm:w-[90%] md:w-[70%] lg:w-[60%] object-contain rounded-md shadow-md"
      loading="lazy"
      onError={() => {
        if (!useDataSaver && dataSaverUrl) setUseDataSaver(true);
        else setFailed(true);
      }}
    />
  );
}

const getMangaTitle = (attributes) => {
  const titles = attributes?.title || {};
  const englishAltTitle = attributes?.altTitles?.find((title) => title.en)?.en;

  return (
    titles.en ||
    englishAltTitle ||
    titles["ja-ro"] ||
    titles.ja ||
    Object.values(titles)[0] ||
    "Loading..."
  );
};

function MangaPage() {
  const {id}=useParams() // this tracks the manga ID from Link tag used .
  const [chapters,setChapters]=useState([]); // stores all the chapters
  const [chapterID,setChapterID]=useState(null);// stores the selected chapterID
  const [chapterContent , setChapterContent]=useState(null);
  const [chapterError, setChapterError] = useState("");
  const [chaptersLoading, setChaptersLoading] = useState(true);
  const [chapterContentLoading, setChapterContentLoading] = useState(false);
  const [nameDetails,setNameDetails]=useState(null)
  useEffect(()=>
  {
    setChapters([]);
    setChapterID(null);
    setChapterContent(null);
    setChapterError("");
    setChaptersLoading(true);

    let cancelled = false;
    const fetchChapters = async () => {
      try {
        const feedUrl = `/api/manga/${id}/feed?order[chapter]=desc&limit=500`;
        let chapterList = [];
        try {
          const englishResponse = await axios.get(`${feedUrl}&translatedLanguage[]=en`);
          chapterList = englishResponse.data.data || [];
        } catch (error) {
          console.warn('English chapter list unavailable; checking other languages.', error);
        }

        if (!chapterList.length) {
          const allLanguagesResponse = await axios.get(feedUrl);
          chapterList = allLanguagesResponse.data.data || [];
        }

        if (cancelled) return;
        setChapters(chapterList);
        const readableChapter = chapterList.find(
          (chapter) => chapter.attributes.pages > 0 && !chapter.attributes.externalUrl
        );
        setChapterID(readableChapter?.id || chapterList[0]?.id || "");
      } catch (error) {
        if (!cancelled) {
          console.error('unable to fetch manga chapters', error);
          setChapterError("Chapter list could not be loaded. Please try again later.");
        }
      } finally {
        if (!cancelled) setChaptersLoading(false);
      }
    };
    fetchChapters();

    // fetching chapter title
    axios.get(`/api/manga/${id}`)
    .then(res=>
    {
      console.log("manga details",res.data);
      setNameDetails(res.data.data)
    }
    )
    .catch(err=>console.error("unable to fetch manga detils",err))
    return () => { cancelled = true; };
  },[id]);


  // fetching chapter content using chapter id (selected chapter id from the dropdown list)
  useEffect(()=>
  {
    if (!chapterID) return
    let cancelled = false;
    const activeChapter = chapters.find((chapter) => chapter.id === chapterID);

    setChapterContent(null);
    setChapterError("");
    setChapterContentLoading(true);

    if (activeChapter?.attributes?.externalUrl || activeChapter?.attributes?.pages === 0) {
      setChapterError("This chapter is hosted outside MangaDex.");
      setChapterContentLoading(false);
      return () => { cancelled = true; };
    }

    axios.get(`/api/at-home/server/${chapterID}`)
    .then(res=>
    {
      console.log("active chapter data",res.data)
      if (!cancelled) setChapterContent(res.data);
      
    }
    )
    .catch(err=>{
      if (!cancelled) {
        console.error('unable to fetch manga chapter data', err);
        setChapterError("This chapter could not be loaded from MangaDex.");
      }
    })
    .finally(() => {
      if (!cancelled) setChapterContentLoading(false);
    });
    return () => { cancelled = true; };
  },[chapterID, chapters])
  const selectedChapterId= chapters.find(ch=>ch.id===chapterID)
 return (
  <div className="w-full min-h-screen rounded-xl bg-white/50  bg-backdrop-blur-md border-white border-3 text-white flex flex-col items-center py-6 px-3 sm:px-6 md:px-10">
    
    {/* Manga Title */}
    <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-50 text-shadow-2xs text-center mb-2">
      {getMangaTitle(nameDetails?.attributes)}
    </h1>

    {/* Chapter Title */}
    <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-slate-50 text-shadow-2xs text-center mb-6 px-3">
      Chapter {selectedChapterId?.attributes?.chapter || 'N/A'} – {selectedChapterId?.attributes?.title || ''}
    </h2>

    {/* Chapter Select Dropdown */}
    <div className="w-full flex justify-center mb-6">
      <select
        value={chapterID || ""}
        onChange={(event) => setChapterID(event.target.value)}
        className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] bg-gray-400 border border-white rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
      >
        <option value="" disabled className="bg-gray-500">
          {chaptersLoading ? "Loading chapters..." : "Select Chapter"}
        </option>
        {chapters.map((chapter) => (
          <option
            key={chapter.id}
            value={chapter.id}
            className="bg-gray-500 text-white"
          >
            Chapter {chapter.attributes.chapter || 'N/A'} - {chapter.attributes.title || "Untitled"}
            {chapter.attributes.externalUrl || chapter.attributes.pages === 0 ? " (external)" : ""}
          </option>
        ))}
      </select>
    </div>


    {/* Chapter Images */}
    <div className="w-full bg-gray-400/40 rounded-lg shadow-md shadow-zinc-700 p-3 sm:p-6 md:p-10 flex flex-col items-center gap-4">
      {chapterError && (
        <div className="w-full max-w-xl rounded-md bg-slate-900/70 p-4 text-center text-slate-100">
          <p>{chapterError}</p>
          {selectedChapterId?.attributes?.externalUrl && (
            <a
              href={selectedChapterId.attributes.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-md bg-purple-700 px-4 py-2 font-semibold text-white hover:bg-purple-800"
            >
              Read on official source
            </a>
          )}
        </div>
      )}
      {chaptersLoading && <p>Loading chapters...</p>}
      {!chaptersLoading && !chapters.length && !chapterError && (
        <p>No chapters are available for this manga.</p>
      )}
      {chapterContentLoading && <p>Loading chapter pages...</p>}
      {chapterContent?.chapter?.data?.map((fileName, index) => (
        <ChapterPageImage
          key={`${chapterContent.chapter.hash}-${fileName}`}
          baseUrl={chapterContent.baseUrl}
          hash={chapterContent.chapter.hash}
          fileName={fileName}
          dataSaverFileName={chapterContent.chapter.dataSaver?.[index]}
          index={index}
        />
      ))}
    </div>
  </div>
);

}

export default MangaPage
