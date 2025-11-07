import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
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
import type { User, Application, Job, ApplicationStatus } from '@/lib/types'
import { statusLabels } from '@/lib/types'

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
  const [jobs] = useKV<Job[]>('jobs', [])
  const [applications, setApplications] = useKV<Application[]>('applications', [])
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all')
  const [expandedApp, setExpandedApp] = useState<string | null>(null)

  const userApplications = (applications?.filter(app => app.userId === user.id) || [])
    .filter(app => statusFilter === 'all' || app.status === statusFilter)
    .sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime())

  const getJobForApplication = (app: Application) => {
    return jobs?.find(j => j.id === app.jobId)
  }

  const handleWithdrawApplication = (appId: string) => {
    setApplications(current => current?.filter(app => app.id !== appId) || [])
    toast.success('Postulación retirada')
  }

  const statusCounts = {
    all: applications?.filter(app => app.userId === user.id).length || 0,
    postulado: applications?.filter(app => app.userId === user.id && app.status === 'postulado').length || 0,
    'cv-visto': applications?.filter(app => app.userId === user.id && app.status === 'cv-visto').length || 0,
    'en-proceso': applications?.filter(app => app.userId === user.id && app.status === 'en-proceso').length || 0,
    finalista: applications?.filter(app => app.userId === user.id && app.status === 'finalista').length || 0,
    'proceso-finalizado': applications?.filter(app => app.userId === user.id && app.status === 'proceso-finalizado').length || 0
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
            const job = getJobForApplication(app)
            if (!job) return null

            const statusStyle = statusColors[app.status]
            const daysSinceApplied = Math.floor(
              (new Date().getTime() - new Date(app.appliedDate).getTime()) / (1000 * 60 * 60 * 24)
            )

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: `var(--color-${app.status === 'postulado' ? 'primary' : app.status === 'en-proceso' ? 'secondary' : app.status === 'finalista' ? 'warning' : 'muted'})` }}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-foreground mb-1 hover:text-primary transition-colors cursor-pointer" onClick={() => onViewJob(job.id)}>
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Buildings size={18} weight="duotone" />
                              <span className="font-medium">{job.company}</span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <DotsThreeVertical size={18} weight="bold" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onViewJob(job.id)} className="gap-2">
                                <Eye size={16} />
                                Ver detalle
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <FileText size={16} />
                                Descargar comprobante
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
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarBlank size={16} weight="duotone" />
                            Postulado hace {daysSinceApplied} {daysSinceApplied === 1 ? 'día' : 'días'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} weight="duotone" />
                            +{job.applicants} candidatos
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{job.type}</Badge>
                          {job.salary && (
                            <Badge variant="outline">{job.salary}</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-start lg:items-end gap-3 lg:min-w-[200px]">
                        <div className={`px-4 py-2 rounded-full border-2 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} font-semibold text-sm`}>
                          {statusLabels[app.status]}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewJob(job.id)}
                          className="gap-2 w-full lg:w-auto"
                        >
                          Ver empleo
                          <ArrowRight size={16} weight="bold" />
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                          className="gap-2 w-full lg:w-auto"
                        >
                          {expandedApp === app.id ? (
                            <>
                              Ocultar seguimiento
                              <CaretUp size={16} weight="bold" />
                            </>
                          ) : (
                            <>
                              Ver seguimiento
                              <CaretDown size={16} weight="bold" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedApp === app.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 pt-6 border-t"
                        >
                          <ApplicationTimeline application={app} />
                        </motion.div>
                      )}
                    </AnimatePresence>
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
