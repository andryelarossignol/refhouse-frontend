import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/api',
});

// Este bloco anexa o token automaticamente em toda requisição se ele existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@Refhouse:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;