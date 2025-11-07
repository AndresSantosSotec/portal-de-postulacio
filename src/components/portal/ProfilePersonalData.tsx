import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { 
  PencilSimple, 
  Plus,
  Trash,
  FloppyDisk,
  IdentificationCard,
  Phone,
  MapPin,
  CalendarBlank,
  GraduationCap,
  Briefcase,
  User as UserIcon,
  EnvelopeSimple
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { User, WorkReference, PersonalReference } from '@/lib/types'

type ProfilePersonalDataProps = {
  user: User
  onUpdateUser: (user: User) => void
}

export default function ProfilePersonalData({ user, onUpdateUser }: ProfilePersonalDataProps) {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingProfessional, setIsEditingProfessional] = useState(false)
  const [editingWorkRef, setEditingWorkRef] = useState<string | null>(null)
  const [editingPersonalRef, setEditingPersonalRef] = useState<string | null>(null)

  const [personalData, setPersonalData] = useState({
    fullName: user.profile?.fullName || '',
    dateOfBirth: user.profile?.dateOfBirth || '',
    phone: user.profile?.phone || '',
    address: user.profile?.address || '',
    dpi: user.profile?.dpi || ''
  })

  const [professionalData, setProfessionalData] = useState({
    middleSchoolDegree: user.profile?.middleSchoolDegree || '',
    universityDegree: user.profile?.universityDegree || '',
    profession: user.profile?.profession || '',
    additionalStudies: user.profile?.additionalStudies || ''
  })

  const [newWorkRef, setNewWorkRef] = useState({
    name: '',
    company: '',
    position: '',
    phone: '',
    email: ''
  })

  const [newPersonalRef, setNewPersonalRef] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  })

  const handleSavePersonal = () => {
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        ...personalData
      }
    }
    onUpdateUser(updatedUser)
    setIsEditingPersonal(false)
    toast.success('Datos personales actualizados')
  }

  const handleSaveProfessional = () => {
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        ...professionalData
      }
    }
    onUpdateUser(updatedUser)
    setIsEditingProfessional(false)
    toast.success('Datos profesionales actualizados')
  }

  const handleAddWorkReference = () => {
    if (!newWorkRef.name || !newWorkRef.company || !newWorkRef.phone) {
      toast.error('Por favor completa los campos requeridos')
      return
    }

    const workRef: WorkReference = {
      id: Date.now().toString(),
      ...newWorkRef
    }

    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        workReferences: [...(user.profile?.workReferences || []), workRef]
      }
    }

    onUpdateUser(updatedUser)
    setNewWorkRef({ name: '', company: '', position: '', phone: '', email: '' })
    toast.success('Referencia laboral agregada')
  }

  const handleDeleteWorkReference = (id: string) => {
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        workReferences: user.profile?.workReferences?.filter(ref => ref.id !== id) || []
      }
    }
    onUpdateUser(updatedUser)
    toast.success('Referencia eliminada')
  }

  const handleAddPersonalReference = () => {
    if (!newPersonalRef.name || !newPersonalRef.relationship || !newPersonalRef.phone) {
      toast.error('Por favor completa los campos requeridos')
      return
    }

    const personalRef: PersonalReference = {
      id: Date.now().toString(),
      ...newPersonalRef
    }

    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        personalReferences: [...(user.profile?.personalReferences || []), personalRef]
      }
    }

    onUpdateUser(updatedUser)
    setNewPersonalRef({ name: '', relationship: '', phone: '', email: '' })
    toast.success('Referencia personal agregada')
  }

  const handleDeletePersonalReference = (id: string) => {
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        personalReferences: user.profile?.personalReferences?.filter(ref => ref.id !== id) || []
      }
    }
    onUpdateUser(updatedUser)
    toast.success('Referencia eliminada')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <UserIcon size={24} weight="duotone" className="text-primary" />
              Datos Personales
            </CardTitle>
            <CardDescription className="mt-1.5">
              Información personal y de contacto
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditingPersonal(!isEditingPersonal)}
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <PencilSimple size={20} weight="duotone" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditingPersonal ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  value={personalData.fullName}
                  onChange={(e) => setPersonalData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Juan Carlos Pérez García"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalData.dateOfBirth}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dpi">DPI</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <IdentificationCard size={18} weight="duotone" />
                    </div>
                    <Input
                      id="dpi"
                      value={personalData.dpi}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, dpi: e.target.value }))}
                      placeholder="0000 00000 0000"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Phone size={18} weight="duotone" />
                  </div>
                  <Input
                    id="phone"
                    value={personalData.phone}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+502 0000-0000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-muted-foreground">
                    <MapPin size={18} weight="duotone" />
                  </div>
                  <Textarea
                    id="address"
                    value={personalData.address}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Calle, zona, ciudad, departamento"
                    className="pl-10 min-h-[80px]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSavePersonal} className="gap-2">
                  <FloppyDisk size={18} weight="duotone" />
                  Guardar
                </Button>
                <Button variant="outline" onClick={() => setIsEditingPersonal(false)}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nombre Completo</p>
                  <p className="font-medium">{personalData.fullName || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Fecha de Nacimiento</p>
                  <p className="font-medium">
                    {personalData.dateOfBirth 
                      ? new Date(personalData.dateOfBirth).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'No especificada'}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">DPI</p>
                  <p className="font-medium">{personalData.dpi || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Teléfono</p>
                  <p className="font-medium">{personalData.phone || 'No especificado'}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Dirección</p>
                <p className="font-medium">{personalData.address || 'No especificada'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <GraduationCap size={24} weight="duotone" className="text-primary" />
              Datos Profesionales
            </CardTitle>
            <CardDescription className="mt-1.5">
              Educación y formación académica
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditingProfessional(!isEditingProfessional)}
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <PencilSimple size={20} weight="duotone" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditingProfessional ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="middleSchoolDegree">Título de Nivel Medio</Label>
                <Input
                  id="middleSchoolDegree"
                  value={professionalData.middleSchoolDegree}
                  onChange={(e) => setProfessionalData(prev => ({ ...prev, middleSchoolDegree: e.target.value }))}
                  placeholder="Bachiller en Ciencias y Letras"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="universityDegree">Título Universitario</Label>
                <Input
                  id="universityDegree"
                  value={professionalData.universityDegree}
                  onChange={(e) => setProfessionalData(prev => ({ ...prev, universityDegree: e.target.value }))}
                  placeholder="Ingeniería en Sistemas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profesión / Especialidad</Label>
                <Input
                  id="profession"
                  value={professionalData.profession}
                  onChange={(e) => setProfessionalData(prev => ({ ...prev, profession: e.target.value }))}
                  placeholder="Desarrollador Full Stack"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalStudies">Estudios Adicionales</Label>
                <Textarea
                  id="additionalStudies"
                  value={professionalData.additionalStudies}
                  onChange={(e) => setProfessionalData(prev => ({ ...prev, additionalStudies: e.target.value }))}
                  placeholder="Cursos, certificaciones, diplomados, etc."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSaveProfessional} className="gap-2">
                  <FloppyDisk size={18} weight="duotone" />
                  Guardar
                </Button>
                <Button variant="outline" onClick={() => setIsEditingProfessional(false)}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Título de Nivel Medio</p>
                <p className="font-medium">{professionalData.middleSchoolDegree || 'No especificado'}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Título Universitario</p>
                <p className="font-medium">{professionalData.universityDegree || 'No especificado'}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Profesión / Especialidad</p>
                <p className="font-medium">{professionalData.profession || 'No especificada'}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Estudios Adicionales</p>
                <p className="font-medium whitespace-pre-line">{professionalData.additionalStudies || 'No especificados'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Briefcase size={24} weight="duotone" className="text-primary" />
            Referencias Laborales
          </CardTitle>
          <CardDescription className="mt-1.5">
            Personas que pueden confirmar tu experiencia laboral
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {user.profile?.workReferences && user.profile.workReferences.length > 0 && (
            <div className="space-y-3">
              {user.profile.workReferences.map((ref) => (
                <motion.div
                  key={ref.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-border rounded-lg bg-muted/30 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{ref.name}</p>
                      <p className="text-sm text-muted-foreground">{ref.position} en {ref.company}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteWorkReference(ref.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash size={18} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone size={16} weight="duotone" />
                      <span>{ref.phone}</span>
                    </div>
                    {ref.email && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <EnvelopeSimple size={16} weight="duotone" />
                        <span>{ref.email}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <Separator />

          <div className="space-y-4 p-4 border border-dashed border-border rounded-lg bg-muted/20">
            <p className="text-sm font-semibold text-foreground">Agregar Nueva Referencia Laboral</p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="work-ref-name" className="text-xs">Nombre</Label>
                <Input
                  id="work-ref-name"
                  value={newWorkRef.name}
                  onChange={(e) => setNewWorkRef(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre completo"
                  className="h-9"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="work-ref-company" className="text-xs">Empresa</Label>
                <Input
                  id="work-ref-company"
                  value={newWorkRef.company}
                  onChange={(e) => setNewWorkRef(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Nombre de empresa"
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="work-ref-position" className="text-xs">Cargo</Label>
                <Input
                  id="work-ref-position"
                  value={newWorkRef.position}
                  onChange={(e) => setNewWorkRef(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Gerente, Supervisor, etc."
                  className="h-9"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="work-ref-phone" className="text-xs">Teléfono</Label>
                <Input
                  id="work-ref-phone"
                  value={newWorkRef.phone}
                  onChange={(e) => setNewWorkRef(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+502 0000-0000"
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="work-ref-email" className="text-xs">Email (opcional)</Label>
              <Input
                id="work-ref-email"
                type="email"
                value={newWorkRef.email}
                onChange={(e) => setNewWorkRef(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@ejemplo.com"
                className="h-9"
              />
            </div>

            <Button onClick={handleAddWorkReference} className="w-full gap-2" size="sm">
              <Plus size={18} weight="bold" />
              Agregar Referencia Laboral
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <UserIcon size={24} weight="duotone" className="text-primary" />
            Referencias Personales
          </CardTitle>
          <CardDescription className="mt-1.5">
            Personas que puedan dar referencias sobre tu carácter
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {user.profile?.personalReferences && user.profile.personalReferences.length > 0 && (
            <div className="space-y-3">
              {user.profile.personalReferences.map((ref) => (
                <motion.div
                  key={ref.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-border rounded-lg bg-muted/30 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{ref.name}</p>
                      <p className="text-sm text-muted-foreground">{ref.relationship}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePersonalReference(ref.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash size={18} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone size={16} weight="duotone" />
                      <span>{ref.phone}</span>
                    </div>
                    {ref.email && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <EnvelopeSimple size={16} weight="duotone" />
                        <span>{ref.email}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <Separator />

          <div className="space-y-4 p-4 border border-dashed border-border rounded-lg bg-muted/20">
            <p className="text-sm font-semibold text-foreground">Agregar Nueva Referencia Personal</p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="personal-ref-name" className="text-xs">Nombre</Label>
                <Input
                  id="personal-ref-name"
                  value={newPersonalRef.name}
                  onChange={(e) => setNewPersonalRef(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre completo"
                  className="h-9"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="personal-ref-relationship" className="text-xs">Relación</Label>
                <Input
                  id="personal-ref-relationship"
                  value={newPersonalRef.relationship}
                  onChange={(e) => setNewPersonalRef(prev => ({ ...prev, relationship: e.target.value }))}
                  placeholder="Amigo, vecino, etc."
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="personal-ref-phone" className="text-xs">Teléfono</Label>
                <Input
                  id="personal-ref-phone"
                  value={newPersonalRef.phone}
                  onChange={(e) => setNewPersonalRef(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+502 0000-0000"
                  className="h-9"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="personal-ref-email" className="text-xs">Email (opcional)</Label>
                <Input
                  id="personal-ref-email"
                  type="email"
                  value={newPersonalRef.email}
                  onChange={(e) => setNewPersonalRef(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@ejemplo.com"
                  className="h-9"
                />
              </div>
            </div>

            <Button onClick={handleAddPersonalReference} className="w-full gap-2" size="sm">
              <Plus size={18} weight="bold" />
              Agregar Referencia Personal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
