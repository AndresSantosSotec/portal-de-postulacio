import type { ApplicationStatus } from './types'

export const statusConfig = {
  under_review: {
    label: 'En Revisión',
    color: 'info',
    bgClass: 'bg-info text-info-foreground',
  },
  interview_scheduled: {
    label: 'Entrevista Programada',
    color: 'warning',
    bgClass: 'bg-warning text-warning-foreground',
  },
  hired: {
    label: 'Contratado',
    color: 'secondary',
    bgClass: 'bg-secondary text-secondary-foreground',
  },
  rejected: {
    label: 'Rechazado',
    color: 'destructive',
    bgClass: 'bg-destructive text-destructive-foreground',
  },
} as const

export function getStatusLabel(status: ApplicationStatus): string {
  return statusConfig[status].label
}

export function getStatusClass(status: ApplicationStatus): string {
  return statusConfig[status].bgClass
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateFileType(file: File): boolean {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  return allowedTypes.includes(file.type)
}

export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}
