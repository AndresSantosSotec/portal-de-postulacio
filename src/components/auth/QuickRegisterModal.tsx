import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, Dial
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/tex
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
  Upload
  CheckCircle,
  Lightnin
import {

  isOpen:
  onSuccess: (us
}
  Upload,
  FilePdf,
  CheckCircle,
  CaretRight,
  Lightning
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { User } from '@/lib/types'

type QuickRegisterModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: User, quickApply?: boolean) => void
  jobTitle?: string
}

type RegistrationStep = 'basic' | 'personal' | 'professional' | 'documents'

export default function QuickRegisterModal({ isOpen, onClose, onSuccess, jobTitle }: QuickRegisterModalProps) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('basic')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    dateOfBirth: '',
    if (!val
    phone: '',
    if (currentI
    middleSchoolDegree: '',
  }
    additionalStudies: '',
    profession: ''
  })

  const steps: RegistrationStep[] = ['basic', 'personal', 'professional', 'documents']
  const stepLabels = {
    basic: 'Cuenta',
    personal: 'Datos Personales',
    professional: 'Profesión',
      } else {
   

  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
    if (!validateStep()) return
    
        phone: formData.phone,
        middleSchoolDegree: formData.middl
        profession: formData.profession,
     
   

      }

    onSuccess(user, quickAp
  }
  con
   

  }
  return (
    
          <moti
            animate={{ scale: 1, opacity:
          >
              
          </motion.div>
            <div className="text-center">
       
     
   

                Paso {currentS
            </div>
        </DialogHea
        <div className="mt-6">
            {currentStep === 'basic' && (
                key="b
         
                transition={{ duration: 0.2
              >
                  <Lab
         
                   
                    </
                      id="email"
                      placeholder="tu@email.com"
                      
         
                </d
                <div class
                   
                  <div 
                   
              
                   
     
   

              </motion.div>


                initial=
                exit={{ opacity:
                className="s
                <div className="sp
                    Nombre Com
                
                    type="text"
        dateOfBirth: formData.dateOfBirth,
        dpi: formData.dpi,
        phone: formData.phone,
        address: formData.address,
        middleSchoolDegree: formData.middleSchoolDegree,
        universityDegree: formData.universityDegree,
        profession: formData.profession,
        additionalStudies: formData.additionalStudies,
        cvFile: cvFile?.name,
        workReferences: [],
        personalReferences: [],
        experience: [],
        education: [],
        skills: []
      }
    }

    toast.success(quickApply ? '¡Registro y postulación exitosa!' : '¡Registro completado!')
    onSuccess(user, quickApply)
    onClose()
  }

  const handleStepAction = () => {
    if (currentStep === 'documents') {
      handleSubmit(false)
    } else {
      handleNext()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle className="text-2xl font-bold text-center mb-2">
              Registro Rápido
            </DialogTitle>
          </motion.div>
          {jobTitle && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Postulándote a: <span className="font-semibold text-foreground">{jobTitle}</span>
              </p>
            </div>
            
          <DialogDescription className="text-center">
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Paso {currentStepIndex + 1} de {steps.length}: {stepLabels[currentStep]}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
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
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Juan Carlos Pérez García"
                    </p>
                      onClick={() => handleSubmit(true)}
                      size="lg"
                    
                    </

            )}
        </div>
        <div className="flex gap-3 mt-6 pt-6 border-t">
            <Button
              onClick={handl
              size="lg"
              Atrás
          )}
          <Button
            className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:t
          >
            {currentSt
        </div>

}











































































































































































































































                    </p>
                    <Button
                      onClick={() => handleSubmit(true)}
                      className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary"
                      size="lg"
                    >
                      <Lightning size={20} weight="fill" className="mr-2" />
                      Registrar y Postularme
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t">
          {currentStep !== 'basic' && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
              size="lg"
            >
              Atrás
            </Button>
          )}
          
          <Button
            onClick={handleStepAction}
            className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            size="lg"
          >
            {currentStep === 'documents' ? 'Completar Registro' : 'Siguiente'}
            {currentStep !== 'documents' && <CaretRight size={20} weight="bold" className="ml-1" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
