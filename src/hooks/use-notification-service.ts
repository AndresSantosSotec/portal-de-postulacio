import { useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { Application, Job } from '@/lib/types'
import type { Notification } from '@/components/portal/NotificationsPanel'
import { statusLabels } from '@/lib/types'

export function useNotificationService(userId: string | null) {
  const [applications] = useKV<Application[]>('applications', [])
  const [jobs] = useKV<Job[]>('jobs', [])
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])
  const previousApplicationsRef = useRef<Application[]>([])

  useEffect(() => {
    if (!userId || !applications) return

    const userApplications = applications.filter(app => app.userId === userId)
    const previousUserApplications = previousApplicationsRef.current.filter(app => app.userId === userId)

    if (previousUserApplications.length === 0) {
      previousApplicationsRef.current = applications
      return
    }

    userApplications.forEach(currentApp => {
      const previousApp = previousUserApplications.find(app => app.id === currentApp.id)
      
      if (previousApp && previousApp.status !== currentApp.status) {
        const job = jobs?.find(j => j.id === currentApp.jobId)
        
        const notificationMessages = {
          'postulado': {
            title: '¡Postulación enviada!',
            message: `Tu postulación para ${job?.title || 'el empleo'} ha sido registrada exitosamente.`
          },
          'cv-visto': {
            title: '¡Tu CV ha sido revisado!',
            message: `El reclutador de ${job?.company || 'la empresa'} ha visto tu currículum para ${job?.title || 'el empleo'}.`
          },
          'en-proceso': {
            title: '¡Estás en proceso!',
            message: `Tu candidatura para ${job?.title || 'el empleo'} en ${job?.company || 'la empresa'} está siendo evaluada activamente.`
          },
          'finalista': {
            title: '🎉 ¡Eres finalista!',
            message: `¡Felicitaciones! Has sido seleccionado como finalista para ${job?.title || 'el empleo'} en ${job?.company || 'la empresa'}.`
          },
          'proceso-finalizado': {
            title: 'Proceso finalizado',
            message: `El proceso de reclutamiento para ${job?.title || 'el empleo'} en ${job?.company || 'la empresa'} ha finalizado.`
          }
        }

        const notifData = notificationMessages[currentApp.status]
        
        const newNotification: Notification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: userId,
          type: 'status_change',
          title: notifData.title,
          message: notifData.message,
          jobId: currentApp.jobId,
          read: false,
          createdDate: new Date().toISOString()
        }

        setNotifications(current => [...(current || []), newNotification])

        const toastMessages = {
          'postulado': { icon: '✅', variant: 'default' as const },
          'cv-visto': { icon: '👁️', variant: 'default' as const },
          'en-proceso': { icon: '⏳', variant: 'default' as const },
          'finalista': { icon: '🎉', variant: 'default' as const },
          'proceso-finalizado': { icon: '✓', variant: 'default' as const }
        }

        const toastData = toastMessages[currentApp.status]
        toast.success(`${toastData.icon} ${notifData.title}`, {
          description: notifData.message,
          duration: 5000
        })
      }
    })

    previousApplicationsRef.current = applications
  }, [applications, userId, jobs, setNotifications])

  return {
    notificationCount: notifications?.filter(n => n.userId === userId && !n.read).length || 0
  }
}
