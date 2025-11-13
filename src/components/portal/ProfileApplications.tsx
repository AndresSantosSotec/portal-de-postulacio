import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Briefcase, 
  MapPin, 
  CalendarBlank, 
  DotsThreeVertical,
  Eye,
  Buildings,
  Users,
  ArrowRight,
  FileText,
  Trash,
  CheckCircle,
  CaretDown,
  CaretUp
} from '@phosphor-icons/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import ApplicationTimeline from '@/components/jobs/ApplicationTimeline'
import type { User, ApplicationStatus } from '@/lib/types'
import { statusLabels } from '@/lib/types'
import { applicationService, type Application } from '@/lib/applicationService'

type ProfileApplicationsProps = {
  user: User
  onViewJob: (jobId: string) => void
}

type StatusFilterType = 'all' | ApplicationStatus

const statusColors: Record<ApplicationStatus, { bg: string; text: string; border: string }> = {
  'postulado': { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  'cv-visto': { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' },
  'en-proceso': { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/30' },
  'finalista': { bg: 'bg-warning/10', text: 'text-warning-foreground', border: 'border-warning/30' },
  'proceso-finalizado': { bg: 'bg-muted/50', text: 'text-muted-foreground', border: 'border-border' }
}

export default function ProfileApplications({ user, onViewJob }: ProfileApplicationsProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all')
  const [expandedApp, setExpandedApp] = useState<number | null>(null)

  // Cargar postulaciones del backend
  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    setLoading(true)
    try {
      const data = await applicationService.getMyApplications()
      setApplications(data)
    } catch (error) {
      console.error('Error al cargar postulaciones:', error)
      toast.error('Error al cargar tus postulaciones')
    } finally {
      setLoading(false)
    }
  }

  // Mapear estado del backend al frontend para filtros
  const mapBackendStatusToFrontend = (backendStatus: string): ApplicationStatus => {
    const statusMap: Record<string, ApplicationStatus> = {
      'Postulado': 'postulado',
      'CV Visto': 'cv-visto',
      'En Proceso': 'en-proceso',
      'Finalista': 'finalista',
      'Rechazado': 'proceso-finalizado',
      'Contratado': 'proceso-finalizado'
    }
    return statusMap[backendStatus] || 'postulado'
  }

  const userApplications = applications
    .filter(app => statusFilter === 'all' || mapBackendStatusToFrontend(app.estado) === statusFilter)
    .sort((a, b) => new Date(b.fecha_postulacion).getTime() - new Date(a.fecha_postulacion).getTime())

  const handleWithdrawApplication = async (appId: number) => {
    try {
      await applicationService.withdrawApplication(appId)
      setApplications(current => current.filter(app => app.id !== appId))
      toast.success('Postulación retirada exitosamente')
    } catch (error) {
      console.error('Error al retirar postulación:', error)
      toast.error('Error al retirar la postulación')
    }
  }

  const statusCounts = {
    all: applications.length,
    postulado: applications.filter(app => app.estado === 'Postulado').length,
    'cv-visto': applications.filter(app => app.estado === 'CV Visto').length,
    'en-proceso': applications.filter(app => app.estado === 'En Proceso').length,
    finalista: applications.filter(app => app.estado === 'Finalista').length,
    'proceso-finalizado': applications.filter(app => app.estado === 'Rechazado' || app.estado === 'Contratado').length
  }

  const filterButtons: { key: StatusFilterType; label: string; icon?: React.ReactNode }[] = [
    { key: 'all', label: 'Todas', icon: <Briefcase size={16} weight="duotone" /> },
    { key: 'postulado', label: 'Postulado', icon: <CheckCircle size={16} weight="duotone" /> },
    { key: 'cv-visto', label: 'CV Visto', icon: <Eye size={16} weight="duotone" /> },
    { key: 'en-proceso', label: 'En Proceso' },
    { key: 'finalista', label: 'Finalista' },
    { key: 'proceso-finalizado', label: 'Finalizadas' }
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <CardHeader>
            <CardTitle>Mis Postulaciones</CardTitle>
            <CardDescription>Seguimiento del estado de tus aplicaciones a ofertas laborales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filterButtons.map((filter) => (
                <Button
                  key={filter.key}
                  variant={statusFilter === filter.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(filter.key)}
                  className="gap-2"
                >
                  {filter.icon}
                  {filter.label}
                  {statusCounts[filter.key] > 0 && (
                    <Badge 
                      variant={statusFilter === filter.key ? 'secondary' : 'outline'} 
                      className="ml-1 h-5 min-w-5 px-1.5"
                    >
                      {statusCounts[filter.key]}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {userApplications.length === 0 ? (
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
                <Briefcase size={40} className="text-primary" weight="duotone" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">
                {statusFilter === 'all' ? 'No tienes postulaciones' : `No hay postulaciones ${statusLabels[statusFilter as ApplicationStatus]?.toLowerCase()}`}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {statusFilter === 'all' 
                  ? 'Comienza a explorar empleos y postúlate a los que te interesen' 
                  : 'Cambia el filtro para ver otras postulaciones'}
              </p>
              {statusFilter === 'all' && (
                <Button size="lg" className="gap-2">
                  Explorar Empleos
                  <ArrowRight size={18} weight="bold" />
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {userApplications.map((app, index) => {
            if (!app.oferta) return null

            const frontendStatus = mapBackendStatusToFrontend(app.estado)
            const statusStyle = statusColors[frontendStatus]
            const daysSinceApplied = Math.floor(
              (new Date().getTime() - new Date(app.fecha_postulacion).getTime()) / (1000 * 60 * 60 * 24)
            )

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: `var(--color-${frontendStatus === 'postulado' ? 'primary' : frontendStatus === 'en-proceso' ? 'secondary' : frontendStatus === 'finalista' ? 'warning' : 'muted'})` }}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-foreground mb-1 hover:text-primary transition-colors cursor-pointer" onClick={() => onViewJob(app.oferta!.id.toString())}>
                              {app.oferta.titulo}
                            </h3>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Buildings size={18} weight="duotone" />
                              <span className="font-medium">{app.oferta.empresa}</span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <DotsThreeVertical size={18} weight="bold" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onViewJob(app.oferta!.id.toString())} className="gap-2">
                                <Eye size={16} />
                                Ver detalle
                              </DropdownMenuItem>
                              <Separator className="my-1" />
                              <DropdownMenuItem 
                                onClick={() => handleWithdrawApplication(app.id)}
                                className="gap-2 text-destructive focus:text-destructive"
                              >
                                <Trash size={16} />
                                Retirar postulación
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} weight="duotone" />
                            {app.oferta.ubicacion}
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarBlank size={16} weight="duotone" />
                            Postulado hace {daysSinceApplied} {daysSinceApplied === 1 ? 'día' : 'días'}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{app.oferta.tipo_contrato}</Badge>
                          {app.observaciones && (
                            <Badge variant="secondary" className="max-w-[200px] truncate">{app.observaciones}</Badge>
                          )}
                        </div>

                        {/* Barra de progreso del estado */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-muted-foreground">Progreso de postulación</span>
                            <span className="text-xs font-semibold text-primary">
                              {app.estado === 'Postulado' && '20%'}
                              {app.estado === 'CV Visto' && '40%'}
                              {app.estado === 'En Proceso' && '60%'}
                              {app.estado === 'Finalista' && '80%'}
                              {(app.estado === 'Contratado' || app.estado === 'Rechazado') && '100%'}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 rounded-full ${
                                app.estado === 'Rechazado' ? 'bg-destructive' : 
                                app.estado === 'Contratado' ? 'bg-green-500' : 
                                'bg-primary'
                              }`}
                              style={{
                                width: 
                                  app.estado === 'Postulado' ? '20%' :
                                  app.estado === 'CV Visto' ? '40%' :
                                  app.estado === 'En Proceso' ? '60%' :
                                  app.estado === 'Finalista' ? '80%' :
                                  '100%'
                              }}
                            />
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span className={app.estado === 'Postulado' || app.estado === 'CV Visto' || app.estado === 'En Proceso' || app.estado === 'Finalista' || app.estado === 'Contratado' || app.estado === 'Rechazado' ? 'text-primary font-medium' : ''}>Enviado</span>
                            <span className={app.estado === 'CV Visto' || app.estado === 'En Proceso' || app.estado === 'Finalista' || app.estado === 'Contratado' || app.estado === 'Rechazado' ? 'text-primary font-medium' : ''}>Revisado</span>
                            <span className={app.estado === 'En Proceso' || app.estado === 'Finalista' || app.estado === 'Contratado' || app.estado === 'Rechazado' ? 'text-primary font-medium' : ''}>En proceso</span>
                            <span className={app.estado === 'Finalista' || app.estado === 'Contratado' || app.estado === 'Rechazado' ? 'text-primary font-medium' : ''}>Finalista</span>
                            <span className={app.estado === 'Contratado' ? 'text-green-500 font-medium' : app.estado === 'Rechazado' ? 'text-destructive font-medium' : ''}>
                              {app.estado === 'Contratado' ? 'Contratado' : app.estado === 'Rechazado' ? 'Rechazado' : 'Final'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-start lg:items-end gap-3 lg:min-w-[200px]">
                        <div className={`px-4 py-2 rounded-full border-2 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} font-semibold text-sm`}>
                          {app.estado}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewJob(app.oferta!.id.toString())}
                          className="gap-2 w-full lg:w-auto"
                        >
                          Ver empleo
                          <ArrowRight size={16} weight="bold" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid lg:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-secondary/5 to-background">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <CheckCircle size={24} weight="duotone" className="text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Postulado</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tu postulación ha sido enviada exitosamente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Eye size={24} weight="duotone" className="text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">CV Visto</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  El reclutador ha revisado tu currículum
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-background">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                <Users size={24} weight="duotone" className="text-warning-foreground" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Finalista</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Estás en la lista corta de candidatos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
