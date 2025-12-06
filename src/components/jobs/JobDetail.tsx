import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, MapPin, Briefcase, Heart, Buildings, CalendarBlank, Check, Image as ImageIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { publicJobService, type Job } from '@/lib/publicJobService'
import { applicationService } from '@/lib/applicationService'
import type { Application, User } from '@/lib/types'
import AuthModal from '../auth/AuthModal'
import QuickRegisterModal from '../auth/QuickRegisterModal'
import ApplicationForm from './ApplicationForm'

type JobDetailProps = {
  jobId: string
  currentUser: User | null
  onBack: () => void
  onLoginSuccess: (user: User) => void
}

export default function JobDetail({ jobId, currentUser, onBack, onLoginSuccess }: JobDetailProps) {
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [applications, setApplications] = useState<Application[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationData, setApplicationData] = useState<any>(null)
  const [isCheckingApplication, setIsCheckingApplication] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showQuickRegisterModal, setShowQuickRegisterModal] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    loadJobDetail()
  }, [jobId])

  useEffect(() => {
    if (currentUser && jobId) {
      checkIfFavorite()
      checkIfApplied()
    }
  }, [currentUser, jobId])

  const loadJobDetail = async () => {
    try {
      setIsLoading(true)
      const jobData = await publicJobService.getOffer(parseInt(jobId))
      setJob(jobData)
    } catch (error) {
      console.error('Error al cargar detalle del empleo:', error)
      toast.error('Error al cargar información del empleo')
    } finally {
      setIsLoading(false)
    }
  }

  const checkIfFavorite = async () => {
    try {
      setIsCheckingFavorite(true)
      const isFav = await applicationService.checkFavorite(parseInt(jobId))
      setIsFavorite(isFav)
    } catch (error) {
      console.error('Error al verificar favorito:', error)
    } finally {
      setIsCheckingFavorite(false)
    }
  }

  const checkIfApplied = async () => {
    try {
      setIsCheckingApplication(true)
      const result = await applicationService.checkApplication(parseInt(jobId))
      setHasApplied(result.has_applied)
      if (result.application) {
        setApplicationData(result.application)
      }
    } catch (error) {
      console.error('Error al verificar postulación:', error)
    } finally {
      setIsCheckingApplication(false)
    }
  }

  const application = applications?.find(app => app.jobId === jobId && app.userId === currentUser?.id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando información del empleo...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Empleo no encontrado</h2>
          <Button onClick={onBack}>Volver a empleos</Button>
        </div>
      </div>
    )
  }

  const handleApply = () => {
    if (!currentUser) {
      setShowAuthModal(true)
      return
    }

    setShowApplicationForm(true)
  }

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para guardar favoritos', {
        description: 'Regístrate o inicia sesión para continuar'
      })
      setShowAuthModal(true)
      return
    }

    if (isTogglingFavorite) return

    setIsTogglingFavorite(true)

    try {
      if (isFavorite) {
        await applicationService.removeFavorite(parseInt(jobId))
        setIsFavorite(false)
        toast.success('Eliminado de favoritos')
      } else {
        await applicationService.addFavorite(parseInt(jobId))
        setIsFavorite(true)
        toast.success('Agregado a favoritos')
      }
    } catch (error: any) {
      console.error('Error al actualizar favorito:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al actualizar favoritos')
      }
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  const daysAgo = Math.floor(
    (Date.now() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border sticky top-16 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-2 hover:bg-primary/10"
            >
              <ArrowLeft size={18} />
              Volver a empleos
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden">
                {job.imageUrl && (
                  <div className="relative w-full h-80 bg-muted">
                    {!imageLoaded && !imageError && (
                      <Skeleton className="absolute inset-0" />
                    )}
                    {imageError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
                        <ImageIcon size={64} weight="duotone" className="mb-3 opacity-50" />
                        <span className="text-sm">Imagen no disponible</span>
                      </div>
                    ) : (
                      <img
                        src={job.imageUrl}
                        alt={job.title}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                        className={cn(
                          "w-full h-full object-cover transition-opacity duration-500",
                          imageLoaded ? "opacity-100" : "opacity-0"
                        )}
                      />
                    )}
                  </div>
                )}
                
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <Badge className="mb-3 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        {job.category}
                      </Badge>
                      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
                        {job.title}
                      </h1>
                      <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground">
                        <Buildings size={20} weight="duotone" />
                        <span>{job.company}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} weight="duotone" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} weight="duotone" />
                      <span className="capitalize">{job.type?.replace('-', ' ') || 'No especificado'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarBlank size={18} weight="duotone" />
                      <span>
                        {daysAgo === 0 ? 'Publicado hoy' : daysAgo === 1 ? 'Publicado ayer' : `Publicado hace ${daysAgo} días`}
                      </span>
                    </div>
                  </div>

                  {job.salary && (
                    <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 mb-6">
                      <p className="text-sm text-muted-foreground mb-1">Rango salarial</p>
                      <p className="text-xl font-bold text-secondary">{job.salary}</p>
                    </div>
                  )}

                  <Separator className="my-6" />

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Descripción del puesto</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>

                  {job.requirements && job.requirements.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Requisitos</h2>
                        <ul className="space-y-3">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Check size={20} weight="bold" className="text-secondary shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {job.skills && job.skills.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Habilidades requeridas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {job.skills.map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${skill.required ? 'bg-destructive' : 'bg-secondary'}`} />
                                <span className="font-medium text-foreground">{skill.name}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {skill.level}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
                            Obligatorio
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                            Deseable
                          </span>
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-4">
                <Card className="shadow-lg">
                  <CardContent className="pt-6">
                    {application ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
                          <Check size={24} weight="bold" className="text-secondary shrink-0" />
                          <div>
                            <p className="font-semibold text-foreground">Ya te postulaste</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(application.appliedDate).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Estado de postulación</p>
                          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {application.status}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {hasApplied ? (
                          <div className="space-y-3">
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Check size={20} className="text-primary" weight="bold" />
                                <p className="font-semibold text-primary">Ya has postulado a esta oferta</p>
                              </div>
                              {applicationData && (
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p>Estado: <span className="font-medium text-foreground">{applicationData.estado}</span></p>
                                  <p>Fecha: {new Date(applicationData.fecha_postulacion).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}</p>
                                </div>
                              )}
                            </div>
                            <Button
                              size="lg"
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                // Navigate to applications page - you can implement this navigation
                                toast.info('Redirigiendo a tus postulaciones...')
                              }}
                            >
                              Ver mi postulación
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button
                              size="lg"
                              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg gap-2"
                              onClick={handleApply}
                            >
                              <Check size={20} weight="bold" />
                              Postularme ahora
                            </Button>
                          </>
                        )}
                        
                        {!currentUser && (
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-card px-2 text-muted-foreground">o</span>
                            </div>
                          </div>
                        )}
                        
                        {!currentUser && (
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full gap-2 border-2 hover:bg-accent/5"
                            onClick={() => setShowQuickRegisterModal(true)}
                          >
                            Registro rápido y postularme
                          </Button>
                        )}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="lg"
                      className={cn(
                        "w-full mt-3 gap-2 transition-all",
                        isFavorite && "border-destructive text-destructive hover:text-destructive hover:bg-destructive/10"
                      )}
                      onClick={handleToggleFavorite}
                    >
                      <Heart size={20} weight={isFavorite ? "fill" : "regular"} />
                      {isFavorite ? 'Guardado en favoritos' : 'Guardar empleo'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">Sobre este empleo</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Candidatos</p>
                        <p className="font-medium">{job.applicants} postulados</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-muted-foreground">Tipo de empleo</p>
                        <p className="font-medium capitalize">{job.type?.replace('-', ' ') || 'No especificado'}</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-muted-foreground">Categoría</p>
                        <p className="font-medium">{job.category}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={onLoginSuccess}
      />

      <QuickRegisterModal
        isOpen={showQuickRegisterModal}
        onClose={() => setShowQuickRegisterModal(false)}
        onSuccess={(user, quickApply) => {
          onLoginSuccess(user)
          if (quickApply) {
            const newApplication: Application = {
              id: Date.now().toString(),
              jobId: job.id,
              userId: user.id,
              status: 'postulado',
              appliedDate: new Date().toISOString(),
              updatedDate: new Date().toISOString(),
              quickApply: true
            }
            setApplications(currentApps => [...(currentApps || []), newApplication])
          }
        }}
        jobTitle={job.title}
        jobId={parseInt(job.id)}
      />

      <ApplicationForm
        job={job}
        currentUser={currentUser}
        isOpen={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
        onSuccess={() => {}}
        onLoginRequired={() => {
          setShowApplicationForm(false)
          setShowAuthModal(true)
        }}
      />
    </>
  )
}
