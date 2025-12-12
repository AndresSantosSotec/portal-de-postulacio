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
      const response = await api.post<any>('/auth/register', data);
      
      console.log('📦 [AUTH SERVICE] Respuesta de registro:', response.data);
      
      // El backend devuelve: { success, message, data: { user, token, ... } }
      const responseData = response.data;
      const token = responseData.data?.token || responseData.token;
      const user = responseData.data?.user || responseData.user;
      
      console.log('🔑 Token extraído:', token ? 'Sí' : 'No');
      console.log('👤 Usuario extraído:', user ? user.name : 'No encontrado');
      
      if (token) {
        this.setToken(token);
      }
      
      if (user) {
        this.setUser(user);
      }
      
      // Retornar en formato esperado
      return {
        success: responseData.success,
        message: responseData.message,
        token: token,
        expires_in: responseData.data?.expires_in || responseData.expires_in,
        user: user
      };
    } catch (error: any) {
      console.error('❌ [AUTH SERVICE] Error en registro:', error.response?.data);
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

  /**
   * Solicitar recuperación de contraseña
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string; debug?: any }> {
    try {
      const response = await api.post<{ success: boolean; message: string; debug?: any }>('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al enviar solicitud de recuperación');
    }
  }

  /**
   * Verificar token de reset
   */
  async verifyResetToken(email: string, token: string): Promise<{ valid: boolean; message: string }> {
    try {
      const response = await api.post<{ success: boolean; valid: boolean; message: string }>('/auth/verify-reset-token', { 
        email, 
        token 
      });
      return { valid: response.data.valid, message: response.data.message };
    } catch (error: any) {
      return { valid: false, message: error.response?.data?.message || 'Token inválido' };
    }
  }

  /**
   * Restablecer contraseña
   */
  async resetPassword(email: string, token: string, password: string, password_confirmation: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/reset-password', {
        email,
        token,
        password,
        password_confirmation
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al restablecer contraseña');
    }
  }

  /**
   * Cambiar contraseña (usuario autenticado)
   */
  async changePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cambiar la contraseña');
    }
  }
}

export const authService = new AuthService();
