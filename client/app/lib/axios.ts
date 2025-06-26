import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL  || "https://taskforge-1-kl9n.onrender.com/api" ,
});

export default api;
