export type ApplicationStatus = 
  | 'under_review' 
  | 'interview_scheduled' 
  | 'hired' 
  | 'rejected'

export interface Job {
  id: string
  title: string
  location: string
  area: string
  contractType: 'full-time' | 'part-time' | 'contract' | 'internship'
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead'
  description: string
  requirements: string[]
  benefits: string[]
  salary?: string
  workSchedule: string
  isActive: boolean
  postedDate: string
}

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  cvUrl?: string
  linkedIn?: string
  portfolio?: string
  experience?: string
  education?: string
  skills?: string[]
}

export interface Application {
  id: string
  jobId: string
  jobTitle: string
  userId: string
  status: ApplicationStatus
  appliedDate: string
  lastUpdated: string
  notes?: string
  interviewDate?: string
}

export interface Notification {
  id: string
  userId: string
  applicationId: string
  message: string
  date: string
  read: boolean
}
