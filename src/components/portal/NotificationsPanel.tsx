import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import {
  CheckCircle,
  UserCircle,
  CircleWavyCheckIcon,
  EnvelopeSimple,
  X
} from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import type { User, Job } from '@/lib/types'

export type Notification = {
  id: string
  userId: string
  type: 'status_change' | 'interview' | 'message' | 'system'
  title: string
  message: string
  jobId?: string
  read: boolean
  createdDate: string
}

type NotificationsPanelProps = {
  user: User
  compact?: boolean
  onViewJob?: (jobId: string) => void
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

export default function NotificationsPanel({ user, compact = false, onViewJob }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])
  const [jobs] = useKV<Job[]>('jobs', [])
  
  const userNotifications = (notifications || [])
    .filter(n => n.userId === user.id)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
  
  const unreadCount = notifications?.filter(n => n.userId === user.id && !n.read).length || 0

  const markAsRead = (notifId: string) => {
    setNotifications(current => 
      (current || []).map(n => 
        n.id === notifId ? { ...n, read: true } : n
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(current =>
      (current || []).map(n =>
        n.userId === user.id ? { ...n, read: true } : n
      )
    )
  }

  const deleteNotification = (notifId: string) => {
    setNotifications(current => 
      (current || []).filter(n => n.id !== notifId)
    )
  }

  const clearAll = () => {
    setNotifications(current =>
      (current || []).filter(n => n.userId !== user.id)
    )
  }

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.read) {
      markAsRead(notif.id)
    }
    if (notif.jobId && onViewJob) {
      onViewJob(notif.jobId)
    }
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
        {userNotifications.length > 0 && (
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

      {userNotifications.length === 0 ? (
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
            {userNotifications.map((notif, index) => {
              const Icon = notificationIcons[notif.type]
              const colorClass = notificationColors[notif.type]
              const job = notif.jobId ? (jobs || []).find(j => j.id === notif.jobId) : null
              
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
                    className={`transition-all duration-300 hover:shadow-md border-l-4 ${!notif.read ? 'bg-primary/5 border-l-primary' : 'border-l-transparent'}`}
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
                                <h4 className="font-semibold text-base">{notif.title}</h4>
                                {!notif.read && (
                                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {notif.message}
                              </p>
                              {job && (
                                <div className="mt-2 p-2 rounded-md bg-muted/50 inline-block">
                                  <p className="text-xs font-medium">{job.title}</p>
                                  <p className="text-xs text-muted-foreground">{job.company}</p>
                                </div>
                              )}
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

                          {notif.jobId && (
                            <div className="flex items-center gap-2 text-xs mt-3 pt-3 border-t">
                              <p className="text-muted-foreground">
                                {formatDistanceToNow(new Date(notif.createdDate), { addSuffix: true, locale: es })}
                              </p>
                              {onViewJob && (
                                <>
                                  <Separator orientation="vertical" className="h-3" />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 text-xs text-primary hover:text-primary"
                                    onClick={() => handleNotificationClick(notif)}
                                  >
                                    Ver empleo
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
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
