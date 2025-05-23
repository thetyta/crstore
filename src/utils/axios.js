import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333", // ajuste se necessário
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export { api };