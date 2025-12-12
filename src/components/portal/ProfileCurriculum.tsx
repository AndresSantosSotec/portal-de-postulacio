import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
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
  Buildings,
  X,
  MagnifyingGlass,
  FunnelSimple,
  Certificate
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import ProfilePhotoUpload from './ProfilePhotoUpload'
import { applicationService, type Experience, type Education, type Skill, type PublicSkill } from '@/lib/applicationService'
import type { User, WorkExperience, Education as EducationType } from '@/lib/types'

type ProfileCurriculumProps = {
  user: User
  onUpdateUser: (user: User) => void
}

// Función helper para formatear fechas
// Maneja múltiples formatos: YYYY-MM-DD, YYYY-MM-DDTHH:MM:SS.ZZZZZZ, ISO strings
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString || dateString.trim() === '') {
    return ''
  }
  
  try {
    // Limpiar formato Laravel/ISO: remover microsegundos y 'Z'
    // Ejemplos de entrada:
    // - "2025-01-13" → OK
    // - "2025-01-13T00:00:00.000000Z" → limpiar a "2025-01-13"
    // - "2025-01-13T00:00:00Z" → limpiar a "2025-01-13"
    let cleanDate = dateString
    
    // Si contiene 'T', extraer solo la parte de la fecha
    if (cleanDate.includes('T')) {
      cleanDate = cleanDate.split('T')[0]
    }
    
    // Agregar T00:00:00 para forzar zona horaria local y evitar problema UTC
    const date = new Date(cleanDate + 'T00:00:00')
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return ''
    }
    
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
  } catch (error) {
    console.error('Error al formatear fecha:', error)
    return ''
  }
}

