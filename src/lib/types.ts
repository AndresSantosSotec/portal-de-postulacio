export type User = {
  id: string
  email: string
  name: string
  password: string
  avatar?: string
  cvFile?: string
  profile?: UserProfile
}

export type UserProfile = {
  fullName?: string
  dateOfBirth?: string
  phone?: string
  address?: string
  dpi?: string
  middleSchoolDegree?: string
  universityDegree?: string
  profession?: string
  additionalStudies?: string
  cvFile?: string
  linkedin?: string
  portfolio?: string
  workReferences?: WorkReference[]
  personalReferences?: PersonalReference[]
  location?: string
  bio?: string
  experience: WorkExperience[]
  education: Education[]
  skills: string[]
}

export type WorkReference = {
  id: string
  name: string
  company: string
  position: string
  phone: string
  email?: string
}

export type PersonalReference = {
  id: string
  name: string
  relationship: string
  phone: string
  email?: string
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

export type CustomQuestion = {
  id: string
  question: string
  type: 'text' | 'textarea' | 'number' | 'select'
  options?: string[]
  required: boolean
}

export type Job = {
  id: string
  title: string
  company: string
  location: string
  category: string
  description: string
  requirements: string[]
  salary?: string
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
  postedDate: string
  applicants: number
  imageUrl?: string
  customQuestions?: CustomQuestion[]
  isOccupied?: boolean
  occupiedDate?: string
}

export type ApplicationStatus = 
  | 'postulado'
  | 'cv-visto'
  | 'en-proceso'
  | 'finalista'
  | 'proceso-finalizado'

// Tipo para datos del backend
export type BackendApplication = {
  id: number
  estado: 'Postulado' | 'CV Visto' | 'En Proceso' | 'Finalista' | 'Rechazado' | 'Contratado'
  fecha_postulacion: string
  observaciones?: string
  oferta: {
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

// Tipo legacy para frontend (mantener compatibilidad)
export type Application = {
  id: string
  jobId: string
  userId: string
  status: ApplicationStatus
  appliedDate: string
  updatedDate: string
  customAnswers?: Record<string, string>
  quickApply?: boolean
  psychometricTestSent?: boolean
  psychometricTestSentDate?: string
  psychometricTestCompleted?: boolean
  psychometricTestCompletedDate?: string
  statusHistory?: ApplicationStatusHistory[]
  // Datos adicionales del backend
  observaciones?: string
  oferta?: {
    id: number
    titulo: string
    empresa: string
    ubicacion: string
    tipo_contrato: string
  }
}

export type ApplicationStatusHistory = {
  status: ApplicationStatus
  date: string
  note?: string
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
