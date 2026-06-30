import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});

// Esse interceptor anexa o token automaticamente em todas as chamadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor de Resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 && error.response?.data?.code === 'SUBSCRIPTION_PAST_DUE') {
      // O redirect forçado foi removido para permitir o acesso "Somente Leitura" (Freemium Look-around)
      console.warn("Acesso bloqueado: Assinatura pendente.");
    }
    return Promise.reject(error);
  }
);