export default function ProfileCurriculum({ user, onUpdateUser }: ProfileCurriculumProps) {
  const [isEditingBasic, setIsEditingBasic] = useState(false)
  const [editingExp, setEditingExp] = useState<number | null>(null)
  const [editingEdu, setEditingEdu] = useState<number | null>(null)
  const [newSkill, setNewSkill] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [savingData, setSavingData] = useState(false)
  const [skillSearchTerm, setSkillSearchTerm] = useState('')
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  // Estados para datos del backend
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [educations, setEducations] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [publicSkills, setPublicSkills] = useState<PublicSkill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<Array<{ habilidad_id: number; nivel: string; certificada: boolean }>>([])
  const [showSkillSelector, setShowSkillSelector] = useState(false)

  const [basicData, setBasicData] = useState({
    name: user.name,
    phone: user.profile?.phone || '',
    location: user.profile?.location || '',
    bio: user.profile?.bio || ''
  })

  // Cargar datos del perfil al montar
  useEffect(() => {
    loadProfileData()
    loadPublicSkills()
  }, [])

  const loadProfileData = async () => {
    setLoadingProfile(true)
    try {
      // Cargar perfil completo (user + postulante)
      const completeProfile = await applicationService.getCompleteProfile()

      // Actualizar datos básicos con información del postulante
      if (completeProfile.postulante) {
        setBasicData({
          name: completeProfile.postulante.nombre_completo || completeProfile.user.name,
          phone: completeProfile.postulante.telefono || '',
          location: completeProfile.postulante.ubicacion || '',
          bio: completeProfile.postulante.bio || ''
        })
        
        // Si hay foto de perfil, actualizar el usuario
        if (completeProfile.postulante.foto_perfil_url) {
          const photoUrlWithTimestamp = completeProfile.postulante.foto_perfil_url.includes('?')
            ? `${completeProfile.postulante.foto_perfil_url}&t=${Date.now()}`
            : `${completeProfile.postulante.foto_perfil_url}?t=${Date.now()}`
          
          const updatedUser: User = {
            ...user,
            avatar: photoUrlWithTimestamp
          }
          onUpdateUser(updatedUser)
        }
      }

      // Cargar perfil de candidato (experiencias, educación, habilidades)
      const profile = await applicationService.getProfile()
      
      // Mapear experiencias asegurando que el ID esté presente
      const mappedExperiences = (profile.experiencias || []).map(exp => ({
        id: exp.id || (exp as any).id_experiencia,
        empresa: exp.empresa || '',
        puesto: exp.puesto || (exp as any).cargo || '', // Mapeo puesto/cargo
        fecha_inicio: exp.fecha_inicio || null, // Mantener null si no hay fecha
        fecha_fin: exp.fecha_fin || null, // Mantener null si no hay fecha
        es_actual: !exp.fecha_fin || exp.fecha_fin === null, // Si no tiene fecha_fin, es actual
        descripcion: exp.descripcion || ''
      }))
      
      // Mapear educaciones asegurando que el ID esté presente
      const mappedEducations = (profile.educaciones || []).map(edu => ({
        id: edu.id || (edu as any).id_educacion,
        institucion: edu.institucion || '',
        titulo: edu.titulo || (edu as any).titulo_obtenido || '', // Mapeo titulo/titulo_obtenido
        campo_estudio_id: edu.campo_estudio_id,
        fecha_inicio: edu.fecha_inicio || null, // Mantener null si no hay fecha
        fecha_fin: edu.fecha_fin || null, // Mantener null si no hay fecha
        es_actual: !edu.fecha_fin || edu.fecha_fin === null, // Si no tiene fecha_fin, es actual
        descripcion: edu.descripcion || ''
      }))
      
      setExperiences(mappedExperiences)
      setEducations(mappedEducations)
      setSkills(profile.habilidades || [])
    } catch (error) {
      console.error('Error al cargar perfil:', error)
      toast.error('Error al cargar datos del perfil')
    } finally {
      setLoadingProfile(false)
    }
  }

  const loadPublicSkills = async () => {
    try {
      const skills = await applicationService.getPublicSkills()
      setPublicSkills(skills)
    } catch (error) {
      console.error('Error al cargar habilidades públicas:', error)
    }
  }

  const calculateCompleteness = () => {
    let completed = 0
    const total = 7
    
    if (user.avatar) completed++
    if (user.name) completed++
    if (user.profile?.phone) completed++
    if (user.profile?.location) completed++
    if (user.profile?.bio) completed++
    if (experiences.length > 0) completed++
    if (educations.length > 0) completed++
    
    return Math.round((completed / total) * 100)
  }

  const handlePhotoUpdate = async (photoDataUrl: string) => {
    // Agregar timestamp para forzar recarga sin caché del navegador
    const photoUrlWithTimestamp = photoDataUrl.includes('?') 
      ? `${photoDataUrl}&t=${Date.now()}` 
      : `${photoDataUrl}?t=${Date.now()}`
    
    // Actualizar inmediatamente en el estado local
    const updatedUser: User = {
      ...user,
      avatar: photoUrlWithTimestamp
    }
    onUpdateUser(updatedUser)
    
    // Recargar perfil completo para asegurar sincronización
    await loadProfileData()
  }

  const handleSaveBasic = async () => {
    setSavingData(true)
    try {
      // Actualizar datos en el backend (tb_postulantes)
      await applicationService.updateProfile({
        nombre_completo: basicData.name,
        telefono: basicData.phone,
        ubicacion: basicData.location,
        bio: basicData.bio,
      })

      // Actualizar estado local del user
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
      toast.success('Información actualizada correctamente')
      
      // Recargar perfil para asegurar sincronización
      await loadProfileData()
    } catch (error: any) {
      console.error('Error al guardar datos básicos:', error)
      toast.error(error.message || 'Error al actualizar información')
    } finally {
      setSavingData(false)
    }
  }

  // ===== EXPERIENCIA LABORAL =====
  const handleAddExperience = async () => {
    // Simplemente abrir el panel de edición con datos vacíos
    const tempId = Date.now() // ID temporal
    const newExp: Experience = {
      id: tempId,
      empresa: '',
      puesto: '',
      fecha_inicio: null,  // null en lugar de cadena vacía
      fecha_fin: null,
      es_actual: true,
      descripcion: ''
    }
    setExperiences([...experiences, newExp])
    setEditingExp(tempId)
  }

  const handleUpdateExperience = (id: number, updates: Partial<Experience>) => {
    // Actualizar localmente mientras se edita
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, ...updates } : exp))
  }

  const handleSaveExperience = async (id: number) => {
    const exp = experiences.find(e => e.id === id)
    if (!exp) return

    // Validación
    if (!exp.empresa || !exp.puesto || !exp.fecha_inicio) {
      toast.error('Por favor completa empresa, puesto y fecha de inicio')
      return
    }

    // Validar que si no es actual, debe tener fecha_fin
    if (!exp.es_actual && !exp.fecha_fin) {
      toast.error('Por favor ingresa la fecha de fin o marca como trabajo actual')
      return
    }

    setSavingData(true)
    try {
      let savedExperience: Experience
      
      // Si el ID es temporal (mayor a 1000000000000), crear nueva experiencia
      if (id > 1000000000000) {
        savedExperience = await applicationService.addExperience({
          empresa: exp.empresa,
          puesto: exp.puesto,
          fecha_inicio: exp.fecha_inicio,
          fecha_fin: exp.es_actual ? undefined : exp.fecha_fin,
          es_actual: exp.es_actual,
          descripcion: exp.descripcion || ''
        })
        // Reemplazar el registro temporal con el real
        setExperiences(experiences.map(e => e.id === id ? savedExperience : e))
      } else {
        // Actualizar experiencia existente
        savedExperience = await applicationService.updateExperience(id, {
          empresa: exp.empresa,
          puesto: exp.puesto,
          fecha_inicio: exp.fecha_inicio,
          fecha_fin: exp.es_actual ? undefined : exp.fecha_fin,
          es_actual: exp.es_actual,
          descripcion: exp.descripcion || ''
        })
        // Actualizar el registro existente
        setExperiences(experiences.map(e => e.id === id ? savedExperience : e))
      }
      
      setEditingExp(null)
      toast.success('Experiencia guardada')
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar experiencia')
    } finally {
      setSavingData(false)
    }
  }

  const handleRemoveExperience = async (id: number) => {
    // Si el ID es temporal (no guardado en backend), solo remover del estado local
    if (id > 1000000000000) {
      setExperiences(experiences.filter(exp => exp.id !== id))
      setEditingExp(null)
      toast.success('Cambios descartados')
      return
    }

    // Validar que el ID sea válido
    if (!id || id === undefined || isNaN(id)) {
      toast.error('Error: ID de experiencia inválido')
      return
    }

    setSavingData(true)
    try {
      await applicationService.deleteExperience(id)
      setExperiences(experiences.filter(exp => exp.id !== id))
      toast.success('Experiencia eliminada')
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar experiencia')
    } finally {
      setSavingData(false)
    }
  }

  // ===== EDUCACIÓN =====
  const handleAddEducation = () => {
    // Simplemente abrir el panel de edición con datos vacíos
    const tempId = Date.now() // ID temporal
    const newEdu: Education = {
      id: tempId,
      institucion: '',
      titulo: '',
      fecha_inicio: null,  // null en lugar de cadena vacía
      fecha_fin: null,
      es_actual: true,
      descripcion: ''
    }
    setEducations([...educations, newEdu])
    setEditingEdu(tempId)
  }

  const handleUpdateEducation = (id: number, updates: Partial<Education>) => {
    // Actualizar localmente mientras se edita
    setEducations(educations.map(edu => edu.id === id ? { ...edu, ...updates } : edu))
  }

  const handleSaveEducation = async (id: number) => {
    const edu = educations.find(e => e.id === id)
    if (!edu) return

    // Validación
    if (!edu.institucion || !edu.titulo || !edu.fecha_inicio) {
      toast.error('Por favor completa institución, título y fecha de inicio')
      return
    }

    // Validar que si no está estudiando, debe tener fecha_fin
    if (!edu.es_actual && !edu.fecha_fin) {
      toast.error('Por favor ingresa la fecha de fin o marca como estudiando actualmente')
      return
    }

    setSavingData(true)
    try {
      let savedEducation: Education
      
      // Si el ID es temporal (mayor a 1000000000000), crear nueva educación
      if (id > 1000000000000) {
        savedEducation = await applicationService.addEducation({
          institucion: edu.institucion,
          titulo: edu.titulo,
          fecha_inicio: edu.fecha_inicio,
          fecha_fin: edu.es_actual ? undefined : edu.fecha_fin,
          es_actual: edu.es_actual,
          descripcion: edu.descripcion || ''
        })
        // Reemplazar el registro temporal con el real
        setEducations(educations.map(e => e.id === id ? savedEducation : e))
      } else {
        // Actualizar educación existente
        savedEducation = await applicationService.updateEducation(id, {
          institucion: edu.institucion,
          titulo: edu.titulo,
          fecha_inicio: edu.fecha_inicio,
          fecha_fin: edu.es_actual ? undefined : edu.fecha_fin,
          es_actual: edu.es_actual,
          descripcion: edu.descripcion || ''
        })
        // Actualizar el registro existente
        setEducations(educations.map(e => e.id === id ? savedEducation : e))
      }
      
      setEditingEdu(null)
      toast.success('Educación guardada')
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar educación')
    } finally {
      setSavingData(false)
    }
  }

  const handleRemoveEducation = async (id: number) => {
    // Si el ID es temporal (no guardado en backend), solo remover del estado local
    if (id > 1000000000000) {
      setEducations(educations.filter(edu => edu.id !== id))
      setEditingEdu(null)
      toast.success('Cambios descartados')
      return
    }

    // Validar que el ID sea válido
    if (!id || id === undefined || isNaN(id)) {
      toast.error('Error: ID de educación inválido')
      return
    }

    setSavingData(true)
    try {
      await applicationService.deleteEducation(id)
      // Eliminar directamente del estado sin recargar
      setEducations(educations.filter(edu => edu.id !== id))
      toast.success('Educación eliminada')
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar educación')
    } finally {
      setSavingData(false)
    }
  }

  // ===== HABILIDADES =====
  const handleAddSkill = (skillId: number) => {
    if (selectedSkills.some(s => s.habilidad_id === skillId)) {
      toast.error('Esta habilidad ya está agregada')
      return
    }
    setSelectedSkills([...selectedSkills, { habilidad_id: skillId, nivel: 'Intermedio', certificada: false }])
    toast.success('Habilidad agregada')
  }

  const handleRemoveSkill = (skillId: number) => {
    setSelectedSkills(selectedSkills.filter(s => s.habilidad_id !== skillId))
    toast.success('Habilidad removida')
  }

  const handleUpdateSkillLevel = (skillId: number, nivel: string) => {
    setSelectedSkills(selectedSkills.map(s => 
      s.habilidad_id === skillId ? { ...s, nivel } : s
    ))
  }

  const handleToggleCertified = (skillId: number) => {
    setSelectedSkills(selectedSkills.map(s => 
      s.habilidad_id === skillId ? { ...s, certificada: !s.certificada } : s
    ))
  }

  const handleSaveSkills = async () => {
    setSavingData(true)
    try {
      const updatedSkills = await applicationService.updateSkills(selectedSkills)
      setSkills(updatedSkills)
      setShowSkillSelector(false)
      setSkillSearchTerm('')
      setSelectedSkillLevel('all')
      setSelectedSkills([])
      toast.success('Habilidades actualizadas correctamente')
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar habilidades')
    } finally {
      setSavingData(false)
    }
  }

  const handleRemoveExistingSkill = async (skillId: number) => {
    const skillToRemove = skills.find(s => s.id === skillId)
    if (!skillToRemove) return

    setSavingData(true)
    try {
      const remainingSkills = skills.filter(s => s.id !== skillId).map(s => ({
        habilidad_id: s.id,
        nivel: s.nivel || 'Intermedio',
        certificada: s.certificada || false
      }))

      const updatedSkills = await applicationService.updateSkills(remainingSkills)
      
      setSkills(updatedSkills)
      toast.success('Habilidad eliminada')
    } catch (error: any) {
      console.error('Error al eliminar habilidad:', error)
      toast.error(error.message || 'Error al eliminar habilidad')
    } finally {
      setSavingData(false)
    }
  }

  const handleUpdateExistingSkillLevel = async (skillId: number, newLevel: string) => {
    setSavingData(true)
    try {
      const updatedSkillsList = skills.map(s => ({
        habilidad_id: s.id,
        nivel: s.id === skillId ? newLevel : (s.nivel || 'Intermedio'),
        certificada: s.certificada || false
      }))

      const updatedSkills = await applicationService.updateSkills(updatedSkillsList)
      
      setSkills(updatedSkills)
      toast.success('Nivel de habilidad actualizado')
    } catch (error: any) {
      console.error('Error al actualizar nivel:', error)
      toast.error(error.message || 'Error al actualizar nivel')
    } finally {
      setSavingData(false)
    }
  }

  const handleToggleExistingCertified = async (skillId: number) => {
    setSavingData(true)
    try {
      const skill = skills.find(s => s.id === skillId)
      if (!skill) return

      const updatedSkillsList = skills.map(s => ({
        habilidad_id: s.id,
        nivel: s.nivel || 'Intermedio',
        certificada: s.id === skillId ? !s.certificada : (s.certificada || false)
      }))

      const updatedSkills = await applicationService.updateSkills(updatedSkillsList)
      setSkills(updatedSkills)
      toast.success(skill.certificada ? 'Certificación removida' : 'Marcada como certificada')
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar certificación')
    } finally {
      setSavingData(false)
    }
  }

  const getSkillLevelColor = (nivel?: string) => {
    switch (nivel) {
      case 'Básico':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'Intermedio':
        return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'Avanzado':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20'

        return 'bg-green-500/10 text-green-600 border-green-500/20'
    }
  }

  const getSkillName = (skillId: number) => {
    return publicSkills.find(s => s.id === skillId)?.nombre || 'Habilidad'
  }

  // Obtener categorías únicas de las habilidades
  const categories = Array.from(new Set(publicSkills.map(skill => skill.categoria).filter(Boolean))) as string[]

  // Filtrar habilidades públicas
  const filteredPublicSkills = publicSkills.filter(skill => {
    const matchesSearch = skill.nombre?.toLowerCase().includes(skillSearchTerm.toLowerCase()) ||
                          skill.descripcion?.toLowerCase().includes(skillSearchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || skill.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Filtrar habilidades seleccionadas temporalmente
  const filteredSelectedSkills = selectedSkills.filter(selected => {
    if (selectedSkillLevel === 'all') return true
    return selected.nivel === selectedSkillLevel
  })

  const completeness = calculateCompleteness()

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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <ProfilePhotoUpload
                    currentPhotoUrl={user.avatar}
                    userName={user.name}
                    onPhotoUpdate={handlePhotoUpdate}
                  />
                  <div>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <CardDescription className="mt-1">{user.email}</CardDescription>
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>Perfil completado</span>
                        <Badge variant={completeness === 100 ? "default" : "secondary"} className="text-xs">
                          {completeness}%
                        </Badge>
                      </div>
                      <Progress value={completeness} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
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
                  disabled={savingData}
                >
                  {isEditingBasic ? (
                    <>
                      <FloppyDisk size={16} />
                      {savingData ? 'Guardando...' : 'Guardar'}
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
              {loadingProfile ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Cargando experiencia...</p>
                </div>
              ) : experiences.length === 0 ? (
                <div className="py-12 text-center">
                  <Briefcase size={48} className="mx-auto mb-3 text-muted-foreground/50" weight="duotone" />
                  <p className="text-muted-foreground">No has agregado experiencia laboral</p>
                  <p className="text-sm text-muted-foreground mt-1">Haz clic en "Agregar" para comenzar</p>
                </div>
              ) : (
                experiences.map((exp, index) => {
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
                                    value={exp.puesto}
                                    onChange={(e) => handleUpdateExperience(exp.id, { puesto: e.target.value })}
                                  />
                                  <Input
                                    placeholder="Empresa"
                                    value={exp.empresa}
                                    onChange={(e) => handleUpdateExperience(exp.id, { empresa: e.target.value })}
                                  />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <Input
                                    type="date"
                                    placeholder="Fecha inicio"
                                    value={exp.fecha_inicio || ''}
                                    onChange={(e) => handleUpdateExperience(exp.id, { fecha_inicio: e.target.value || null })}
                                  />
                                  <Input
                                    type="date"
                                    placeholder="Fecha fin"
                                    value={exp.fecha_fin || ''}
                                    onChange={(e) => handleUpdateExperience(exp.id, { fecha_fin: e.target.value || null })}
                                    disabled={exp.es_actual}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`actual-${exp.id}`}
                                    checked={exp.es_actual}
                                    onChange={(e) => handleUpdateExperience(exp.id, { 
                                      es_actual: e.target.checked,
                                      fecha_fin: e.target.checked ? null : exp.fecha_fin
                                    })}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                  />
                                  <label htmlFor={`actual-${exp.id}`} className="text-sm text-muted-foreground cursor-pointer">
                                    Trabajo actual
                                  </label>
                                </div>
                                <Textarea
                                  placeholder="Describe tus responsabilidades y logros..."
                                  value={exp.descripcion || ''}
                                  onChange={(e) => handleUpdateExperience(exp.id, { descripcion: e.target.value })}
                                  rows={3}
                                />
                              </>
                            ) : (
                              <>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="text-lg font-semibold text-foreground">{exp.puesto || 'Cargo sin título'}</h4>
                                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                      <Buildings size={16} weight="duotone" />
                                      <span>{exp.empresa || 'Empresa'}</span>
                                    </div>
                                  </div>
                                  {exp.es_actual && (
                                    <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                                      Actual
                                    </Badge>
                                  )}
                                </div>
                                {(exp.fecha_inicio || exp.fecha_fin) && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CalendarBlank size={16} weight="duotone" />
                                    <span>
                                      {formatDate(exp.fecha_inicio) || 'Fecha no especificada'} - {exp.es_actual ? 'Presente' : (formatDate(exp.fecha_fin) || 'Fecha no especificada')}
                                    </span>
                                  </div>
                                )}
                                {exp.descripcion && (
                                  <p className="text-muted-foreground text-sm leading-relaxed">
                                    {exp.descripcion}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleSaveExperience(exp.id)}
                                  disabled={savingData}
                                >
                                  {savingData ? 'Guardando...' : <><FloppyDisk size={18} /> Guardar</>}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (exp.id > 1000000000000) {
                                      // Es temporal, eliminar sin guardar
                                      setExperiences(experiences.filter(e => e.id !== exp.id))
                                    }
                                    setEditingExp(null)
                                  }}
                                >
                                  <X size={18} />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingExp(exp.id)}
                                >
                                  <PencilSimple size={18} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveExperience(exp.id)}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash size={18} />
                                </Button>
                              </>
                            )}
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
              {loadingProfile ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Cargando educación...</p>
                </div>
              ) : educations.length === 0 ? (
                <div className="py-12 text-center">
                  <GraduationCap size={48} className="mx-auto mb-3 text-muted-foreground/50" weight="duotone" />
                  <p className="text-muted-foreground">No has agregado información educativa</p>
                  <p className="text-sm text-muted-foreground mt-1">Haz clic en "Agregar" para comenzar</p>
                </div>
              ) : (
                educations.map((edu, index) => {
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
                                  value={edu.institucion}
                                  onChange={(e) => handleUpdateEducation(edu.id, { institucion: e.target.value })}
                                />
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <Input
                                    placeholder="Título/Grado"
                                    value={edu.titulo}
                                    onChange={(e) => handleUpdateEducation(edu.id, { titulo: e.target.value })}
                                  />
                                  <Input
                                    placeholder="Campo de estudio (opcional)"
                                    value={edu.descripcion || ''}
                                    onChange={(e) => handleUpdateEducation(edu.id, { descripcion: e.target.value })}
                                  />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <Input
                                    type="date"
                                    placeholder="Fecha inicio"
                                    value={edu.fecha_inicio || ''}
                                    onChange={(e) => handleUpdateEducation(edu.id, { fecha_inicio: e.target.value || null })}
                                  />
                                  <Input
                                    type="date"
                                    placeholder="Fecha fin"
                                    value={edu.fecha_fin || ''}
                                    onChange={(e) => handleUpdateEducation(edu.id, { fecha_fin: e.target.value || null })}
                                    disabled={edu.es_actual}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`actual-edu-${edu.id}`}
                                    checked={edu.es_actual}
                                    onChange={(e) => handleUpdateEducation(edu.id, { 
                                      es_actual: e.target.checked,
                                      fecha_fin: e.target.checked ? null : edu.fecha_fin
                                    })}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                  />
                                  <label htmlFor={`actual-edu-${edu.id}`} className="text-sm text-muted-foreground cursor-pointer">
                                    Estudiando actualmente
                                  </label>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="text-lg font-semibold text-foreground">{edu.titulo || 'Título'}</h4>
                                    <p className="text-muted-foreground">{edu.institucion || 'Institución'}</p>
                                    {edu.descripcion && (
                                      <p className="text-sm text-muted-foreground mt-1">{edu.descripcion}</p>
                                    )}
                                  </div>
                                  {edu.es_actual && (
                                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                                      En curso
                                    </Badge>
                                  )}
                                </div>
                                {(edu.fecha_inicio || edu.fecha_fin) && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CalendarBlank size={16} weight="duotone" />
                                    <span>
                                      {formatDate(edu.fecha_inicio) || 'Fecha no especificada'} - {edu.es_actual ? 'Presente' : (formatDate(edu.fecha_fin) || 'Fecha no especificada')}
                                    </span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleSaveEducation(edu.id)}
                                  disabled={savingData}
                                >
                                  {savingData ? 'Guardando...' : <><FloppyDisk size={18} /> Guardar</>}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (edu.id > 1000000000000) {
                                      // Es temporal, eliminar sin guardar
                                      setEducations(educations.filter(e => e.id !== edu.id))
                                    }
                                    setEditingEdu(null)
                                  }}
                                >
                                  <X size={18} />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingEdu(edu.id)}
                                >
                                  <PencilSimple size={18} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveEducation(edu.id)}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash size={18} />
                                </Button>
                              </>
                            )}
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
              {/* Habilidades guardadas */}
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {skills && skills.length > 0 ? (
                  skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${getSkillLevelColor(skill.nivel)}`}
                    >
                      <div className="flex items-center gap-2">
                        {skill.certificada && (
                          <button
                            onClick={() => handleToggleExistingCertified(skill.id)}
                            className="hover:scale-110 transition-transform"
                            disabled={savingData}
                            title="Certificada (click para remover)"
                          >
                            <Certificate size={16} weight="fill" className="text-primary" />
                          </button>
                        )}
                        {!skill.certificada && (
                          <button
                            onClick={() => handleToggleExistingCertified(skill.id)}
                            className="opacity-30 hover:opacity-100 transition-opacity"
                            disabled={savingData}
                            title="Marcar como certificada"
                          >
                            <Certificate size={16} weight="regular" />
                          </button>
                        )}
                        <span className="font-medium text-sm">{skill.nombre}</span>
                      </div>
                      <div className="flex items-center gap-1.5 ml-2">
                        <select
                          value={skill.nivel || 'Intermedio'}
                          onChange={(e) => handleUpdateExistingSkillLevel(skill.id, e.target.value)}
                          className="text-xs border rounded px-2 py-0.5 bg-background/50 font-medium cursor-pointer hover:bg-background transition-colors"
                          disabled={savingData}
                        >
                          <option value="Básico">Básico</option>
                          <option value="Intermedio">Intermedio</option>
                          <option value="Avanzado">Avanzado</option>

                        </select>
                        <button
                          onClick={() => handleRemoveExistingSkill(skill.id)}
                          className="hover:bg-destructive/20 rounded-full p-1 transition-colors"
                          disabled={savingData}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm py-2">No has agregado habilidades</p>
                )}
              </div>
              
              {showSkillSelector ? (
                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Lightbulb size={18} weight="duotone" />
                      Agregar Habilidades
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setShowSkillSelector(false)
                        setSkillSearchTerm('')
                        setSelectedSkillLevel('all')
                        setSelectedCategory('all')
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>

                  {/* Barra de búsqueda */}
                  <div className="relative">
                    <MagnifyingGlass 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                    />
                    <Input
                      type="text"
                      placeholder="Buscar habilidades..."
                      value={skillSearchTerm}
                      onChange={(e) => setSkillSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Filtro por categoría */}
                  {categories.length > 0 && (
                    <div className="flex items-center gap-2">
                      <FunnelSimple size={16} className="text-muted-foreground" />
                      <Label className="text-sm font-medium">Categoría:</Label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="flex-1 text-sm border rounded px-3 py-1.5 bg-background"
                      >
                        <option value="all">Todas las categorías</option>
                        {categories.sort().map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Habilidades seleccionadas temporalmente */}
                  {selectedSkills.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Habilidades Seleccionadas ({selectedSkills.length})</Label>
                        <div className="flex items-center gap-2">
                          <FunnelSimple size={14} className="text-muted-foreground" />
                          <select
                            value={selectedSkillLevel}
                            onChange={(e) => setSelectedSkillLevel(e.target.value)}
                            className="text-xs border rounded px-2 py-1 bg-background"
                          >
                            <option value="all">Todos los niveles</option>
                            <option value="Básico">Básico</option>
                            <option value="Intermedio">Intermedio</option>
                            <option value="Avanzado">Avanzado</option>

                          </select>
                        </div>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-background/50 rounded-lg border">
                        {filteredSelectedSkills.map((selected) => {
                          const skillName = getSkillName(selected.habilidad_id)
                          return (
                            <div 
                              key={selected.habilidad_id} 
                              className="flex items-center justify-between gap-3 p-2 bg-background rounded border hover:border-primary/50 transition-colors"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <CheckCircle size={16} weight="fill" className="text-primary" />
                                <span className="text-sm font-medium">{skillName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <select
                                  value={selected.nivel}
                                  onChange={(e) => handleUpdateSkillLevel(selected.habilidad_id, e.target.value)}
                                  className="text-xs border rounded px-2 py-1 bg-background"
                                >
                                  <option value="Básico">Básico</option>
                                  <option value="Intermedio">Intermedio</option>
                                  <option value="Avanzado">Avanzado</option>

                                </select>
                                <button
                                  onClick={() => handleToggleCertified(selected.habilidad_id)}
                                  className={`p-1 rounded transition-colors ${
                                    selected.certificada 
                                      ? 'bg-primary/20 text-primary' 
                                      : 'bg-muted hover:bg-muted/80'
                                  }`}
                                  title={selected.certificada ? 'Certificada' : 'Marcar como certificada'}
                                >
                                  <Certificate size={16} weight={selected.certificada ? 'fill' : 'regular'} />
                                </button>
                                <button
                                  onClick={() => handleRemoveSkill(selected.habilidad_id)}
                                  className="p-1 hover:bg-destructive/20 rounded transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Lista de habilidades públicas disponibles */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Habilidades Disponibles ({filteredPublicSkills.length})
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 bg-background/50 rounded-lg border">
                      {filteredPublicSkills.length > 0 ? (
                        filteredPublicSkills.map((skill) => {
                          const isSelected = selectedSkills.some(s => s.habilidad_id === skill.id)
                          const isAlreadySaved = skills.some(s => s.id === skill.id)
                          
                          return (
                            <Button
                              key={skill.id}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              onClick={() => isSelected ? handleRemoveSkill(skill.id) : handleAddSkill(skill.id)}
                              className="justify-start gap-2 h-auto py-2 px-3"
                              disabled={isAlreadySaved}
                            >
                              <span className="text-xs flex-1 text-left truncate">{skill.nombre}</span>
                              {isAlreadySaved && (
                                <CheckCircle size={14} weight="fill" className="text-primary flex-shrink-0" />
                              )}
                              {isSelected && !isAlreadySaved && (
                                <CheckCircle size={14} weight="fill" className="flex-shrink-0" />
                              )}
                            </Button>
                          )
                        })
                      ) : (
                        <div className="col-span-full py-8 text-center text-muted-foreground text-sm">
                          <MagnifyingGlass size={32} className="mx-auto mb-2 opacity-50" />
                          <p>No se encontraron habilidades</p>
                          <p className="text-xs mt-1">Intenta con otro término de búsqueda</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveSkills} 
                      className="flex-1" 
                      disabled={savingData || selectedSkills.length === 0}
                    >
                      {savingData ? (
                        <>Guardando...</>
                      ) : (
                        <>
                          <FloppyDisk size={16} className="mr-2" />
                          Guardar {selectedSkills.length > 0 && `(${selectedSkills.length})`}
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowSkillSelector(false)
                        setSelectedSkills([])
                        setSkillSearchTerm('')
                        setSelectedSkillLevel('all')
                        setSelectedCategory('all')
                      }}
                      disabled={savingData}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={() => {
                    setShowSkillSelector(true)
                    // Inicializar selectedSkills con las habilidades actuales
                    setSelectedSkills(skills.map(s => ({
                      habilidad_id: s.id,
                      nivel: s.nivel || 'Intermedio',
                      certificada: s.certificada || false
                    })))
                  }} 
                  className="gap-2" 
                  variant="outline"
                >
                  <Plus size={16} />
                  {skills.length > 0 ? 'Editar Habilidades' : 'Agregar Habilidades'}
                </Button>
              )}
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
