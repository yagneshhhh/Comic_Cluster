import React from 'react'
import { useEffect } from 'react'
import GlobalApi from '../API/GlobalApi'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ShimmerThumbnail } from 'react-shimmer-effects';
function Home() {
  useEffect(()=>
  {
    getManga();
  },[])
  const [manga,setManga]=useState([])
  const [loading,setLoading]=useState(true);
  const getManga=()=>
  { 
    setLoading(true);
    GlobalApi.getManga
    .then(async(res)=>
    {
      const mangaData=res.data.data ;
      const mangaDataWithCovers=(
        mangaData.map((manga)=>
        {
          const cover=manga.relationships.find(rel=>rel.type==="cover_art")?.attributes?.fileName;
          const coverUrl=`https://uploads.mangadex.org/covers/${manga.id}/${cover}.256.jpg`
          return{
            id:manga.id,
            title:manga.attributes.title.en || "undefined",
            coverUrl,
          };
        })
      )
      setManga(mangaDataWithCovers);
    })
    .catch(err=>console.error("unable to fetch manga data",err))
    .finally(
      setLoading(false)
    )
  }
  const truncateTitle = (title) => {
  const words = title.split(" ");
  return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : title;
};

  return (
    
    <section className=' relative px-4 sm:px-6 lg:px-10 '>
      <h2 className='font-bold text-2xl p-4 text-slate-200 '>Explore Top Mangas 🔥</h2>

      <div 
        className='
        grid gap-3 
        gid-cols-2 
        sm:grid-cols-3
         md:grid-cols-4 
         lg:grid-cols-5 '
       >
        
       {loading ? Array.from({length : 12}).map((_,index)=>(
        <div key={index} className='flex flex-col items-center '>
          <ShimmerThumbnail height={180} width={130} rounded/>
          <div className='mt-1 px-18 w-full '>
            <ShimmerThumbnail height={6} width={0}  rounded/>
            <ShimmerThumbnail height={6} width={50} rounded/>
          </div>
        </div>
       )) :
        manga.map((manga)=>
      (
        <div className=' p-2  '>
          <Link to={`/manga/${manga.id}`} >
          <div className='flex flex-col items-center transition-transform duration-300 ease-in-out hover:scale-110'>

           <img src={manga.coverUrl} className='
             h-[180px] w-[130px]
             sm:h-[190px] sm:w-[150px]
             md:h-[200px] md:w-[160px]
             rounded-md
             object-cover
             transition-transform duration-300
             group-hover:scale-105 '/>
          <h2 className='text-white font-semibold  uppercase mt-1.5'>
            {truncateTitle(manga.title)}
          </h2>
          </div>
          </Link>
        </div>
      ))}
      </div>
      </section>

  )
}

export default Home