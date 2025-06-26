import axios from "axios";

const api = axios.create({
  baseURL:"https://taskforge-1-kl9n.onrender.com/api" ,
});

export default api;
