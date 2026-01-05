import axios from 'axios'
import type { ApplicationStatus } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'https://oportunidadescoosanjer.com.gt/api/v1'

// Configurar interceptor para incluir token JWT
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de autenticación (sesión expirada)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      
      // Mostrar alerta al usuario
      const event = new CustomEvent('auth:expired', { 
        detail: { message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' } 
      })
      window.dispatchEvent(event)
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    }
    return Promise.reject(error)
  }
)

// Tipos
export interface CVData {
  id: number
  nombre_archivo: string
  url: string
  formato: 'pdf' | 'docx'
  fecha_subida: string
}

export interface Application {
  id: number
  oferta_id: number
  estado: 'Postulado' | 'CV Visto' | 'En Proceso' | 'Finalista' | 'Rechazado' | 'Contratado'
  fecha_postulacion: string
  observaciones?: string
  oferta?: {
    id: number
    titulo: string
    empresa: string
    ubicacion: string
    tipo_contrato: string
  }
  cv?: {
    id: number
    nombre_archivo: string
    url: string
    formato: 'pdf' | 'docx'
  }
}

export interface Favorite {
  id: number
  oferta_id: number
  titulo: string
  empresa: string
  ubicacion: string
  tipo_contrato: string
  salario_min?: number
  salario_max?: number
  imagen_url?: string
  fecha_agregado: string
}

export interface CandidateProfile {
  id: number
  nombre_completo: string
  fecha_nacimiento?: string
  dpi?: string
  telefono?: string
  direccion?: string
  ubicacion?: string
  profesion?: string
  bio?: string
  linkedin_url?: string
  portfolio_url?: string
  foto_perfil_url?: string  // URL de la foto de perfil
  educaciones?: Education[]
  experiencias?: Experience[]
  titulos?: any[]
  habilidades?: Skill[]
  referencias_laborales?: any[]
  referencias_personales?: any[]
}

export interface Experience {
  id: number
  empresa: string
  puesto: string
  fecha_inicio: string | null  // Puede ser string o null
  fecha_fin?: string | null  // Puede ser undefined o null
  es_actual: boolean
  descripcion?: string
  ubicacion?: string
}

export interface Education {
  id: number
  institucion: string
  titulo: string
  campo_estudio_id?: number
  fecha_inicio: string | null  // Puede ser string o null
  fecha_fin?: string | null  // Puede ser undefined o null
  es_actual: boolean
  descripcion?: string
}

export interface Skill {
  id: number
  nombre: string
  nivel?: 'Básico' | 'Intermedio' | 'Avanzado' 
  certificada?: boolean
}

export interface PublicSkill {
  id: number
  nombre: string
  descripcion?: string
  categoria?: string
}

// Nuevas interfaces para Educación y Títulos
export interface Educacion {
  id_educacion?: number
  postulante_id?: number
  institucion: string
  titulo_obtenido: string
  nivel: 'Medio' | 'Técnico' | 'Universitario' | 'Maestría' | 'Doctorado'
  campo_estudio_id?: number | null
  fecha_inicio: string
  fecha_fin?: string | null
  descripcion?: string | null
  created_at?: string
  updated_at?: string
}

export interface Titulo {
  id_titulo?: number
  postulante_id?: number
  nombre_titulo: string
  tipo: 'Licenciatura' | 'Maestría' | 'Técnico' | 'Certificación' | 'Diplomado' | 'Otro'
  institucion: string
  fecha_obtencion: string
  created_at?: string
  updated_at?: string
}

// Nuevas interfaces para Referencias
export interface ReferenciaLaboral {
  id_ref_lab?: number
  postulante_id?: number
  nombre: string
  empresa: string
  cargo: string
  telefono: string
  email?: string | null
  relacion?: string | null
  created_at?: string
  updated_at?: string
}

export interface ReferenciaPersonal {
  id_ref_per?: number
  postulante_id?: number
  nombre: string
  relacion: string
  telefono: string
  email?: string | null
  created_at?: string
  updated_at?: string
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}

class ApplicationService {
  /**
   * Subir CV del postulante
   */
  async uploadCV(file: File): Promise<CVData> {
    const formData = new FormData()
    formData.append('cv', file)

    const response = await apiClient.post<ApiResponse<CVData>>(
      '/candidate/cv/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al subir CV')
    }

