import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Header from '../Components/Header';

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
  const [nameDetails,setNameDetails]=useState([])
  useEffect(()=>
  {
    setChapters([]);
    setChapterID(null);
    setChapterContent(null);
    setChapterError("");

    axios.get(`/api/manga/${id}/feed?translatedLanguage[]=en&order[chapter]=desc&limit=500`)
    .then(res=>
    {
      console.log(res.data )
      setChapters(res.data.data);

      if(res.data.data.length > 0)
      {
         const readableChapter = res.data.data.find(
          (chapter) => chapter.attributes.pages > 0 && !chapter.attributes.externalUrl
         );
         setChapterID(readableChapter?.id || res.data.data[0].id);//selecting latest readable chapter by default when possible.
        
      }
    }
    )
    .catch(err=>console.error('unable to fetch manga chapters',err))

    // fetching chapter title
    axios.get(`/api/manga/${id}`)
    .then(res=>
    {
      console.log("manga details",res.data);
      setNameDetails(res.data.data)
    }
    )
    .catch(err=>console.error("unable to fetch manga detils",err))
  
  },[id]);


  // fetching chapter content using chapter id (selected chapter id from the dropdown list)
  useEffect(()=>
  {
    if (!chapterID) return
    const activeChapter = chapters.find((chapter) => chapter.id === chapterID);

    setChapterContent(null);
    setChapterError("");

    if (activeChapter?.attributes?.externalUrl || activeChapter?.attributes?.pages === 0) {
      setChapterError("This chapter is hosted outside MangaDex.");
      return;
    }

    axios.get(`/api/at-home/server/${chapterID}`)
    .then(res=>
    {
      console.log("active chapter data",res.data)
      setChapterContent(res.data);
      
    }
    )
    .catch(err=>{
      console.log('unable to fetch manga chapter data ', err)
      setChapterError("This chapter could not be loaded from MangaDex.");
    })
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
        value={chapterID}
        onChange={(event) => setChapterID(event.target.value)}
        className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] bg-gray-400 border border-white rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
      >
        <option className="bg-gray-500">Select Chapter</option>
        {chapters.map((chapter, index) => (
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
      {chapterContent && chapterContent.chapter.data.map((item, index) => (
        <img
          key={index}
          src={`${chapterContent.baseUrl}/data/${chapterContent.chapter.hash}/${item}`}
          alt={`Page ${index + 1}`}
          referrerPolicy="no-referrer"
          className="w-full sm:w-[90%] md:w-[70%] lg:w-[60%] object-contain rounded-md shadow-md"
          loading="lazy"
        />
      ))}
    </div>
  </div>
);

}

export default MangaPage
