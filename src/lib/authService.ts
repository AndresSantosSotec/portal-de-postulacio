import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  user_type: 'candidate' | 'recruiter';
  role?: string;
  phone?: string;
  avatar_url?: string;
  cv_file?: string;
  is_active: boolean;
  profile?: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
  user_type?: 'candidate' | 'recruiter';
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: 'candidate' | 'recruiter';
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  expires_in?: number;
  user?: User;
}

class AuthService {
  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      
      if (response.data.user) {
        this.setUser(response.data.user);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  }

  /**
   * Login de usuario del portal
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      
      if (response.data.user) {
        this.setUser(response.data.user);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await api.post('/portal/auth/logout');
    } catch (error) {
      console.error('Error al hacer logout:', error);
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Obtener usuario autenticado
   */
  async me(): Promise<User> {
    try {
      const response = await api.get<{ success: boolean; user: User }>('/portal/auth/me');
      
      if (response.data.user) {
        this.setUser(response.data.user);
      }
      
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario');
    }
  }

  /**
   * Refrescar token
   */
  async refreshToken(): Promise<string> {
    try {
      const response = await api.post<AuthResponse>('/portal/auth/refresh');
      
      if (response.data.token) {
        this.setToken(response.data.token);
        return response.data.token;
      }
      
      throw new Error('No se recibió token');
    } catch (error: any) {
      this.clearAuth();
      throw new Error(error.response?.data?.message || 'Error al refrescar token');
    }
  }

  /**
   * Guardar token en localStorage
   */
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Obtener token de localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Guardar usuario en localStorage
   */
  setUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  /**
   * Obtener usuario de localStorage
   */
  getUser(): User | null {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Limpiar datos de autenticación
   */
  clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }
}

export const authService = new AuthService();
