import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Header from '../Components/Header';
function MangaPage() {
  const {id}=useParams() // this tracks the manga ID from Link tag used .
  const [chapters,setChapters]=useState([]); // stores all the chapters
  const [chapterID,setChapterID]=useState(null);// stores the selected chapterID
  const [chapterContent , setChapterContent]=useState(null);
  const [nameDetails,setNameDetails]=useState([])
  const [next,setNext]=useState(false)
  const [prev,setPrev]=useState(false)
  const [currentIndex,setCurrentIndex]=useState()
  useEffect(()=>
  {
    axios.get(`https://api.mangadex.org/manga/${id}/feed?translatedLanguage[]=en&order[chapter]=desc&limit=500`)
    .then(res=>
    {
      console.log(res.data )
      setChapters(res.data.data);

      if(res.data.data.length > 0)
      {
         setChapterID(res.data.data[0].id);//selecting latest chapter and storing its ID by default as get request is made to fetch chapters in desc order.                   
        
      }
      if(prev && currentIndex < res.data.data.length-1)
        {
          setChapterID(res.data.data[currentIndex+1].id);

        } 
      if(next && currentIndex > 0)
        {
          setChapterID(res.data.data[currentIndex-1].id);
        } 
    }
    )
    .catch(err=>console.error('unable to fetch manga chapters',err))

    // fetching chapter title
    axios.get(`https://api.mangadex.org/manga/${id}`)
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
    axios.get(`https://api.mangadex.org/at-home/server/${chapterID}`)
    .then(res=>
    {
      console.log("active chapter data",res.data)
      setChapterContent(res.data);
      
    }
    )
    .catch(err=>console.log('unable to fetch manga chapter data ', err))
  },[chapterID])
  const selectedChapterId= chapters.find(ch=>ch.id===chapterID)
 return (
  <div className="w-full min-h-screen rounded-xl bg-white/50  bg-backdrop-blur-md border-white border-3 text-white flex flex-col items-center py-6 px-3 sm:px-6 md:px-10">
    
    {/* Manga Title */}
    <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-50 text-shadow-2xs text-center mb-2">
      {nameDetails?.attributes?.title?.en || 'Loading...'}
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
            onClick={setCurrentIndex(index)}
            className="bg-gray-500 text-white"
          >
            Chapter {chapter.attributes.chapter || 'N/A'} - {chapter.attributes.title}
          </option>
        ))}
      </select>
    </div>


    {/* Chapter Images */}
    <div className="w-full bg-gray-400/40 rounded-lg shadow-md shadow-zinc-700 p-3 sm:p-6 md:p-10 flex flex-col items-center gap-4">
      {chapterContent && chapterContent.chapter.data.map((item, index) => (
        <img
          key={index}
          src={`${chapterContent.baseUrl}/data/${chapterContent.chapter.hash}/${item}`}
          alt={`Page ${index + 1}`}
          className="w-full sm:w-[90%] md:w-[70%] lg:w-[60%] object-contain rounded-md shadow-md"
          loading="lazy"
        />
      ))}
    </div>
  </div>
);

}

export default MangaPage