import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token')
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }
}

export interface JobAlert {
  id: number
  categoria: {
    id: number
    nombre: string
  } | null
  ubicacion: string | null
  tipo_empleo: string | null
  salario_minimo: number | null
  palabras_clave: string[] | null
  frecuencia: 'inmediata' | 'diaria' | 'semanal'
  activo: boolean
  email_notificacion: boolean
  notificacion_interna: boolean
  created_at: string
}

export interface SuggestedJob {
  id: number
  job: {
    id: number
    titulo: string
    empresa: string
    ubicacion: string
    tipo_empleo: string
    descripcion: string
    categoria: {
      id: number
      nombre: string
    } | null
  }
  notas: string | null
  estado: 'pendiente' | 'visto' | 'aplicado' | 'descartado'
  sugerido_por: string
  fecha: string
}

export interface Notification {
  id: number
  titulo: string
  mensaje: string
  tipo: 'Sistema' | 'Postulación' | 'Recordatorio' | 'Alerta'
  leido: boolean
  fecha: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  count?: number
}

class NotificationService {
  /**
   * Obtener todas las notificaciones
   */
  async getNotifications(): Promise<Notification[]> {
    const response = await axios.get<ApiResponse<Notification[]>>(`${API_URL}/notifications`, getAuthHeaders())
    return response.data.data || []
  }

  /**
   * Obtener notificaciones no leídas
   */
  async getUnreadNotifications(): Promise<{ notifications: Notification[], count: number }> {
    const response = await axios.get<ApiResponse<Notification[]> & { count: number }>(`${API_URL}/notifications/unread`, getAuthHeaders())
    return {
      notifications: response.data.data || [],
      count: response.data.count || 0
    }
  }

  /**
   * Marcar notificación como leída
   */
  async markAsRead(notificationId: number): Promise<void> {
    await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, getAuthHeaders())
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead(): Promise<void> {
    await axios.put(`${API_URL}/notifications/read-all`, {}, getAuthHeaders())
  }

  /**
   * Eliminar notificación individual
   */
  async deleteNotification(notificationId: number): Promise<void> {
    await axios.delete(`${API_URL}/notifications/${notificationId}`, getAuthHeaders())
  }

  /**
   * Eliminar todas las notificaciones
   */
  async clearAll(): Promise<{ deleted_count: number }> {
    const response = await axios.delete<ApiResponse<{ deleted_count: number }>>(`${API_URL}/notifications`, getAuthHeaders())
    return response.data.data || { deleted_count: 0 }
  }

  /**
   * Obtener vacantes sugeridas
   */
  async getSuggestedJobs(): Promise<SuggestedJob[]> {
    const response = await axios.get<ApiResponse<SuggestedJob[]>>(`${API_URL}/notifications/suggested-jobs`, getAuthHeaders())
    return response.data.data || []
  }

  /**
   * Actualizar estado de vacante sugerida
   */
  async updateSuggestedJobStatus(id: number, estado: 'visto' | 'aplicado' | 'descartado'): Promise<void> {
    await axios.put(`${API_URL}/notifications/suggested-jobs/${id}`, { estado }, getAuthHeaders())
  }
}

class JobAlertService {
  /**
   * Obtener alertas de empleo
   */
  async getAlerts(): Promise<JobAlert[]> {
    const response = await axios.get<ApiResponse<JobAlert[]>>(`${API_URL}/job-alerts`, getAuthHeaders())
    return response.data.data || []
  }

  /**
   * Crear alerta de empleo
   */
  async createAlert(data: {
    categoria_id?: number
    ubicacion?: string
    tipo_empleo?: string
    salario_minimo?: number
    palabras_clave?: string[]
    frecuencia?: 'inmediata' | 'diaria' | 'semanal'
    email_notificacion?: boolean
    notificacion_interna?: boolean
  }): Promise<JobAlert> {
    const response = await axios.post<ApiResponse<JobAlert>>(`${API_URL}/job-alerts`, data, getAuthHeaders())
    return response.data.data
  }

  /**
   * Actualizar alerta de empleo
   */
  async updateAlert(id: number, data: Partial<JobAlert>): Promise<JobAlert> {
    const response = await axios.put<ApiResponse<JobAlert>>(`${API_URL}/job-alerts/${id}`, data, getAuthHeaders())
    return response.data.data
  }

  /**
   * Eliminar alerta de empleo
   */
  async deleteAlert(id: number): Promise<void> {
    await axios.delete(`${API_URL}/job-alerts/${id}`, getAuthHeaders())
  }

  /**
   * Activar/desactivar alerta
   */
  async toggleAlert(id: number): Promise<JobAlert> {
    const response = await axios.post<ApiResponse<JobAlert>>(`${API_URL}/job-alerts/${id}/toggle`, {}, getAuthHeaders())
    return response.data.data
  }
}

export const notificationService = new NotificationService()
export const jobAlertService = new JobAlertService()
