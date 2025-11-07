import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import {
  EnvelopeSimple,
  LockKey,
  User,
  IdentificationCard,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Upload,
  CheckCircle,
  Lightning
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { User as UserType } from '@/lib/types'

type RegistrationStep = 'basic' | 'personal' | 'professional' | 'documents'

type QuickRegisterModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: UserType, quickApply?: boolean) => void
  jobTitle?: string
}

export default function QuickRegisterModal({ isOpen, onClose, onSuccess, jobTitle }: QuickRegisterModalProps) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('basic')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    dateOfBirth: '',
    dpi: '',
    phone: '',
    address: '',
    profession: '',
    middleSchoolDegree: '',
    universityDegree: '',
    additionalStudies: ''
  })

  const steps: RegistrationStep[] = ['basic', 'personal', 'professional', 'documents']
  const stepTitles = {
    basic: 'Datos Básicos',
    personal: 'Datos Personales',
    professional: 'Datos Profesionales',
    documents: 'Documentos'
  }

  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
    if (!validateStep()) return
    
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
    }
  }

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 'basic':
        if (!formData.email || !formData.password) {
          toast.error('Por favor completa todos los campos requeridos')
          return false
        }
        if (formData.password.length < 6) {
          toast.error('La contraseña debe tener al menos 6 caracteres')
          return false
        }
        break
      case 'personal':
        if (!formData.fullName || !formData.dateOfBirth || !formData.dpi || !formData.phone) {
          toast.error('Por favor completa todos los campos requeridos')
          return false
        }
        break
      case 'professional':
        if (!formData.profession) {
          toast.error('Por favor completa todos los campos requeridos')
          return false
        }
        break
    }
    return true
  }

  const handleSubmit = (quickApply: boolean = false) => {
    if (!validateStep()) return

    const user: UserType = {
      id: `user-${Date.now()}`,
      email: formData.email,
      password: formData.password,
      name: formData.fullName,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.fullName)}`,
      profile: {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        dpi: formData.dpi,
        phone: formData.phone,
        address: formData.address,
        profession: formData.profession,
        middleSchoolDegree: formData.middleSchoolDegree,
        universityDegree: formData.universityDegree,
        additionalStudies: formData.additionalStudies,
        cvFile: cvFile ? URL.createObjectURL(cvFile) : undefined,
        experience: [],
        education: [],
        skills: []
      }
    }

    toast.success(quickApply 
      ? '¡Cuenta creada y postulación enviada!'
      : '¡Cuenta creada exitosamente!'
    )
    onSuccess(user, quickApply)
    onClose()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setCvFile(file)
        toast.success('Archivo cargado exitosamente')
      } else {
        toast.error('Solo se permiten archivos PDF o Word')
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Registro Completo</DialogTitle>
          <DialogDescription>
            Paso {currentStepIndex + 1} de {steps.length}: {stepTitles[currentStep]}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Progress value={progress} className="h-2" />

          <AnimatePresence mode="wait">
            {currentStep === 'basic' && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Correo Electrónico <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <EnvelopeSimple size={20} weight="duotone" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-11 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold">
                    Contraseña <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <LockKey size={20} weight="duotone" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-11 h-12"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-semibold">
                    Nombre Completo <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User size={20} weight="duotone" />
                    </div>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Juan Pérez García"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="pl-11 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-semibold">
                    Fecha de Nacimiento <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dpi" className="text-sm font-semibold">
                    DPI <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <IdentificationCard size={20} weight="duotone" />
                    </div>
                    <Input
                      id="dpi"
                      type="text"
                      placeholder="1234 56789 0123"
                      value={formData.dpi}
                      onChange={(e) => setFormData(prev => ({ ...prev, dpi: e.target.value }))}
                      className="pl-11 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold">
                    Teléfono <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Phone size={20} weight="duotone" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+502 1234 5678"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-11 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold">
                    Dirección
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-muted-foreground">
                      <MapPin size={20} weight="duotone" />
                    </div>
                    <Textarea
                      id="address"
                      placeholder="Ciudad, zona, dirección completa"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="pl-11 min-h-[80px]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'professional' && (
              <motion.div
                key="professional"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="profession" className="text-sm font-semibold">
                    Profesión <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Briefcase size={20} weight="duotone" />
                    </div>
                    <Input
                      id="profession"
                      type="text"
                      placeholder="Ej: Ingeniero en Sistemas"
                      value={formData.profession}
                      onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                      className="pl-11 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleSchoolDegree" className="text-sm font-semibold">
                    Título de Educación Media
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <GraduationCap size={20} weight="duotone" />
                    </div>
                    <Input
                      id="middleSchoolDegree"
                      type="text"
                      placeholder="Ej: Bachiller en Ciencias y Letras"
                      value={formData.middleSchoolDegree}
                      onChange={(e) => setFormData(prev => ({ ...prev, middleSchoolDegree: e.target.value }))}
                      className="pl-11 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="universityDegree" className="text-sm font-semibold">
                    Título Universitario
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <GraduationCap size={20} weight="duotone" />
                    </div>
                    <Input
                      id="universityDegree"
                      type="text"
                      placeholder="Ej: Licenciatura en..."
                      value={formData.universityDegree}
                      onChange={(e) => setFormData(prev => ({ ...prev, universityDegree: e.target.value }))}
                      className="pl-11 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalStudies" className="text-sm font-semibold">
                    Estudios Adicionales
                  </Label>
                  <Textarea
                    id="additionalStudies"
                    placeholder="Cursos, certificaciones, diplomados..."
                    value={formData.additionalStudies}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalStudies: e.target.value }))}
                    className="min-h-[80px]"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 'documents' && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Curriculum Vitae (CV)
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    {cvFile ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-center text-success">
                          <CheckCircle size={40} weight="fill" />
                        </div>
                        <p className="text-sm font-medium">{cvFile.name}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCvFile(null)}
                        >
                          Cambiar archivo
                        </Button>
                      </motion.div>
                    ) : (
                      <label htmlFor="cv-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-muted-foreground">
                            <Upload size={40} weight="duotone" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Haz clic para subir tu CV</p>
                            <p className="text-xs text-muted-foreground">PDF o Word (máx. 10MB)</p>
                          </div>
                        </div>
                        <input
                          id="cv-upload"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {jobTitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-secondary/20 border border-secondary rounded-lg p-4 space-y-3"
                  >
                    <p className="text-sm text-center font-medium">
                      ¿Deseas postularte inmediatamente a <span className="text-secondary font-bold">{jobTitle}</span>?
                    </p>
                    <Button
                      onClick={() => handleSubmit(true)}
                      className="w-full bg-gradient-to-r from-secondary to-secondary/90"
                      size="lg"
                    >
                      <Lightning size={20} weight="fill" className="mr-2" />
                      Registrar y Postularme Ahora
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t">
          {currentStepIndex > 0 && (
            <Button
              onClick={handleBack}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Atrás
            </Button>
          )}
          <Button
            onClick={currentStep === 'documents' ? () => handleSubmit(false) : handleNext}
            size="lg"
            className="flex-1"
          >
            {currentStep === 'documents' ? 'Completar Registro' : 'Siguiente'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
