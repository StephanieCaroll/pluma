import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // URL base do seu backend
  timeout: 10000, // timeout de 10 segundos
});

// Interceptor para requisições
api.interceptors.request.use(config => {
  // Você pode adicionar headers globais aqui
  const token = localStorage.getItem('token'); // Exemplo com autenticação
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Configuração especial para FormData
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para respostas
api.interceptors.response.use(response => {
  return response;
}, error => {
  // Tratamento global de erros
  if (error.response) {
    console.error('Erro na resposta:', error.response.status, error.response.data);
  } else {
    console.error('Erro na requisição:', error.message);
  }
  return Promise.reject(error);
});

export default api;