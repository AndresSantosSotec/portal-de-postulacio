export type User = {
  id: string
  email: string
  name: string
  password: string
  avatar?: string
  profile?: UserProfile
}

export type UserProfile = {
  phone?: string
  location?: string
  bio?: string
  experience: WorkExperience[]
  education: Education[]
  skills: string[]
}

export type WorkExperience = {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
}

export type Education = {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  current: boolean
}

export type JobCategory = 
  | 'desarrollo-software'
  | 'diseno'
  | 'marketing'
  | 'ventas'
  | 'atencion-cliente'
  | 'recursos-humanos'
  | 'contabilidad'
  | 'administracion'
  | 'ingenieria'
  | 'educacion'
  | 'salud'
  | 'construccion'
  | 'otros'

export type Job = {
  id: string
  title: string
  company: string
  location: string
  category: JobCategory
  description: string
  requirements: string[]
  salary?: string
  type: 'full-time' | 'part-time' | 'contract' | 'freelance'
  postedDate: string
  applicants: number
}

export type ApplicationStatus = 
  | 'postulado'
  | 'cv-visto'
  | 'en-proceso'
  | 'finalista'
  | 'proceso-finalizado'

export type Application = {
  id: string
  jobId: string
  userId: string
  status: ApplicationStatus
  appliedDate: string
  updatedDate: string
}

export type JobAlert = {
  id: string
  userId: string
  category?: JobCategory
  location?: string
  keywords?: string
  createdDate: string
}

export const categoryLabels: Record<JobCategory, string> = {
  'desarrollo-software': 'Desarrollo de Software',
  'diseno': 'Diseño',
  'marketing': 'Marketing',
  'ventas': 'Ventas',
  'atencion-cliente': 'Atención al Cliente',
  'recursos-humanos': 'Recursos Humanos',
  'contabilidad': 'Contabilidad',
  'administracion': 'Administración',
  'ingenieria': 'Ingeniería',
  'educacion': 'Educación',
  'salud': 'Salud',
  'construccion': 'Construcción',
  'otros': 'Otros'
}

export const statusLabels: Record<ApplicationStatus, string> = {
  'postulado': 'Postulado',
  'cv-visto': 'CV Visto',
  'en-proceso': 'En Proceso',
  'finalista': 'Finalista',
  'proceso-finalizado': 'Proceso Finalizado'
}