    return response.data.data
  }

  /**
   * Obtener CV más reciente
   */
  async getLatestCV(): Promise<CVData | null> {
    const response = await apiClient.get<ApiResponse<CVData | null>>('/candidate/cv')

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener CV')
    }

    return response.data.data || null
  }

  /**
   * Postular a un empleo
   */
  async applyToJob(ofertaId: number, observaciones?: string): Promise<Application> {
    const response = await apiClient.post<ApiResponse<Application>>('/applications', {
      oferta_id: ofertaId,
      observaciones,
    })

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al postular')
    }

    return response.data.data
  }

  /**
   * Obtener mis postulaciones
   */
  async getMyApplications(): Promise<Application[]> {
    const response = await apiClient.get<ApiResponse<Application[]>>('/applications')

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener postulaciones')
    }

    return response.data.data || []
  }

  /**
   * Retirar postulación
   */
  async withdrawApplication(applicationId: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/applications/${applicationId}`)

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al retirar postulación')
    }
  }

  /**
   * Verificar si ya se postuló a una oferta
   */
  async checkApplication(ofertaId: number): Promise<{
    has_applied: boolean
    application?: {
      id: number
      estado: string
      fecha_postulacion: string
      oferta: {
        id: number
        titulo: string
        empresa: string
      }
    }
  }> {
    const response = await apiClient.get<ApiResponse<{
      has_applied: boolean
      application?: any
    }>>(`/applications/check/${ofertaId}`)

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al verificar postulación')
    }

    return response.data.data || { has_applied: false }
  }

  /**
   * Agregar empleo a favoritos
   */
  async addFavorite(ofertaId: number): Promise<{ id: number; oferta_id: number }> {
    const response = await apiClient.post<ApiResponse<{ id: number; oferta_id: number }>>(
      '/favorites',
      { oferta_id: ofertaId }
    )

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al agregar a favoritos')
    }

    return response.data.data
  }

  /**
   * Eliminar empleo de favoritos
   */
  async removeFavorite(ofertaId: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/favorites/${ofertaId}`)

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al eliminar de favoritos')
    }
  }

  /**
   * Obtener mis favoritos
   */
  async getFavorites(): Promise<Favorite[]> {
    const response = await apiClient.get<ApiResponse<Favorite[]>>('/favorites')

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener favoritos')
    }

    return response.data.data || []
  }

  /**
   * Verificar si un empleo está en favoritos
   */
  async checkFavorite(ofertaId: number): Promise<boolean> {
    const response = await apiClient.get<ApiResponse<{ is_favorite: boolean }>>(
      `/favorites/check/${ofertaId}`
    )

    if (!response.data.success) {
      return false
    }

    return response.data.data?.is_favorite || false
  }

  /**
   * Obtener perfil completo del postulante
   */
  async getProfile(): Promise<CandidateProfile> {
    const response = await apiClient.get<ApiResponse<CandidateProfile>>('/candidate/profile')

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al obtener perfil')
    }

    return response.data.data
  }

  /**
   * Actualizar datos personales del postulante
   */
  async updateProfile(data: Partial<CandidateProfile>): Promise<CandidateProfile> {
    const response = await apiClient.put<ApiResponse<CandidateProfile>>('/candidate/profile', data)

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar perfil')
    }

    return response.data.data
  }

  /**
   * Agregar experiencia laboral
   */
  async addExperience(data: Omit<Experience, 'id'>): Promise<Experience> {
    const response = await apiClient.post<ApiResponse<Experience>>('/candidate/profile/experience', data)

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al agregar experiencia')
    }

    return response.data.data
  }

  /**
   * Actualizar experiencia laboral
   */
  async updateExperience(id: number, data: Partial<Experience>): Promise<Experience> {
    const response = await apiClient.put<ApiResponse<Experience>>(`/candidate/profile/experience/${id}`, data)

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar experiencia')
    }

    return response.data.data
  }

  /**
   * Eliminar experiencia laboral
   */
  async deleteExperience(id: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/candidate/profile/experience/${id}`)

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al eliminar experiencia')
    }
  }

  /**
   * Agregar educación
   */
  async addEducation(data: Omit<Education, 'id'>): Promise<Education> {
    const response = await apiClient.post<ApiResponse<Education>>('/candidate/profile/education', data)

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al agregar educación')
    }

    return response.data.data
  }

  /**
   * Actualizar educación
   */
  async updateEducation(id: number, data: Partial<Education>): Promise<Education> {
    const response = await apiClient.put<ApiResponse<Education>>(`/candidate/profile/education/${id}`, data)

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar educación')
    }

    return response.data.data
  }

  /**
   * Eliminar educación
   */
  async deleteEducation(id: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/candidate/profile/education/${id}`)

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al eliminar educación')
    }
  }

  /**
   * Actualizar habilidades del postulante
   */
  async updateSkills(skills: Array<{ habilidad_id: number; nivel?: string; certificada?: boolean }>): Promise<Skill[]> {
    const response = await apiClient.put<ApiResponse<{ skills: Skill[] }>>('/candidate/profile/skills', { skills })

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar habilidades')
    }
    
    return response.data.data.skills
  }

  /**
   * Obtener lista pública de habilidades disponibles
   */
  async getPublicSkills(): Promise<PublicSkill[]> {
    const response = await apiClient.get<ApiResponse<PublicSkill[]>>('/habilidades')

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener habilidades')
    }

    return response.data.data || []
  }

  /**
   * Subir foto de perfil del postulante
   */
  async uploadProfilePhoto(file: File): Promise<{ avatar_url: string; path: string }> {
    const formData = new FormData()
    formData.append('photo', file)

    const response = await apiClient.post<ApiResponse<{ avatar_url: string; path: string }>>(
      '/candidate/profile/photo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al subir foto de perfil')
    }

    return response.data.data
  }

  /**
   * Obtener perfil completo del postulante (datos de user + postulante)
   */
  async getCompleteProfile(): Promise<{
    user: {
      id: number
      name: string
      email: string
      avatar_url: string | null
    }
    postulante: CandidateProfile | null
  }> {
    const response = await apiClient.get<ApiResponse<{
      user: {
        id: number
        name: string
        email: string
        avatar_url: string | null
      }
      postulante: CandidateProfile | null
    }>>('/candidate/profile/complete')

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al obtener perfil completo')
    }

    return response.data.data
  }

  // ============ MÉTODOS PARA EDUCACIÓN ============

  /**
   * Obtener lista de educación del postulante
   */
  async getEducaciones(): Promise<Educacion[]> {
    const response = await apiClient.get<ApiResponse<Educacion[]>>('/candidate/educacion')
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener educación')
    }
    
    return response.data.data || []
  }

  /**
   * Crear nueva educación
   */
  async createEducacion(data: Omit<Educacion, 'id_educacion' | 'postulante_id' | 'created_at' | 'updated_at'>): Promise<Educacion> {
    const response = await apiClient.post<ApiResponse<Educacion>>('/candidate/educacion', data)
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al crear educación')
    }
    
    return response.data.data
  }

  /**
   * Actualizar educación existente
   */
  async updateEducacion(id: number, data: Partial<Educacion>): Promise<Educacion> {
    const response = await apiClient.put<ApiResponse<Educacion>>(`/candidate/educacion/${id}`, data)
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar educación')
    }
    
    return response.data.data
  }

  /**
   * Eliminar educación
   */
  async deleteEducacion(id: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/candidate/educacion/${id}`)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al eliminar educación')
    }
  }

  // ============ MÉTODOS PARA TÍTULOS ============

  /**
   * Obtener lista de títulos del postulante
   */
  async getTitulos(): Promise<Titulo[]> {
    const response = await apiClient.get<ApiResponse<Titulo[]>>('/candidate/titulos')
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener títulos')
    }
    
    return response.data.data || []
  }

  /**
   * Crear nuevo título
   */
  async createTitulo(data: Omit<Titulo, 'id_titulo' | 'postulante_id' | 'created_at' | 'updated_at'>): Promise<Titulo> {
    const response = await apiClient.post<ApiResponse<Titulo>>('/candidate/titulos', data)
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al crear título')
    }
    
    return response.data.data
  }

  /**
   * Actualizar título existente
   */
  async updateTitulo(id: number, data: Partial<Titulo>): Promise<Titulo> {
    const response = await apiClient.put<ApiResponse<Titulo>>(`/candidate/titulos/${id}`, data)
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar título')
    }
    
    return response.data.data
  }

  /**
   * Eliminar título
   */
  async deleteTitulo(id: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/candidate/titulos/${id}`)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al eliminar título')
    }
  }

  // ============ MÉTODOS PARA REFERENCIAS LABORALES ============

  /**
   * Obtener lista de referencias laborales
   */
  async getReferenciasLaborales(): Promise<ReferenciaLaboral[]> {
    const response = await apiClient.get<ApiResponse<ReferenciaLaboral[]>>('/candidate/referencias/laborales')
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener referencias laborales')
    }
    
    return response.data.data || []
  }

  /**
   * Crear nueva referencia laboral
   */
  async createReferenciaLaboral(data: Omit<ReferenciaLaboral, 'id_ref_lab' | 'postulante_id' | 'created_at' | 'updated_at'>): Promise<ReferenciaLaboral> {
    const response = await apiClient.post<ApiResponse<ReferenciaLaboral>>('/candidate/referencias/laborales', data)
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al crear referencia laboral')
    }
    
    return response.data.data
  }

  /**
   * Actualizar referencia laboral existente
   */
  async updateReferenciaLaboral(id: number, data: Partial<ReferenciaLaboral>): Promise<ReferenciaLaboral> {
    const response = await apiClient.put<ApiResponse<ReferenciaLaboral>>(`/candidate/referencias/laborales/${id}`, data)
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar referencia laboral')
    }
    
    return response.data.data
  }

  /**
   * Eliminar referencia laboral
   */
  async deleteReferenciaLaboral(id: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/candidate/referencias/laborales/${id}`)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al eliminar referencia laboral')
    }
  }

  // ============ MÉTODOS PARA REFERENCIAS PERSONALES ============

  /**
   * Obtener lista de referencias personales
   */
  async getReferenciasPersonales(): Promise<ReferenciaPersonal[]> {
    const response = await apiClient.get<ApiResponse<ReferenciaPersonal[]>>('/candidate/referencias/personales')
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener referencias personales')
    }
    
    return response.data.data || []
  }

  /**
   * Crear nueva referencia personal
   */
  async createReferenciaPersonal(data: Omit<ReferenciaPersonal, 'id_ref_per' | 'postulante_id' | 'created_at' | 'updated_at'>): Promise<ReferenciaPersonal> {
    const response = await apiClient.post<ApiResponse<ReferenciaPersonal>>('/candidate/referencias/personales', data)
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al crear referencia personal')
    }
    
    return response.data.data
  }

  /**
   * Actualizar referencia personal existente
   */
  async updateReferenciaPersonal(id: number, data: Partial<ReferenciaPersonal>): Promise<ReferenciaPersonal> {
    const response = await apiClient.put<ApiResponse<ReferenciaPersonal>>(`/candidate/referencias/personales/${id}`, data)
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar referencia personal')
    }
    
    return response.data.data
  }

  /**
   * Eliminar referencia personal
   */
  async deleteReferenciaPersonal(id: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/candidate/referencias/personales/${id}`)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al eliminar referencia personal')
    }
  }

  // ============ MÉTODOS DE AUTENTICACIÓN Y REGISTRO ============

  /**
   * Registrar nuevo candidato con perfil completo
   */
  async registerCandidate(data: {
    name: string
    email: string
    password: string
    password_confirmation: string
    // Datos personales opcionales
    fecha_nacimiento?: string
    dpi?: string
    telefono?: string
    direccion?: string
    profesion?: string
  }): Promise<{ success: boolean; message: string; user: any; token?: string }> {
    const response = await apiClient.post<ApiResponse<any>>('/auth/register', {
      ...data,
      user_type: 'candidate'
    })

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al registrar usuario')
    }

    // Si el backend devuelve token, guardarlo
    if (response.data.data?.token) {
      localStorage.setItem('auth_token', response.data.data.token)
    }

    return {
      success: true,
      message: response.data.message || 'Registro exitoso',
      user: response.data.data?.user || response.data.data,
      token: response.data.data?.token
    }
  }

  /**
   * Completar perfil después del registro
   */
  async completeProfile(data: {
    nombre_completo?: string
    fecha_nacimiento?: string
    dpi?: string
    telefono?: string
    direccion?: string
    profesion?: string
    linkedin_url?: string
    portfolio_url?: string
  }): Promise<CandidateProfile> {
    const response = await apiClient.put<ApiResponse<CandidateProfile>>('/candidate/profile', data)

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al completar perfil')
    }

    return response.data.data
  }
}

export const applicationService = new ApplicationService()
