import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CheckCircle,
  UserCircle,
  CircleWavyCheckIcon,
  EnvelopeSimple,
  X,
  Bell,
  CaretLeft,
  CaretRight,
  FunnelSimple,
  ArrowClockwise
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
    case 'Manual':
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
  status_change: 'text-green-600',
  interview: 'text-blue-600',
  message: 'text-primary',
  system: 'text-muted-foreground'
}

const NOTIFICATION_TYPES = [
  { value: 'all', label: 'Todas' },
  { value: 'Sistema', label: 'Sistema' },
  { value: 'Postulación', label: 'Postulación' },
  { value: 'Recordatorio', label: 'Recordatorio' },
  { value: 'Alerta', label: 'Alerta' },
  { value: 'Manual', label: 'Mensaje' },
]

const PER_PAGE_OPTIONS = [5, 10, 20]

export default function NotificationsPanel({ user, compact = false, onViewJob, onNotificationUpdate }: NotificationsPanelProps) {
  // Estado principal
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)

  // Filtros
  const [filterType, setFilterType] = useState('all')
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)

  const fetchNotifications = useCallback(async (showLoadingState = true) => {
    try {
      setError(null)
      if (showLoadingState) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      const result = await notificationService.getNotifications({
        page: currentPage,
        per_page: perPage,
        tipo: filterType === 'all' ? undefined : filterType,
        solo_no_leidas: showOnlyUnread,
      })

      console.log('📬 [NotificationsPanel] Notificaciones cargadas:', {
        count: result.notifications.length,
        total: result.pagination.total,
        page: result.pagination.currentPage,
      })

      setNotifications(result.notifications)
      setLastPage(result.pagination.lastPage)
      setTotal(result.pagination.total)
      setUnreadCount(result.unreadCount)
    } catch (err: any) {
      console.error('❌ [NotificationsPanel] Error al cargar notificaciones:', err)
      setError(err.response?.data?.message || 'Error al cargar notificaciones')
      if (showLoadingState) {
        toast.error('Error al cargar notificaciones')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [currentPage, perPage, filterType, showOnlyUnread])

  // Cargar notificaciones al montar y cuando cambian los filtros/paginación
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Polling cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications(false)
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [filterType, showOnlyUnread, perPage])

  const markAsRead = async (notifId: number) => {
    try {
      await notificationService.markAsRead(notifId)
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, leido: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
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
      setUnreadCount(0)
      toast.success('Todas las notificaciones marcadas como leídas')
      onNotificationUpdate?.()
    } catch (err: any) {
      console.error('Error al marcar todas como leídas:', err)
      toast.error('Error al marcar todas como leídas')
    }
  }

  const deleteNotification = async (notifId: number) => {
    try {
      const notif = notifications.find(n => n.id === notifId)
      await notificationService.deleteNotification(notifId)
      setNotifications(prev => prev.filter(n => n.id !== notifId))
      setTotal(prev => prev - 1)
      if (notif && !notif.leido) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      toast.success('Notificación eliminada')
      onNotificationUpdate?.()
      
      // Si la página queda vacía, ir a la anterior
      if (notifications.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1)
      }
    } catch (err: any) {
      console.error('Error al eliminar notificación:', err)
      toast.error('Error al eliminar notificación')
    }
  }

  const clearAll = async () => {
    try {
      await notificationService.clearAll()
      setNotifications([])
      setTotal(0)
      setUnreadCount(0)
      setCurrentPage(1)
      setLastPage(1)
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
  }

  const handleRefresh = () => {
    fetchNotifications(false)
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/4 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
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
            <Button onClick={() => fetchNotifications()} variant="outline" size="sm">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Notificaciones</h3>
            {refreshing && (
              <ArrowClockwise size={16} className="animate-spin text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? (
              <span className="text-primary font-medium">{unreadCount} sin leer</span>
            ) : (
              'Todo al día'
            )}
            {total > 0 && <span> · {total} en total</span>}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
          {total > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive">
              Limpiar todo
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <ArrowClockwise size={16} className={refreshing ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <FunnelSimple size={16} className="text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NOTIFICATION_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant={showOnlyUnread ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowOnlyUnread(!showOnlyUnread)}
          className="h-9"
        >
          <Bell size={14} className="mr-1" />
          Solo sin leer
          {unreadCount > 0 && (
            <span className="ml-1.5 bg-primary-foreground/20 text-xs px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-muted-foreground hidden sm:inline">Mostrar:</span>
          <Select value={String(perPage)} onValueChange={(v) => setPerPage(Number(v))}>
            <SelectTrigger className="w-[70px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map(n => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de notificaciones */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <CircleWavyCheckIcon size={48} className="mx-auto text-muted-foreground mb-4" weight="duotone" />
              <h4 className="font-semibold mb-2">
                {filterType !== 'all' || showOnlyUnread 
                  ? 'No hay notificaciones con estos filtros' 
                  : 'No tienes notificaciones'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {filterType !== 'all' || showOnlyUnread ? (
                  <Button variant="link" className="p-0 h-auto" onClick={() => {
                    setFilterType('all')
                    setShowOnlyUnread(false)
                  }}>
                    Limpiar filtros
                  </Button>
                ) : (
                  'Cuando haya novedades sobre tus postulaciones, te avisaremos aquí'
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
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
                      className={`cursor-pointer transition-all duration-300 hover:shadow-md border-l-4 ${
                        !notif.leido 
                          ? 'bg-primary/5 border-l-primary' 
                          : 'border-l-transparent hover:bg-accent/30'
                      }`}
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
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-3">
                                  {notif.mensaje}
                                </p>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 shrink-0 hover:bg-destructive/10 hover:text-destructive"
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
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                notif.tipo === 'Manual' ? 'bg-primary/10 text-primary' :
                                notif.tipo === 'Postulación' ? 'bg-green-100 text-green-700' :
                                notif.tipo === 'Recordatorio' ? 'bg-blue-100 text-blue-700' :
                                notif.tipo === 'Alerta' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {notif.tipo}
                              </span>
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

          {/* Paginación */}
          {lastPage > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {lastPage}
                <span className="hidden sm:inline"> · Mostrando {notifications.length} de {total}</span>
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <CaretLeft size={16} />
                  <span className="hidden sm:inline ml-1">Anterior</span>
                </Button>
                
                {/* Números de página (solo en desktop) */}
                <div className="hidden md:flex gap-1">
                  {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                    let pageNum: number
                    if (lastPage <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= lastPage - 2) {
                      pageNum = lastPage - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        className="w-9"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
                  disabled={currentPage === lastPage}
                >
                  <span className="hidden sm:inline mr-1">Siguiente</span>
                  <CaretRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}