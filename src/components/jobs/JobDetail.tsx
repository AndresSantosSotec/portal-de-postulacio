import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, MapPin, Briefcase, Heart, Buildings, CalendarBlank, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Job, Application, User } from '@/lib/types'
import { categoryLabels, statusLabels } from '@/lib/types'
import AuthModal from '../auth/AuthModal'

type JobDetailProps = {
  jobId: string
  currentUser: User | null
  onBack: () => void
  onLoginSuccess: (user: User) => void
}

export default function JobDetail({ jobId, currentUser, onBack, onLoginSuccess }: JobDetailProps) {
  const [jobs] = useKV<Job[]>('jobs', [])
  const [applications, setApplications] = useKV<Application[]>('applications', [])
  const [favorites, setFavorites] = useKV<string[]>('favorites', [])
  const [showAuthModal, setShowAuthModal] = useState(false)

  const job = jobs?.find(j => j.id === jobId)
  const application = applications?.find(app => app.jobId === jobId && app.userId === currentUser?.id)
  const isFavorite = favorites?.includes(jobId) || false

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

    if (application) {
      toast.info('Ya te has postulado a este empleo')
      return
    }

    const newApplication: Application = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      userId: currentUser.id,
      status: 'postulado',
      appliedDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    }

    setApplications(currentApps => [...(currentApps || []), newApplication])
    toast.success('¡Postulación enviada exitosamente!')
  }

  const handleToggleFavorite = () => {
    if (!currentUser) {
      setShowAuthModal(true)
      return
    }

    setFavorites(currentFavorites => {
      const favs = currentFavorites || []
      if (favs.includes(jobId)) {
        toast.success('Eliminado de favoritos')
        return favs.filter(id => id !== jobId)
      } else {
        toast.success('Agregado a favoritos')
        return [...favs, jobId]
      }
    })
  }

  const daysAgo = Math.floor(
    (Date.now() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft size={18} />
              Volver a empleos
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <Badge className="mb-3">
                        {categoryLabels[job.category]}
                      </Badge>
                      <h1 className="text-3xl font-bold text-foreground mb-2">
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
                      <span className="capitalize">{job.type.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarBlank size={18} weight="duotone" />
                      <span>
                        {daysAgo === 0 ? 'Publicado hoy' : daysAgo === 1 ? 'Publicado ayer' : `Publicado hace ${daysAgo} días`}
                      </span>
                    </div>
                  </div>

                  {job.salary && (
                    <div className="bg-muted/50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-muted-foreground mb-1">Salario</p>
                      <p className="text-xl font-semibold text-foreground">{job.salary}</p>
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
                        <ul className="space-y-2">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Check size={20} weight="bold" className="text-accent shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    {application ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg">
                          <Check size={24} weight="bold" className="text-accent shrink-0" />
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
                          <Badge className="bg-primary text-primary-foreground">
                            {statusLabels[application.status]}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={handleApply}
                      >
                        Postularme ahora
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="lg"
                      className={cn(
                        "w-full mt-3 gap-2",
                        isFavorite && "border-destructive text-destructive hover:text-destructive"
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
                        <p className="font-medium">+{job.applicants} postulados</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-muted-foreground">Tipo de empleo</p>
                        <p className="font-medium capitalize">{job.type.replace('-', ' ')}</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-muted-foreground">Categoría</p>
                        <p className="font-medium">{categoryLabels[job.category]}</p>
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
    </>
  )
}
