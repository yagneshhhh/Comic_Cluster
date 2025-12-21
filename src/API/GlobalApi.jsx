import axios from "axios";

const getManga = () => axios.get("/api/manga");

export default {
  getManga,
};
