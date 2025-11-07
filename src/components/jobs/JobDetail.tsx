import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, MapPin, Briefcase, Heart, Buildings, CalendarBlank, Check, Image as ImageIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Job, Application, User } from '@/lib/types'
import { categoryLabels, statusLabels } from '@/lib/types'
import AuthModal from '../auth/AuthModal'
import ApplicationForm from './ApplicationForm'

type JobDetailProps = {
  jobId: string
  currentUser: User | null
  onBack: () => void
  onLoginSuccess: (user: User) => void
}

export default function JobDetail({ jobId, currentUser, onBack, onLoginSuccess }: JobDetailProps) {
  const [jobs] = useKV<Job[]>('jobs', [])
  const [applications] = useKV<Application[]>('applications', [])
  const [favorites, setFavorites] = useKV<string[]>('favorites', [])
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

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

    setShowApplicationForm(true)
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
        <div className="bg-card border-b border-border sticky top-16 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
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

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
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
                        {categoryLabels[job.category]}
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
                            {statusLabels[application.status]}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="lg"
                        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg gap-2"
                        onClick={handleApply}
                      >
                        <Check size={20} weight="bold" />
                        Postularme ahora
                      </Button>
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
