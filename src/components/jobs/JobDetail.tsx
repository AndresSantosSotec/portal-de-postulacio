import { useState } from 'react'
import { ArrowLeft, MapPin, Briefcase, Clock, CurrencyDollar, CheckCircle, Upload } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { Job, User, Application } from '@/lib/types'
import { formatDate, validateEmail, validateFileType, validateFileSize } from '@/lib/helpers'

interface JobDetailProps {
  jobId: string
  currentUser: User | null
  onBack: () => void
  onLoginSuccess: (user: User) => void
}

export default function JobDetail({ jobId, currentUser, onBack, onLoginSuccess }: JobDetailProps) {
  const [jobs] = useKV<Job[]>('jobs', [])
  const [applications, setApplications] = useKV<Application[]>('applications', [])
  const [users, setUsers] = useKV<User[]>('users', [])
  
  const [showApplicationDialog, setShowApplicationDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    password: '',
    confirmPassword: '',
    linkedIn: currentUser?.linkedIn || '',
    portfolio: currentUser?.portfolio || '',
  })
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const job = jobs?.find(j => j.id === jobId)
  const hasApplied = applications?.some(app => 
    app.jobId === jobId && app.userId === currentUser?.id
  )

  const contractTypeLabels: Record<string, string> = {
    'full-time': 'Tiempo Completo',
    'part-time': 'Medio Tiempo',
    'contract': 'Contrato',
    'internship': 'Pasantía',
  }

  const experienceLevelLabels: Record<string, string> = {
    'entry': 'Principiante',
    'mid': 'Intermedio',
    'senior': 'Senior',
    'lead': 'Líder',
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p>Oferta no encontrada</p>
        <Button onClick={onBack} className="mt-4">Volver a ofertas</Button>
      </div>
    )
  }

  const handleApplyClick = () => {
    if (hasApplied) {
      toast.info('Ya has aplicado a esta oferta')
      return
    }
    setShowApplicationDialog(true)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    }

    if (!currentUser) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida'
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden'
      }
    }

    if (!cvFile && !currentUser?.cvUrl) {
      newErrors.cvFile = 'Debes adjuntar tu hoja de vida'
    }

    if (cvFile) {
      if (!validateFileType(cvFile)) {
        newErrors.cvFile = 'El archivo debe ser PDF o DOCX'
      } else if (!validateFileSize(cvFile)) {
        newErrors.cvFile = 'El archivo no debe superar 5MB'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario')
      return
    }

    setIsSubmitting(true)

    try {
      let userId = currentUser?.id
      let user = currentUser

      if (!currentUser) {
        const existingUser = users?.find(u => u.email === formData.email)
        if (existingUser) {
          toast.error('Ya existe una cuenta con este correo electrónico')
          setIsSubmitting(false)
          return
        }

        userId = `user_${Date.now()}`
        user = {
          id: userId,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          cvUrl: cvFile ? `cv_${userId}_${cvFile.name}` : undefined,
          linkedIn: formData.linkedIn || undefined,
          portfolio: formData.portfolio || undefined,
        }

        setUsers((currentUsers = []) => [...currentUsers, user!])
      } else if (cvFile) {
        user = {
          ...currentUser,
          cvUrl: `cv_${userId}_${cvFile.name}`,
        }
        setUsers((currentUsers = []) => 
          currentUsers.map(u => u.id === userId ? user! : u)
        )
      }

      const application: Application = {
        id: `app_${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        userId: userId!,
        status: 'under_review',
        appliedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      }

      setApplications((currentApps = []) => [...currentApps, application])

      setShowApplicationDialog(false)
      setShowSuccessDialog(true)

      if (user) {
        onLoginSuccess(user)
      }
    } catch (error) {
      toast.error('Error al enviar la aplicación')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCvFile(file)
      setErrors(prev => ({ ...prev, cvFile: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 -ml-2 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Volver a ofertas
        </Button>

        <Card className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3 tracking-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={20} />
                  {contractTypeLabels[job.contractType]}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  {job.workSchedule}
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <CurrencyDollar size={20} />
                    {job.salary}
                  </div>
                )}
              </div>
            </div>
            
            <Badge className="bg-accent text-accent-foreground ml-4">
              Activa
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary">{job.area}</Badge>
            <Badge variant="outline">{experienceLevelLabels[job.experienceLevel]}</Badge>
            <Badge variant="outline">Publicado {formatDate(job.postedDate)}</Badge>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">Descripción del Puesto</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Requisitos</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Beneficios</h2>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button
              onClick={handleApplyClick}
              disabled={hasApplied}
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground h-12 px-8 text-lg"
            >
              {hasApplied ? 'Ya has aplicado' : 'Aplicar Ahora'}
            </Button>
          </div>
        </Card>
      </div>

      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {currentUser ? 'Confirmar Aplicación' : 'Aplicar a la Oferta'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  disabled={!!currentUser}
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!!currentUser}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!!currentUser}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="linkedIn">LinkedIn (opcional)</Label>
                <Input
                  id="linkedIn"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedIn}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                />
              </div>
            </div>

            {!currentUser && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="portfolio">Portafolio (opcional)</Label>
              <Input
                id="portfolio"
                type="url"
                placeholder="https://..."
                value={formData.portfolio}
                onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="cv">
                {currentUser?.cvUrl ? 'Actualizar Hoja de Vida' : 'Hoja de Vida *'} (PDF o DOCX)
              </Label>
              <div className="mt-2">
                <label
                  htmlFor="cv"
                  className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload size={24} />
                  <span>{cvFile ? cvFile.name : 'Haz clic para seleccionar archivo'}</span>
                </label>
                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {errors.cvFile && (
                <p className="text-sm text-destructive mt-1">{errors.cvFile}</p>
              )}
              {currentUser?.cvUrl && !cvFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Ya tienes una hoja de vida registrada
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowApplicationDialog(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Aplicación'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <CheckCircle size={64} className="mx-auto text-secondary mb-4" />
            <DialogTitle className="text-2xl mb-3">
              ¡Aplicación Enviada con Éxito!
            </DialogTitle>
            <p className="text-muted-foreground mb-6">
              Tu postulación ha sido registrada. Podrás dar seguimiento a tu proceso desde tu portal.
            </p>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Ir a Mi Portal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
