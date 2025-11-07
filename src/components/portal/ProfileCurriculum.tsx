import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  PencilSimple, 
  Plus, 
  Trash, 
  FloppyDisk,
  Briefcase,
  GraduationCap,
  FileText,
  Lightbulb,
  CheckCircle,
  CalendarBlank,
  Buildings
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { User, WorkExperience, Education } from '@/lib/types'

type ProfileCurriculumProps = {
  user: User
  onUpdateUser: (user: User) => void
}

export default function ProfileCurriculum({ user, onUpdateUser }: ProfileCurriculumProps) {
  const [isEditingBasic, setIsEditingBasic] = useState(false)
  const [editingExp, setEditingExp] = useState<string | null>(null)
  const [editingEdu, setEditingEdu] = useState<string | null>(null)
  const [newSkill, setNewSkill] = useState('')

  const [basicData, setBasicData] = useState({
    name: user.name,
    phone: user.profile?.phone || '',
    location: user.profile?.location || '',
    bio: user.profile?.bio || ''
  })

  const handleSaveBasic = () => {
    const updatedUser: User = {
      ...user,
      name: basicData.name,
      profile: {
        ...user.profile!,
        phone: basicData.phone,
        location: basicData.location,
        bio: basicData.bio
      }
    }
    onUpdateUser(updatedUser)
    setIsEditingBasic(false)
    toast.success('Información actualizada')
  }

  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: `exp_${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
    
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        experience: [...(user.profile?.experience || []), newExp]
      }
    }
    onUpdateUser(updatedUser)
    setEditingExp(newExp.id)
  }

  const handleUpdateExperience = (id: string, updates: Partial<WorkExperience>) => {
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        experience: user.profile!.experience.map(exp => 
          exp.id === id ? { ...exp, ...updates } : exp
        )
      }
    }
    onUpdateUser(updatedUser)
  }

  const handleRemoveExperience = (id: string) => {
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        experience: user.profile!.experience.filter(exp => exp.id !== id)
      }
    }
    onUpdateUser(updatedUser)
    toast.success('Experiencia eliminada')
  }

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu_${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false
    }
    
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        education: [...(user.profile?.education || []), newEdu]
      }
    }
    onUpdateUser(updatedUser)
    setEditingEdu(newEdu.id)
  }

  const handleUpdateEducation = (id: string, updates: Partial<Education>) => {
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        education: user.profile!.education.map(edu => 
          edu.id === id ? { ...edu, ...updates } : edu
        )
      }
    }
    onUpdateUser(updatedUser)
  }

  const handleRemoveEducation = (id: string) => {
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        education: user.profile!.education.filter(edu => edu.id !== id)
      }
    }
    onUpdateUser(updatedUser)
    toast.success('Educación eliminada')
  }

  const handleAddSkill = () => {
    if (!newSkill.trim()) return
    
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        skills: [...(user.profile?.skills || []), newSkill.trim()]
      }
    }
    onUpdateUser(updatedUser)
    setNewSkill('')
    toast.success('Habilidad agregada')
  }

  const handleRemoveSkill = (skill: string) => {
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        skills: user.profile!.skills.filter(s => s !== skill)
      }
    }
    onUpdateUser(updatedUser)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText size={24} weight="duotone" className="text-primary" />
                  </div>
                  <div>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Datos básicos de tu perfil</CardDescription>
                  </div>
                </div>
                <Button
                  variant={isEditingBasic ? "default" : "outline"}
                  size="sm"
                  onClick={() => isEditingBasic ? handleSaveBasic() : setIsEditingBasic(true)}
                  className="gap-2"
                >
                  {isEditingBasic ? (
                    <>
                      <FloppyDisk size={16} />
                      Guardar
                    </>
                  ) : (
                    <>
                      <PencilSimple size={16} />
                      Editar
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={basicData.name}
                    onChange={(e) => setBasicData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditingBasic}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email} disabled />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={basicData.phone}
                    onChange={(e) => setBasicData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditingBasic}
                    placeholder="+502 1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={basicData.location}
                    onChange={(e) => setBasicData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditingBasic}
                    placeholder="Ciudad, País"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Resumen Profesional</Label>
                <Textarea
                  id="bio"
                  value={basicData.bio}
                  onChange={(e) => setBasicData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditingBasic}
                  placeholder="Describe tu perfil profesional, experiencia y objetivos..."
                  rows={4}
                  maxLength={1000}
                  className="resize-none"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {basicData.bio.length}/1000 caracteres
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Briefcase size={24} weight="duotone" className="text-secondary" />
                  </div>
                  <div>
                    <CardTitle>Experiencia Laboral</CardTitle>
                    <CardDescription>Historial de empleos y responsabilidades</CardDescription>
                  </div>
                </div>
                <Button size="sm" onClick={handleAddExperience} className="gap-2">
                  <Plus size={16} weight="bold" />
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.profile?.experience.length === 0 ? (
                <div className="py-12 text-center">
                  <Briefcase size={48} className="mx-auto mb-3 text-muted-foreground/50" weight="duotone" />
                  <p className="text-muted-foreground">No has agregado experiencia laboral</p>
                  <p className="text-sm text-muted-foreground mt-1">Haz clic en "Agregar" para comenzar</p>
                </div>
              ) : (
                user.profile?.experience.map((exp, index) => {
                  const isEditing = editingExp === exp.id
                  
                  return (
                    <div key={exp.id} className="relative">
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="p-5 rounded-xl bg-muted/30 border border-border/50 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-3">
                            {isEditing ? (
                              <>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <Input
                                    placeholder="Cargo / Puesto"
                                    value={exp.position}
                                    onChange={(e) => handleUpdateExperience(exp.id, { position: e.target.value })}
                                  />
                                  <Input
                                    placeholder="Empresa"
                                    value={exp.company}
                                    onChange={(e) => handleUpdateExperience(exp.id, { company: e.target.value })}
                                  />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <Input
                                    type="month"
                                    placeholder="Fecha inicio"
                                    value={exp.startDate}
                                    onChange={(e) => handleUpdateExperience(exp.id, { startDate: e.target.value })}
                                  />
                                  <Input
                                    type="month"
                                    placeholder="Fecha fin"
                                    value={exp.endDate}
                                    onChange={(e) => handleUpdateExperience(exp.id, { endDate: e.target.value })}
                                    disabled={exp.current}
                                  />
                                </div>
                                <Textarea
                                  placeholder="Describe tus responsabilidades y logros..."
                                  value={exp.description}
                                  onChange={(e) => handleUpdateExperience(exp.id, { description: e.target.value })}
                                  rows={3}
                                />
                              </>
                            ) : (
                              <>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="text-lg font-semibold text-foreground">{exp.position || 'Cargo sin título'}</h4>
                                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                      <Buildings size={16} weight="duotone" />
                                      <span>{exp.company || 'Empresa'}</span>
                                    </div>
                                  </div>
                                  {exp.current && (
                                    <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                                      Actual
                                    </Badge>
                                  )}
                                </div>
                                {(exp.startDate || exp.endDate) && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CalendarBlank size={16} weight="duotone" />
                                    <span>
                                      {exp.startDate} - {exp.current ? 'Presente' : exp.endDate || 'Presente'}
                                    </span>
                                  </div>
                                )}
                                {exp.description && (
                                  <p className="text-muted-foreground text-sm leading-relaxed">
                                    {exp.description}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingExp(isEditing ? null : exp.id)}
                            >
                              {isEditing ? <CheckCircle size={18} weight="fill" /> : <PencilSimple size={18} />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveExperience(exp.id)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <GraduationCap size={24} weight="duotone" className="text-accent" />
                  </div>
                  <div>
                    <CardTitle>Educación</CardTitle>
                    <CardDescription>Formación académica y certificaciones</CardDescription>
                  </div>
                </div>
                <Button size="sm" onClick={handleAddEducation} className="gap-2">
                  <Plus size={16} weight="bold" />
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.profile?.education.length === 0 ? (
                <div className="py-12 text-center">
                  <GraduationCap size={48} className="mx-auto mb-3 text-muted-foreground/50" weight="duotone" />
                  <p className="text-muted-foreground">No has agregado información educativa</p>
                  <p className="text-sm text-muted-foreground mt-1">Haz clic en "Agregar" para comenzar</p>
                </div>
              ) : (
                user.profile?.education.map((edu, index) => {
                  const isEditing = editingEdu === edu.id
                  
                  return (
                    <div key={edu.id}>
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="p-5 rounded-xl bg-muted/30 border border-border/50 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-3">
                            {isEditing ? (
                              <>
                                <Input
                                  placeholder="Institución"
                                  value={edu.institution}
                                  onChange={(e) => handleUpdateEducation(edu.id, { institution: e.target.value })}
                                />
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <Input
                                    placeholder="Título/Grado"
                                    value={edu.degree}
                                    onChange={(e) => handleUpdateEducation(edu.id, { degree: e.target.value })}
                                  />
                                  <Input
                                    placeholder="Campo de estudio"
                                    value={edu.field}
                                    onChange={(e) => handleUpdateEducation(edu.id, { field: e.target.value })}
                                  />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <Input
                                    type="month"
                                    placeholder="Fecha inicio"
                                    value={edu.startDate}
                                    onChange={(e) => handleUpdateEducation(edu.id, { startDate: e.target.value })}
                                  />
                                  <Input
                                    type="month"
                                    placeholder="Fecha fin"
                                    value={edu.endDate}
                                    onChange={(e) => handleUpdateEducation(edu.id, { endDate: e.target.value })}
                                    disabled={edu.current}
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="text-lg font-semibold text-foreground">{edu.degree || 'Título'}</h4>
                                    <p className="text-muted-foreground">{edu.institution || 'Institución'}</p>
                                    {edu.field && (
                                      <p className="text-sm text-muted-foreground mt-1">{edu.field}</p>
                                    )}
                                  </div>
                                  {edu.current && (
                                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                                      En curso
                                    </Badge>
                                  )}
                                </div>
                                {(edu.startDate || edu.endDate) && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CalendarBlank size={16} weight="duotone" />
                                    <span>
                                      {edu.startDate} - {edu.current ? 'Presente' : edu.endDate || 'Presente'}
                                    </span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingEdu(isEditing ? null : edu.id)}
                            >
                              {isEditing ? <CheckCircle size={18} weight="fill" /> : <PencilSimple size={18} />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveEducation(edu.id)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Lightbulb size={24} weight="duotone" className="text-warning" />
                </div>
                <div>
                  <CardTitle>Habilidades</CardTitle>
                  <CardDescription>Competencias técnicas y profesionales</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {user.profile?.skills && user.profile.skills.length > 0 ? (
                  user.profile.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="gap-2 pr-2 py-1.5 text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:bg-destructive/20 rounded-full p-1 transition-colors"
                      >
                        <Trash size={12} />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No has agregado habilidades</p>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Agregar habilidad (ej: JavaScript, Comunicación...)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSkill()
                    }
                  }}
                />
                <Button onClick={handleAddSkill} className="gap-2">
                  <Plus size={16} />
                  Agregar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Plantillas de CV</CardTitle>
              <CardDescription>Descarga tu currículum en diferentes formatos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-3" variant="outline">
                <FileText size={20} weight="duotone" />
                Diseña tu CV
              </Button>
              <Button className="w-full justify-start gap-3" variant="outline">
                <FileText size={20} weight="duotone" />
                Descargar PDF
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg">Cartas de Presentación</CardTitle>
              <CardDescription>Personaliza tu mensaje para cada postulación</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full justify-start gap-3" variant="outline">
                <FileText size={20} weight="duotone" />
                Crear carta
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-accent/5 to-warning/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb size={20} weight="duotone" className="text-warning" />
                Mejora tu CV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle size={16} weight="fill" className="text-secondary mt-0.5" />
                <span>Completa tu experiencia laboral</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} weight="fill" className="text-secondary mt-0.5" />
                <span>Agrega al menos 5 habilidades</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} weight="fill" className="text-secondary mt-0.5" />
                <span>Escribe un resumen profesional</span>
              </div>
              <Button size="sm" variant="secondary" className="w-full mt-3">
                Test de talento
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
