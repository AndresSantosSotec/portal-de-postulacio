import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import {
  CheckCircle,
  UserCircle,
  CircleWavyCheckIcon,
  EnvelopeSimple,
  X,
  Bell
} from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { notificationService, type Notification } from '@/lib/notificationService'
import { toast } from 'sonner'

type NotificationsPanelProps = {
  user: { id: string | number }
  compact?: boolean
  onViewJob?: (jobId: string) => void
  onNotificationUpdate?: () => void
}

// Mapeo de tipos del backend al frontend
const mapBackendTypeToFrontend = (tipo: string): 'status_change' | 'interview' | 'message' | 'system' => {
  switch (tipo) {
    case 'Postulación':
      return 'status_change'
    case 'Recordatorio':
      return 'interview'
    case 'Alerta':
      return 'message'
    default:
      return 'system'
  }
}

const notificationIcons = {
  status_change: CheckCircle,
  interview: UserCircle,
  message: EnvelopeSimple,
  system: CircleWavyCheckIcon
}

const notificationColors = {
  status_change: 'text-secondary',
  interview: 'text-accent',
  message: 'text-primary',
  system: 'text-muted-foreground'
}

export default function NotificationsPanel({ user, compact = false, onViewJob, onNotificationUpdate }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setError(null)
      const data = await notificationService.getNotifications()
      console.log('📬 [NotificationsPanel] Notificaciones cargadas:', data.length)
      setNotifications(data)
    } catch (err: any) {
      console.error('❌ [NotificationsPanel] Error al cargar notificaciones:', err)
      setError(err.response?.data?.message || 'Error al cargar notificaciones')
      toast.error('Error al cargar notificaciones')
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar notificaciones al montar y cada 30 segundos (polling)
  useEffect(() => {
    fetchNotifications()
    
    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000) // Actualizar cada 30 segundos

    return () => clearInterval(interval)
  }, [fetchNotifications])

  const unreadCount = notifications.filter(n => !n.leido).length

  const markAsRead = async (notifId: number) => {
    try {
      await notificationService.markAsRead(notifId)
      setNotifications(prev => 
        prev.map(n => 
          n.id === notifId ? { ...n, leido: true } : n
        )
      )
      onNotificationUpdate?.()
    } catch (err: any) {
      console.error('Error al marcar como leída:', err)
      toast.error('Error al marcar notificación como leída')
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, leido: true })))
      toast.success('Todas las notificaciones marcadas como leídas')
      onNotificationUpdate?.()
    } catch (err: any) {
      console.error('Error al marcar todas como leídas:', err)
      toast.error('Error al marcar todas como leídas')
    }
  }

  const deleteNotification = async (notifId: number) => {
    try {
      await notificationService.deleteNotification(notifId)
      setNotifications(prev => prev.filter(n => n.id !== notifId))
      toast.success('Notificación eliminada')
      onNotificationUpdate?.()
    } catch (err: any) {
      console.error('Error al eliminar notificación:', err)
      toast.error('Error al eliminar notificación')
    }
  }

  const clearAll = async () => {
    try {
      await notificationService.clearAll()
      setNotifications([])
      toast.success('Todas las notificaciones eliminadas')
      onNotificationUpdate?.()
    } catch (err: any) {
      console.error('Error al limpiar todas:', err)
      toast.error('Error al limpiar notificaciones')
    }
  }

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.leido) {
      markAsRead(notif.id)
    }
    // Si hay jobId en el mensaje, extraerlo o usar otro método
    // Por ahora, solo marcamos como leída
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Bell size={48} className="mx-auto text-muted-foreground mb-4 animate-pulse" weight="duotone" />
            <p className="text-sm text-muted-foreground">Cargando notificaciones...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <CircleWavyCheckIcon size={48} className="mx-auto text-destructive mb-4" weight="duotone" />
            <h4 className="font-semibold mb-2 text-destructive">Error al cargar notificaciones</h4>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchNotifications} variant="outline" size="sm">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Notificaciones</h3>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Marcar todas como leídas
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={clearAll}>
              Limpiar todo
            </Button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <CircleWavyCheckIcon size={48} className="mx-auto text-muted-foreground mb-4" weight="duotone" />
              <h4 className="font-semibold mb-2">No tienes notificaciones</h4>
              <p className="text-sm text-muted-foreground">
                Cuando haya novedades sobre tus postulaciones, te avisaremos aquí
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {notifications.map((notif, index) => {
              const frontendType = mapBackendTypeToFrontend(notif.tipo)
              const Icon = notificationIcons[frontendType]
              const colorClass = notificationColors[frontendType]
              
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.03 }}
                  layout
                >
                  <Card 
                    className={`transition-all duration-300 hover:shadow-md border-l-4 ${!notif.leido ? 'bg-primary/5 border-l-primary' : 'border-l-transparent'}`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className={`h-12 w-12 rounded-full bg-background border-2 flex items-center justify-center shrink-0 ${colorClass}`}>
                          <Icon size={24} weight="duotone" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-base">{notif.titulo}</h4>
                                {!notif.leido && (
                                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {notif.mensaje}
                              </p>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 shrink-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notif.id)
                              }}
                            >
                              <X size={16} />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2 text-xs mt-3 pt-3 border-t">
                            <p className="text-muted-foreground">
                              {formatDistanceToNow(new Date(notif.fecha), { addSuffix: true, locale: es })}
                            </p>
                            <Separator orientation="vertical" className="h-3" />
                            <span className="text-muted-foreground capitalize">{notif.tipo}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}