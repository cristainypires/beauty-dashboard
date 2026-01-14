import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333", // Verifique se a porta do seu back-end é esta
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para colocar o token automaticamente em todas as chamadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Onde você guardou o token no login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;