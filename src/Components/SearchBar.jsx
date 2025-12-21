import axios from 'axios'
import React, { useEffect ,useState} from 'react'
import { Link } from 'react-router-dom'
function SearchBar() {
    const [searchText,setSearchText]=useState('') // state variable for search text.
    const [suggestions,setSuggestions]=useState([])//search text suggestions.
    const [isLoading,setIsLoading]=useState(false)// isLoading helps to indicate that suggestions[] are empty or not.
    const [isActive,setIsActive]=useState(false)
    useEffect(()=>
    {
        const fetchSuggestions=async()=>
        {
            if (searchText.trim().length <3)
            {
                setSuggestions([]); 
                return;
            }
            setIsLoading(true);
        }
        axios.get(`https://api.mangadex.org/manga?title=${searchText}&limit=4`)
        .then(res=>
            {
            const results=res.data.data.map((manga)=>({
                id:manga.id,
                title:manga.attributes.title.en || 'No English Title Available'
            }));
            if(searchText.length>0)
            {
                setSuggestions(results);
                setIsLoading(false);
            }
        }
        )
        .catch(err=>console.error('unable to load suggestions',err));
        
        const debounce=setTimeout(fetchSuggestions,400);//setting a timeout 400ms for the function i.e the function(API call) runs only after typing is stopped for 400ms.
        return ()=>clearTimeout(debounce);// cleanup of timer in case of any text is typed within the time interval given in setTimeot i.e it resets the time.
    },[searchText])
    useEffect(()=>
    {
        const detectOutsideClick=(event)=>
        {
            if(!event.target.closest('.searchbox-wrapper'))
            {
                setSearchText('');               
            }
        }
        document.addEventListener('click',detectOutsideClick)
        return ()=>document.removeEventListener('click',detectOutsideClick) 
    },[])
    const textSearch=(event)=>
    {
        setSearchText(event.target.value);
        
    }
  return (
    <div className='relative  max-w-md mx-auto searchbox-wrapper'>
        <input type='text ' value={searchText} onFocus={()=>setIsActive(true)} onChange={(event)=>textSearch(event)} placeholder='  Search Manga ' className=' placeholder-white text-white rounded-sm p-2 font-stretch-normal outline-none inset-shadow-sm inset-shadow-gray-950  bg-purple-700 h-[35px] w-[390px]  '/>
        {isActive&& suggestions.length>0 && (
            <ul className='absolute top-full mt-1 opacity-100 bg-purple-600 rounded-lg w-[390px] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl shadow-purple-900 '>
                {suggestions.map((manga)=>
                (
                    <li className='text-white  p-2 font-stretch-normal opacity-100 rounded-sm hover:bg-purple-800  mt-1  transition '>
                        <Link to={`/manga/${manga.id}`} onClick={()=>
                            {
                                setSearchText('');
                                setSuggestions([]);
                            }
                        }>
                            {manga.title}
                        </Link> 
                    </li>
                ))}
            </ul>
        )}
    </div>
  )
}

export default SearchBar