import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para colocar o token automaticamente em todas as chamadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  console.log("[API] Token encontrado:", token ? "✅ Sim" : "❌ Não");
  
  if (token && token.trim()) {
    // Verifica se o token é válido (não vazio ou "undefined")
    if (token === "undefined" || token === "null" || token === "") {
      console.warn("[API] ⚠️ Token inválido encontrado. Removendo do localStorage...");
      localStorage.removeItem("token");
    } else {
      // Token válido - adiciona ao header
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[API] ✅ Token adicionado ao header");
      console.log("[API] Token preview:", token.substring(0, 20) + "...");
    }
  } else {
    console.warn("[API] ⚠️ Nenhum token encontrado no localStorage");
  }
  
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Interceptor para melhor tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Servidor respondeu com status fora do range 2xx
      console.error(`[API ERROR] Status: ${error.response.status}`);
      console.error(`[API ERROR] URL: ${error.config?.url}`);
      console.error(`[API ERROR] Message: ${error.message}`);
      // Log completo do body quando disponível (útil para 500)
      try {
        console.error("[API ERROR] Response data:", error.response.data);
      } catch (e) {
        console.error("[API ERROR] Não foi possível logar response.data", e);
      }
      
      if (error.response.status === 404) {
        console.error(`[API ERROR] Rota não encontrada: ${error.config?.url}`);
        console.error(`[API ERROR] Verifique se a rota existe no backend`);
      }
      
      if (error.response.status === 401) {
        console.error(`[API ERROR] Não autorizado. Token inválido ou expirado`);
        console.error(`[API ERROR] Response data:`, error.response.data);
        localStorage.removeItem("token");
        // Redireciona para login
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error(`[API ERROR] Nenhuma resposta do servidor`);
      console.error(`[API ERROR] Request:`, error.request);
    } else {
      console.error(`[API ERROR] Erro ao configurar requisição:`, error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
