import axios from "axios";

const axiosCreate=axios.create({
    baseURL:"https://api.mangadex.org"
})
 const getManga = axiosCreate.get('/manga?limit=80&availableTranslatedLanguage[]=en&order[rating]=desc&includes[]=cover_art')
 export default{
    getManga,
 }