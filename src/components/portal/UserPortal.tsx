import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  User as UserIcon, 
  Briefcase, 
  PaperPlaneRight, 
  Heart, 
  Bell,
  FileText,
  ChartBar,
  MapPin,
  IdentificationCard
} from '@phosphor-icons/react'
import ProfileHeader from './ProfileHeader'
import ProfileCurriculum from './ProfileCurriculum'
import ProfilePersonalData from './ProfilePersonalData'
import ProfileApplications from './ProfileApplications'
import NotificationsPanel from './NotificationsPanel'
import StatusSimulator from './StatusSimulator'
import EvaluationsPanel from './EvaluationsPanel'
import JobAlerts from '@/components/profile/JobAlerts'
import { useNotificationService } from '@/hooks/use-notification-service'
import { applicationService, type Favorite } from '@/lib/applicationService'
import { toast } from 'sonner'
import type { User, Application, Job, JobAlert } from '@/lib/types'
import { categoryLabels } from '@/lib/types'

type CustomNotification = {
  id: string
  userId: string
  read: boolean
  message: string
  createdAt: string
}

type UserPortalProps = {
  user: User
  onUpdateUser: (user: User) => void
  onViewJob: (jobId: string) => void
}

export default function UserPortal({ user, onUpdateUser, onViewJob }: UserPortalProps) {
  const [jobs] = useKV<Job[]>('jobs', [])
  const [applications] = useKV<Application[]>('applications', [])
  const [favorites] = useKV<string[]>('favorites', [])
  const [alerts] = useKV<JobAlert[]>('job_alerts', [])
  const [notifications] = useKV<CustomNotification[]>('notifications', [])
  const [activeTab, setActiveTab] = useState('curriculum')
  const [backendFavorites, setBackendFavorites] = useState<Favorite[]>([])
  const [loadingFavorites, setLoadingFavorites] = useState(false)
  
  const { notificationCount } = useNotificationService(user.id)
  
  const userApplications = applications?.filter(app => app.userId === user.id) || []
  const userFavorites = jobs?.filter(job => favorites?.includes(job.id)) || []
  const userAlerts = alerts?.filter(alert => alert.userId === user.id) || []
  const unreadNotifications = notifications?.filter(n => n.userId === user.id && !n.read).length || 0

  // Cargar favoritos desde el backend cuando se active la pestaña
  useEffect(() => {
    if (activeTab === 'favorites') {
      loadBackendFavorites()
    }
  }, [activeTab])

  const loadBackendFavorites = async () => {
    setLoadingFavorites(true)
    try {
      const favs = await applicationService.getFavorites()
      setBackendFavorites(favs)
    } catch (error) {
      console.error('Error al cargar favoritos:', error)
      toast.error('No se pudieron cargar los favoritos')
    } finally {
      setLoadingFavorites(false)
    }
  }

  const handleRemoveFavorite = async (ofertaId: number) => {
    try {
      await applicationService.removeFavorite(ofertaId)
      toast.success('Eliminado de favoritos')
      loadBackendFavorites()
    } catch (error) {
      console.error('Error al eliminar favorito:', error)
      toast.error('No se pudo eliminar de favoritos')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 overflow-hidden border-none shadow-xl">
          <ProfileHeader user={user} />
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b border-border bg-card/50 backdrop-blur-sm rounded-lg p-2 sticky top-20 z-40 shadow-sm">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 h-auto gap-2 bg-transparent">
              <TabsTrigger 
                value="curriculum" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
              >
                <FileText size={18} weight="duotone" />
                <span className="hidden sm:inline">Mi Currículum</span>
                <span className="sm:hidden">CV</span>
              </TabsTrigger>
              <TabsTrigger 
                value="personal-data" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
              >
                <IdentificationCard size={18} weight="duotone" />
                <span className="hidden sm:inline">Datos Personales</span>
                <span className="sm:hidden">Datos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="applications" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
              >
                <PaperPlaneRight size={18} weight="duotone" />
                <span className="hidden sm:inline">Mis Postulaciones</span>
                <span className="sm:hidden">Postulaciones</span>
                {userApplications.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{userApplications.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 relative"
              >
                <Bell size={18} weight="duotone" />
                <span className="hidden sm:inline">Notificaciones</span>
                <span className="sm:hidden">Notif.</span>
                {unreadNotifications > 0 && (
                  <Badge variant="destructive" className="ml-1 animate-pulse">{unreadNotifications}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="favorites" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
              >
                <Heart size={18} weight="duotone" />
                <span className="hidden sm:inline">Favoritos</span>
                <span className="sm:hidden">Favoritos</span>
                {backendFavorites.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{backendFavorites.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="alerts" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
              >
                <Bell size={18} weight="duotone" />
                <span className="hidden sm:inline">Vacantes Sugeridas</span>
                <span className="sm:hidden">Sugeridas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tests" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
              >
                <ChartBar size={18} weight="duotone" />
                <span className="hidden sm:inline">Tests</span>
                <span className="sm:hidden">Tests</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="curriculum" className="mt-0 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileCurriculum user={user} onUpdateUser={onUpdateUser} />
            </motion.div>
          </TabsContent>

          <TabsContent value="personal-data" className="mt-0 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProfilePersonalData user={user} onUpdateUser={onUpdateUser} />
            </motion.div>
          </TabsContent>

          <TabsContent value="applications" className="mt-0 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileApplications user={user} onViewJob={onViewJob} />
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StatusSimulator userId={user.id} />
              <NotificationsPanel user={user} onViewJob={onViewJob} />
            </motion.div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-0 space-y-6">
            {loadingFavorites ? (
              <Card>
                <CardContent className="py-20 text-center">
                  <p className="text-muted-foreground">Cargando favoritos...</p>
                </CardContent>
              </Card>
            ) : backendFavorites.length === 0 ? (
              <Card>
                <CardContent className="py-20 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="inline-flex h-20 w-20 rounded-full bg-destructive/10 items-center justify-center mx-auto mb-4"
                  >
                    <Heart size={40} className="text-destructive" weight="duotone" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">No tienes empleos favoritos</h3>
                  <p className="text-muted-foreground">
                    Guarda empleos que te interesen para revisarlos más tarde
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {backendFavorites.map((fav) => (
                  <motion.div
                    key={fav.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="hover:shadow-lg transition-all h-full">
                      <CardHeader>
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 cursor-pointer" onClick={() => onViewJob(fav.oferta_id.toString())}>
                            <h3 className="font-semibold text-lg line-clamp-2">{fav.titulo}</h3>
                            <p className="text-sm text-muted-foreground">{fav.empresa}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoveFavorite(fav.oferta_id)}
                          >
                            <Heart size={20} weight="fill" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin size={16} weight="duotone" />
                          {fav.ubicacion}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {fav.tipo_contrato}
                          </Badge>
                          {fav.salario_min && fav.salario_max && (
                            <Badge variant="secondary" className="text-xs">
                              Q{fav.salario_min.toLocaleString()} - Q{fav.salario_max.toLocaleString()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Agregado: {new Date(fav.fecha_agregado).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="mt-0 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <JobAlerts 
                categories={Object.entries(categoryLabels).map(([id, name]) => ({ id, name }))} 
                onViewJob={onViewJob}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="tests" className="mt-0 space-y-6">
            <EvaluationsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
