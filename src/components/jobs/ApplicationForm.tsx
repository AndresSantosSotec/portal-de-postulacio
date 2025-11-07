import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  PaperPlaneRight, 
  Check, 
  Lightning,
  Upload,
  Warning
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Job, Application, User, CustomQuestion } from '@/lib/types'

type ApplicationFormProps = {
  job: Job
  currentUser: User | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onLoginRequired: () => void
}

export default function ApplicationForm({
  job,
  currentUser,
  isOpen,
  onClose,
  onSuccess,
  onLoginRequired,
}: ApplicationFormProps) {
  const [applications, setApplications] = useKV<Application[]>('applications', [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.profile?.phone || '',
  })
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({})
  const [cvFile, setCvFile] = useState<string | null>(null)

  const existingApplication = applications?.find(
    app => app.jobId === job.id && app.userId === currentUser?.id
  )

  const canQuickApply = currentUser && currentUser.cvFile && currentUser.profile?.phone

  const totalFields = 3 + (job.customQuestions?.length || 0) + (currentUser?.cvFile ? 0 : 1)
  const filledFields = 
    (formData.name ? 1 : 0) +
    (formData.email ? 1 : 0) +
    (formData.phone ? 1 : 0) +
    (cvFile || currentUser?.cvFile ? 1 : 0) +
    Object.keys(customAnswers).length
  const progress = (filledFields / totalFields) * 100

  const handleQuickApply = async () => {
    if (!currentUser) {
      onLoginRequired()
      return
    }

    if (existingApplication) {
      toast.info('Ya te has postulado a este empleo')
      return
    }

    setIsSubmitting(true)
    
    setTimeout(() => {
      const newApplication: Application = {
        id: `app_${Date.now()}`,
        jobId: job.id,
        userId: currentUser.id,
        status: 'postulado',
        appliedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        quickApply: true,
      }

      setApplications(apps => [...(apps || []), newApplication])
      
      setIsSubmitting(false)
      toast.success('¡Postulación enviada exitosamente! ⚡', {
        description: 'Aplicaste usando tu perfil guardado'
      })
      onSuccess()
      onClose()
    }, 800)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      onLoginRequired()
      return
    }

    if (existingApplication) {
      toast.info('Ya te has postulado a este empleo')
      return
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    if (!cvFile && !currentUser.cvFile) {
      toast.error('Por favor adjunta tu CV')
      return
    }

    const requiredQuestions = job.customQuestions?.filter(q => q.required) || []
    const missingAnswers = requiredQuestions.filter(q => !customAnswers[q.id])
    
    if (missingAnswers.length > 0) {
      toast.error('Por favor responde todas las preguntas requeridas')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const newApplication: Application = {
        id: `app_${Date.now()}`,
        jobId: job.id,
        userId: currentUser.id,
        status: 'postulado',
        appliedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        customAnswers,
        quickApply: false,
      }

      setApplications(apps => [...(apps || []), newApplication])
      
      setIsSubmitting(false)
      toast.success('¡Postulación enviada exitosamente!', {
        description: 'Te notificaremos sobre cualquier actualización'
      })
      onSuccess()
      onClose()
    }, 1200)
  }

  const handleCustomAnswerChange = (questionId: string, value: string) => {
    setCustomAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const renderCustomQuestion = (question: CustomQuestion) => {
    switch (question.type) {
      case 'textarea':
        return (
          <Textarea
            id={question.id}
            value={customAnswers[question.id] || ''}
            onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
            placeholder="Escribe tu respuesta..."
            className="min-h-24"
          />
        )
      case 'number':
        return (
          <Input
            id={question.id}
            type="number"
            value={customAnswers[question.id] || ''}
            onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
            placeholder="Ingresa un número..."
          />
        )
      case 'select':
        return (
          <Select
            value={customAnswers[question.id] || ''}
            onValueChange={(value) => handleCustomAnswerChange(question.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opción..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return (
          <Input
            id={question.id}
            type="text"
            value={customAnswers[question.id] || ''}
            onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
            placeholder="Escribe tu respuesta..."
          />
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <PaperPlaneRight size={24} weight="duotone" className="text-primary" />
            Postular a {job.title}
          </DialogTitle>
          <DialogDescription>
            {job.company} • {job.location}
          </DialogDescription>
        </DialogHeader>

        {existingApplication ? (
          <div className="py-8 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mx-auto h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center"
            >
              <Check size={32} weight="bold" className="text-secondary" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Ya te has postulado</h3>
              <p className="text-sm text-muted-foreground">
                Puedes ver el estado de tu aplicación en "Mis Postulaciones"
              </p>
            </div>
            <Button onClick={onClose} variant="outline">
              Cerrar
            </Button>
          </div>
        ) : (
          <>
            {canQuickApply && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-accent/10 border border-accent/20 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <Lightning size={24} weight="fill" className="text-accent-foreground shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Postulación Rápida Disponible</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Aplica en un clic usando tu perfil y CV guardados
                    </p>
                    <Button
                      onClick={handleQuickApply}
                      disabled={isSubmitting}
                      size="sm"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Lightning size={16} weight="fill" />
                          </motion.div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Lightning size={16} weight="fill" />
                          Postular Rápido
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso del formulario</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Correo electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="juan@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+57 300 123 4567"
                    required
                  />
                </div>

                {!currentUser?.cvFile && (
                  <div>
                    <Label htmlFor="cv">CV / Hoja de Vida *</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload size={32} weight="duotone" className="mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">Adjuntar CV</p>
                      <p className="text-xs text-muted-foreground">PDF o DOCX, máximo 5 MB</p>
                    </div>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {job.customQuestions && job.customQuestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-border"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <Warning size={14} weight="fill" />
                        Preguntas Específicas
                      </Badge>
                    </div>
                    
                    {job.customQuestions.map((question) => (
                      <div key={question.id}>
                        <Label htmlFor={question.id}>
                          {question.question}
                          {question.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <div className="mt-2">
                          {renderCustomQuestion(question)}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <DialogFooter className="gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-secondary hover:bg-secondary/90 gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <PaperPlaneRight size={16} weight="bold" />
                      </motion.div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <PaperPlaneRight size={16} weight="bold" />
                      Enviar Postulación
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
