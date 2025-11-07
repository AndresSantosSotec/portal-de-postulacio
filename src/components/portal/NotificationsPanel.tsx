import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Bell, 
  CheckCircle, 
  Eye, 
  UserCircle,
  Trophy,
  X,
  Trash,
  CircleWavyCheck
} from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import type { User, Application, Job } from '@/lib/types'
import { statusLabels } from '@/lib/types'

export type Notification = {
  id: string
  userId: string
  type: 'status_change' | 'interview' | 'message' | 'system'
  title: string
  message: string
  applicationId?: string
  jobId?: string
  read: boolean
  createdDate: string
}

type NotificationsPanelProps = {
  user: User
  onViewJob?: (jobId: string) => void
  compact?: boolean
}

const notificationIcons = {
  status_change: CheckCircle,
  interview: UserCircle,
  message: Bell,
  system: CircleWavyCheck
}

const notificationColors = {
  status_change: 'text-secondary',
  interview: 'text-warning-foreground',
  message: 'text-primary',
  system: 'text-accent'
}

export default function NotificationsPanel({ user, onViewJob, compact = false }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])
  const [jobs] = useKV<Job[]>('jobs', [])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const userNotifications = (notifications || [])
    .filter(notif => notif.userId === user.id)
    .filter(notif => filter === 'all' || !notif.read)
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
    markAsRead(notif.id)
    if (notif.jobId && onViewJob) {
      onViewJob(notif.jobId)
    }
  }

  if (compact) {
    return (
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {userNotifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No tienes notificaciones
          </div>
        ) : (
          userNotifications.slice(0, 5).map((notif, index) => {
            const Icon = notificationIcons[notif.type]
            const colorClass = notificationColors[notif.type]
            
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-accent/5 ${!notif.read ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex gap-3">
                  <div className={`h-10 w-10 rounded-full bg-background flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon size={20} weight="duotone" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-sm line-clamp-1">{notif.title}</p>
                      {!notif.read && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {formatDistanceToNow(new Date(notif.createdDate), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell size={24} weight="duotone" />
                Notificaciones
                {unreadCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {unreadCount} nuevas
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Mantente al día con actualizaciones de tus postulaciones
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="gap-2"
            >
              Todas
              <Badge variant={filter === 'all' ? 'secondary' : 'outline'} className="ml-1">
                {userNotifications.length}
              </Badge>
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
              className="gap-2"
            >
              No leídas
              {unreadCount > 0 && (
                <Badge variant={filter === 'unread' ? 'secondary' : 'outline'} className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            {unreadCount > 0 && (
              <>
                <Separator orientation="vertical" className="h-8" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="gap-2"
                >
                  <CheckCircle size={16} weight="duotone" />
                  Marcar todas como leídas
                </Button>
              </>
            )}
            {userNotifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash size={16} weight="duotone" />
                Eliminar todas
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {userNotifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card>
            <CardContent className="py-20 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex h-20 w-20 rounded-full bg-primary/10 items-center justify-center mx-auto mb-4"
              >
                <Bell size={40} className="text-primary" weight="duotone" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">
                {filter === 'all' ? 'No tienes notificaciones' : 'No tienes notificaciones sin leer'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {filter === 'all' 
                  ? 'Te notificaremos cuando haya actualizaciones en tus postulaciones' 
                  : 'Todas tus notificaciones están al día'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {userNotifications.map((notif, index) => {
              const Icon = notificationIcons[notif.type]
              const colorClass = notificationColors[notif.type]
              const job = notif.jobId ? jobs?.find(j => j.id === notif.jobId) : null
              
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
                          
                          <div className="flex items-center gap-3 mt-3">
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notif.createdDate), { addSuffix: true, locale: es })}
                            </p>
                            
                            {!notif.read && (
                              <>
                                <Separator orientation="vertical" className="h-3" />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs"
                                  onClick={() => markAsRead(notif.id)}
                                >
                                  Marcar como leída
                                </Button>
                              </>
                            )}
                            
                            {notif.jobId && onViewJob && (
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
