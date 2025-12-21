import axios from "axios";

const getManga = () =>
  axios.get(
    "/api/manga?limit=80&availableTranslatedLanguage[]=en&order[rating]=desc&includes[]=cover_art"
  );

export default {
  getManga,
};
