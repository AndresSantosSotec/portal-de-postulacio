import api from './api'

export interface JobCategory {
  id: number
  name: string
  icon: string
  is_active: boolean
}

export interface Skill {
  id: number
  name: string
  level: string
  required: boolean
}

export interface Job {
  id: string
  title: string
  company: string
  description: string
  requirements: string[]
  salary: string
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
  location: string
  category: string
  imageUrl?: string
  postedDate: string
  applicants: number
  isOccupied?: boolean
  skills?: Skill[]
}

interface JobOffersResponse {
  success: boolean
  offers: Job[]
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

interface CategoriesResponse {
  success: boolean
  categories: JobCategory[]
}

interface JobDetailResponse {
  success: boolean
  offer: Job
}

class PublicJobService {
  /**
   * Obtener todas las categorías activas
   */
  async getCategories(): Promise<JobCategory[]> {
    try {
      const response = await api.get<CategoriesResponse>('/categorias')
      return response.data.categories || []
    } catch (error: any) {
      console.error('Error al obtener categorías:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener categorías')
    }
  }

  /**
   * Obtener ofertas laborales (solo activas y publicadas)
   */
  async getOffers(params?: {
    category_id?: number
    employment_type?: string
    location?: string
    per_page?: number
    page?: number
  }): Promise<JobOffersResponse> {
    try {
      const response = await api.get<JobOffersResponse>('/ofertas', { params })
      return response.data
    } catch (error: any) {
      console.error('Error al obtener ofertas:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener ofertas')
    }
  }

  /**
   * Obtener oferta específica por ID
   */
  async getOffer(id: number): Promise<Job> {
    try {
      const response = await api.get<JobDetailResponse>(`/ofertas/${id}`)
      return response.data.offer
    } catch (error: any) {
      console.error('Error al obtener oferta:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener oferta')
    }
  }
}

export const publicJobService = new PublicJobService()
export default publicJobService
