import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, Dial
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
  Envelop
  Phone, 
  IdentificationCa
  Briefcase
  FilePdf
  CaretRi
} from '@phosphor-ico
import type { Us
  Briefcase,
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

    phone: '',

    universityDegree: '',
    additionalStudies: ''

  const stepLabels = {
    personal:
    documents:


    const currentInd
      setCurre
  }
  const hand
    if (currentIndex > 0) {
    }

    const file = e.target
    

      } else {
      }
  }
  const validateStep = () => {
      case 'basic':
          toast.error('Por 
   

        }

          toast.error('Por f
        }
      case 'professional':
      case 'documents':
     
   

    if (!validateStep()) ret
    const user: User = {
      email: formData.email
      name: formData.name,
     
   

        middleSchoolDegree: formData.middleSchoolDegree,
        profession: formData.profess
        workRef
        experience: [],
        skills: []
    }
    toast.success(quickApply ? '¡Registro y postu
    onClose()

    if 
    i
   


    <Dialog open={isOpen} 
        <DialogHead
            initial={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
         
          <DialogTitle className="text-2xl 
          </DialogTitle>
          {jobTitle &&
         
              class
              <p class
              </p>
          )}
          <DialogDescr
         
          <div clas
            <p className="
            </p>
        </DialogHeader>
        <div classN
            {c
                key
     
   

                  <Label htmlFor="name" className="text-s
                  </Label>

                    </di
                      id="name"
                      placeh
                      onChange={(e
                    />
                </div>
                
                    Correo Electróni
                  <div className="relative
                      <Envelop
                    <Input
                      type
                      value={formData.email}
                      className="pl-11 h-12"
                  </div>

                  <Label ht
                  </Label>
                    <di
                    </
                  
       
     

                </div>
            )}
            {
   

                transition={{ dura
              >

                  </Label>
                    id="f
            
                  
     


          
                    <Input
                      type="date"
                      onChange={(e) => setFo
                    /

                    <Label htmlFor="dpi" class
                    </Label>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
           
                        id="dpi"
                       

                      />
                  </div>


                  </Labe
                    <di
                    </div>
                      id="phone"
                      placeholder="+502 0000-0000"
             
                    />
                </div>
                <d
                    Direc
            

                    <Textarea
                      placeholder="Calle, zona, c
                      onChange

                </div>
            )}
            {currentStep === 'professional' && (
                key="professional"
                
                
              >

                  </Label>
                    <div className="abs
                    </div>
                      id=
                      place
                      onChange={(e) => setFormD
                    />
                </div>
                <div className="space-y-2">
                    Título Universita
               
                      <GraduationCap size={
                    <Input
                      type="text"
                      valu
                      className="pl-11 h-11"
                  </div>

                  <Label h
                  </Label>
                    <div classN
                    </div>
                      id="profession"
                      placeholder="Desarrol
                      onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.valu
                    />
                </div>
                <div cla
                </div>

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
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="h-11"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-semibold">
                      Fecha de Nacimiento <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dpi" className="text-sm font-semibold">
                      DPI
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <IdentificationCard size={18} weight="duotone" />
                      </div>
                      <Input
                        id="dpi"
                        type="text"
                        placeholder="0000 00000 0000"
                        value={formData.dpi}
                        onChange={(e) => setFormData(prev => ({ ...prev, dpi: e.target.value }))}
                        className="pl-10 h-11"
                      />
                    </div>
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
                      placeholder="+502 0000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-11 h-11"
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
                      placeholder="Calle, zona, ciudad, departamento"
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
                  <Label htmlFor="middleSchoolDegree" className="text-sm font-semibold">
                    Título de Nivel Medio
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <GraduationCap size={20} weight="duotone" />
                    </div>
                    <Input
                      id="middleSchoolDegree"
                      type="text"
                      placeholder="Bachiller en Ciencias y Letras"
                      value={formData.middleSchoolDegree}
                      onChange={(e) => setFormData(prev => ({ ...prev, middleSchoolDegree: e.target.value }))}
                      className="pl-11 h-11"
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
                      placeholder="Ingeniería en Sistemas"
                      value={formData.universityDegree}
                      onChange={(e) => setFormData(prev => ({ ...prev, universityDegree: e.target.value }))}
                      className="pl-11 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession" className="text-sm font-semibold">
                    Profesión / Especialidad
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Briefcase size={20} weight="duotone" />
                    </div>
                    <Input
                      id="profession"
                      type="text"
                      placeholder="Desarrollador Full Stack"
                      value={formData.profession}
                      onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                      className="pl-11 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalStudies" className="text-sm font-semibold">
                    Estudios Adicionales
                  </Label>
                  <Textarea
                    id="additionalStudies"
                    placeholder="Cursos, certificaciones, diplomados, etc."
                    value={formData.additionalStudies}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalStudies: e.target.value }))}
                    className="min-h-[100px]"
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
                className="space-y-5"
              >
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Curriculum Vitae (CV)
                  </Label>
                  
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      cvFile 
                        ? 'border-secondary bg-secondary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <input
                      type="file"
                      id="cv-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {cvFile ? (
                      <div className="space-y-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <FilePdf size={48} weight="duotone" className="text-secondary mx-auto" />
                        </motion.div>
                        <div>
                          <p className="font-semibold text-foreground">{cvFile.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(cvFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-secondary">
                          <CheckCircle size={20} weight="fill" />
                          <span className="text-sm font-medium">CV cargado correctamente</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Upload size={48} weight="duotone" className="text-muted-foreground mx-auto" />
                        </motion.div>
                        <div>
                          <p className="font-medium text-foreground">
                            Haz clic o arrastra tu CV aquí
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, DOC o DOCX (máx. 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} weight="fill" className="text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Primera impresión lista</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Puedes completar tu perfil más tarde con referencias laborales y personales
                      </p>
                    </div>
                  </div>
                </div>

                {jobTitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/30 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Lightning size={24} weight="fill" className="text-secondary" />
                      <p className="font-semibold text-foreground">¿Postularse ahora?</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Puedes registrarte y postularte al puesto de <span className="font-semibold text-foreground">{jobTitle}</span> en un solo paso
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
                  <Label htmlFor="additionalStudies" className="text-sm font-semibold">
                    Estudios Adicionales
                  </Label>
                  <Textarea
                    id="additionalStudies"
                    placeholder="Cursos, certificaciones, diplomados, etc."
                    value={formData.additionalStudies}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalStudies: e.target.value }))}
                    className="min-h-[100px]"
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
                className="space-y-5"
              >
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Curriculum Vitae (CV)
                  </Label>
                  
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      cvFile 
                        ? 'border-secondary bg-secondary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <input
                      type="file"
                      id="cv-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {cvFile ? (
                      <div className="space-y-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <FilePdf size={48} weight="duotone" className="text-secondary mx-auto" />
                        </motion.div>
                        <div>
                          <p className="font-semibold text-foreground">{cvFile.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(cvFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-secondary">
                          <CheckCircle size={20} weight="fill" />
                          <span className="text-sm font-medium">CV cargado correctamente</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Upload size={48} weight="duotone" className="text-muted-foreground mx-auto" />
                        </motion.div>
                        <div>
                          <p className="font-medium text-foreground">
                            Haz clic o arrastra tu CV aquí
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, DOC o DOCX (máx. 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} weight="fill" className="text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Primera impresión lista</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Puedes completar tu perfil más tarde con referencias laborales y personales
                      </p>
                    </div>
                  </div>
                </div>

                {jobTitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/30 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Lightning size={24} weight="fill" className="text-secondary" />
                      <p className="font-semibold text-foreground">¿Postularse ahora?</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Puedes registrarte y postularte al puesto de <span className="font-semibold text-foreground">{jobTitle}</span> en un solo paso
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
