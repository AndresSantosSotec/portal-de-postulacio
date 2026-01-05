import axios from 'axios';

// URL base del backend desde variables de entorno
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://oportunidadescoosanjer.com.gt';
export const API_BASE_URL = import.meta.env.VITE_API_URL || `${BACKEND_URL}/api/v1`;

// Configuración base de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Convierte una ruta relativa del storage a URL absoluta
 * @param path - Ruta relativa como "/storage/gallery/image.jpg"
 * @returns URL absoluta como "https://oportunidadescoosanjer.com.gt/storage/gallery/image.jpg"
 */
export const getStorageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  
  // Si ya es una URL completa, retornarla tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Si empieza con /, quitar la barra inicial
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  return `${BACKEND_URL}/${cleanPath}`;
};

// Interceptor para agregar el token JWT a todas las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
