import { useState, useEffect } from 'react'
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
  EnvelopeSimple,
  LinkedinLogo,
  Briefcase as BriefcaseIcon
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { 
  applicationService, 
  type CandidateProfile,
  type ReferenciaLaboral,
  type ReferenciaPersonal,
  type Educacion,
  type Titulo
} from '@/lib/applicationService'
import type { User } from '@/lib/types'

// Función para formatear fechas de input (YYYY-MM-DD) a formato de visualización
// Agrega T00:00:00 para forzar zona horaria local y evitar el problema de UTC
const formatInputDate = (dateString: string | undefined | null): string => {
  if (!dateString || dateString.trim() === '') return 'No especificada'
  
  try {
    // Agregar T00:00:00 para que la fecha se interprete en zona horaria local
    const date = new Date(dateString + 'T00:00:00')
    
    if (isNaN(date.getTime())) return 'Fecha inválida'
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Error al formatear fecha:', error)
    return 'Fecha inválida'
  }
}

type ProfilePersonalDataProps = {
  user: User
  onUpdateUser: (user: User) => void
}

export default function ProfilePersonalData({ user, onUpdateUser }: ProfilePersonalDataProps) {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingProfessional, setIsEditingProfessional] = useState(false)
  const [editingWorkRef, setEditingWorkRef] = useState<number | null>(null)
  const [editingPersonalRef, setEditingPersonalRef] = useState<number | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [backendProfile, setBackendProfile] = useState<CandidateProfile | null>(null)

  const [personalData, setPersonalData] = useState({
    fullName: user.profile?.fullName || '',
    dateOfBirth: user.profile?.dateOfBirth || '',
    phone: user.profile?.phone || '',
    address: user.profile?.address || '',
    dpi: user.profile?.dpi || '',
    profession: user.profile?.profession || '',
    linkedin_url: user.profile?.linkedin || '',
    portfolio_url: user.profile?.portfolio || ''
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

  const [editWorkRef, setEditWorkRef] = useState({
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

  const [editPersonalRef, setEditPersonalRef] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  })

  // Backend state for referencias
  const [refLaborales, setRefLaborales] = useState<ReferenciaLaboral[]>([])
  const [refPersonales, setRefPersonales] = useState<ReferenciaPersonal[]>([])
  const [loadingRefs, setLoadingRefs] = useState(false)

  // Backend state for educación y títulos
  const [educaciones, setEducaciones] = useState<Educacion[]>([])
  const [titulos, setTitulos] = useState<Titulo[]>([])
  const [loadingEducacion, setLoadingEducacion] = useState(false)
  const [editingEducacion, setEditingEducacion] = useState<number | null>(null)
  const [editingTitulo, setEditingTitulo] = useState<number | null>(null)

  const [newEducacion, setNewEducacion] = useState({
    institucion: '',
    titulo_obtenido: '',
    nivel: 'Universitario' as 'Medio' | 'Técnico' | 'Universitario' | 'Maestría' | 'Doctorado',
    fecha_inicio: '',
    fecha_fin: '',
    descripcion: ''
  })

  const [editEducacion, setEditEducacion] = useState({
    institucion: '',
    titulo_obtenido: '',
    nivel: 'Universitario' as 'Medio' | 'Técnico' | 'Universitario' | 'Maestría' | 'Doctorado',
    fecha_inicio: '',
    fecha_fin: '',
    descripcion: ''
  })

  const [newTitulo, setNewTitulo] = useState({
    nombre_titulo: '',
    tipo: 'Licenciatura' as 'Licenciatura' | 'Maestría' | 'Técnico' | 'Certificación' | 'Diplomado' | 'Otro',
    institucion: '',
    fecha_obtencion: ''
  })

  const [editTitulo, setEditTitulo] = useState({
    nombre_titulo: '',
    tipo: 'Licenciatura' as 'Licenciatura' | 'Maestría' | 'Técnico' | 'Certificación' | 'Diplomado' | 'Otro',
    institucion: '',
    fecha_obtencion: ''
  })

  // Cargar perfil desde backend al montar el componente
  useEffect(() => {
    loadBackendProfile()
    loadReferencias()
    loadEducacionYTitulos()
  }, [])

  const loadBackendProfile = async () => {
    setLoadingProfile(true)
    try {
      // Cargar perfil completo
      const completeProfile = await applicationService.getCompleteProfile()
      console.log('✅ Perfil completo recibido:', completeProfile)
      
      if (completeProfile.postulante) {
        const profile = completeProfile.postulante
        setBackendProfile(profile)
        
        // Actualizar estado local con datos del backend
        setPersonalData({
          fullName: profile.nombre_completo || completeProfile.user.name,
          dateOfBirth: profile.fecha_nacimiento || '',
          phone: profile.telefono || '',
          address: profile.direccion || '',
          dpi: profile.dpi || '',
          profession: profile.profesion || '',
          linkedin_url: profile.linkedin_url || '',
          portfolio_url: profile.portfolio_url || ''
        })
        
        toast.success('Datos personales cargados')
      } else {
        // Si no tiene perfil de postulante, inicializar con datos del usuario
        setPersonalData({
          fullName: completeProfile.user.name,
          dateOfBirth: '',
          phone: '',
          address: '',
          dpi: '',
          profession: '',
          linkedin_url: '',
          portfolio_url: ''
        })
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error)
      toast.error('Error al cargar datos personales')
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleSavePersonal = async () => {
    setSavingProfile(true)
    try {
      const dataToSave = {
        nombre_completo: personalData.fullName,
        fecha_nacimiento: personalData.dateOfBirth,
        telefono: personalData.phone,
        direccion: personalData.address,
        dpi: personalData.dpi,
        profesion: personalData.profession,
        linkedin_url: personalData.linkedin_url,
        portfolio_url: personalData.portfolio_url
      }

      const updated = await applicationService.updateProfile(dataToSave)
      setBackendProfile(updated)
      
      // También actualizar el usuario local si es necesario
      const updatedUser: User = {
        ...user,
        profile: {
          ...user.profile!,
          fullName: personalData.fullName,
          dateOfBirth: personalData.dateOfBirth,
          phone: personalData.phone,
          address: personalData.address,
          dpi: personalData.dpi,
          profession: personalData.profession,
          linkedin: personalData.linkedin_url,
          portfolio: personalData.portfolio_url
        }
      }
      onUpdateUser(updatedUser)
      
      setIsEditingPersonal(false)
      toast.success('Datos personales guardados exitosamente')
    } catch (error: any) {
      console.error('Error al guardar perfil:', error)
      toast.error(error.message || 'Error al guardar datos personales')
    } finally {
      setSavingProfile(false)
    }
  }

  // Cargar referencias desde el backend
  const loadReferencias = async () => {
    setLoadingRefs(true)
    try {
      const [laborales, personales] = await Promise.all([
        applicationService.getReferenciasLaborales(),
        applicationService.getReferenciasPersonales()
      ])
      setRefLaborales(laborales)
      setRefPersonales(personales)
      console.log('✅ Referencias cargadas:', { laborales: laborales.length, personales: personales.length })
    } catch (error) {
      console.error('Error al cargar referencias:', error)
      toast.error('Error al cargar referencias')
    } finally {
      setLoadingRefs(false)
    }
  }

  // Cargar educación y títulos desde el backend
  const loadEducacionYTitulos = async () => {
    setLoadingEducacion(true)
    try {
      const [educacionData, titulosData] = await Promise.all([
        applicationService.getEducaciones(),
        applicationService.getTitulos()
      ])
      setEducaciones(educacionData)
      setTitulos(titulosData)
      console.log('✅ Educación y títulos cargados:', { educacion: educacionData.length, titulos: titulosData.length })
    } catch (error) {
      console.error('Error al cargar educación y títulos:', error)
      toast.error('Error al cargar datos académicos')
    } finally {
      setLoadingEducacion(false)
    }
  }

  // CRUD Educación
  const handleAddEducacion = async () => {
    if (!newEducacion.institucion || !newEducacion.titulo_obtenido || !newEducacion.fecha_inicio) {
      toast.error('Por favor completa los campos requeridos (institución, título, fecha inicio)')
      return
    }

    try {
      const created = await applicationService.createEducacion({
        institucion: newEducacion.institucion,
        titulo_obtenido: newEducacion.titulo_obtenido,
        nivel: newEducacion.nivel,
        fecha_inicio: newEducacion.fecha_inicio,
        fecha_fin: newEducacion.fecha_fin || null,
        descripcion: newEducacion.descripcion || null
      })
      
      setEducaciones(prev => [...prev, created])
      setNewEducacion({ institucion: '', titulo_obtenido: '', nivel: 'Universitario', fecha_inicio: '', fecha_fin: '', descripcion: '' })
      toast.success('Educación guardada en la base de datos')
    } catch (error: any) {
      console.error('Error al crear educación:', error)
      toast.error(error.message || 'Error al guardar educación')
    }
  }

  const handleEditEducacion = (edu: Educacion) => {
    setEditingEducacion(edu.id_educacion!)
    setEditEducacion({
      institucion: edu.institucion,
      titulo_obtenido: edu.titulo_obtenido,
      nivel: edu.nivel,
      fecha_inicio: edu.fecha_inicio,
      fecha_fin: edu.fecha_fin || '',
      descripcion: edu.descripcion || ''
    })
  }

  const handleUpdateEducacion = async () => {
    if (!editingEducacion) return

    try {
      const updated = await applicationService.updateEducacion(editingEducacion, {
        institucion: editEducacion.institucion,
        titulo_obtenido: editEducacion.titulo_obtenido,
        nivel: editEducacion.nivel,
        fecha_inicio: editEducacion.fecha_inicio,
        fecha_fin: editEducacion.fecha_fin || null,
        descripcion: editEducacion.descripcion || null
      })
      
      setEducaciones(prev => prev.map(edu => edu.id_educacion === editingEducacion ? updated : edu))
      setEditingEducacion(null)
      setEditEducacion({ institucion: '', titulo_obtenido: '', nivel: 'Universitario', fecha_inicio: '', fecha_fin: '', descripcion: '' })
      toast.success('Educación actualizada')
    } catch (error: any) {
      console.error('Error al actualizar educación:', error)
      toast.error(error.message || 'Error al actualizar educación')
    }
  }

  const handleDeleteEducacion = async (id: number) => {
    try {
      await applicationService.deleteEducacion(id)
      setEducaciones(prev => prev.filter(edu => edu.id_educacion !== id))
      toast.success('Educación eliminada')
    } catch (error: any) {
      console.error('Error al eliminar educación:', error)
      toast.error(error.message || 'Error al eliminar educación')
    }
  }

  const handleCancelEditEducacion = () => {
    setEditingEducacion(null)
    setEditEducacion({ institucion: '', titulo_obtenido: '', nivel: 'Universitario', fecha_inicio: '', fecha_fin: '', descripcion: '' })
  }

  // CRUD Títulos
  const handleAddTitulo = async () => {
    if (!newTitulo.nombre_titulo || !newTitulo.institucion || !newTitulo.fecha_obtencion) {
      toast.error('Por favor completa los campos requeridos')
      return
    }

    try {
      const created = await applicationService.createTitulo({
        nombre_titulo: newTitulo.nombre_titulo,
        tipo: newTitulo.tipo,
        institucion: newTitulo.institucion,
        fecha_obtencion: newTitulo.fecha_obtencion
      })
      
      setTitulos(prev => [...prev, created])
      setNewTitulo({ nombre_titulo: '', tipo: 'Licenciatura', institucion: '', fecha_obtencion: '' })
      toast.success('Título guardado en la base de datos')
    } catch (error: any) {
      console.error('Error al crear título:', error)
      toast.error(error.message || 'Error al guardar título')
    }
  }

  const handleEditTitulo = (titulo: Titulo) => {
    setEditingTitulo(titulo.id_titulo!)
    setEditTitulo({
      nombre_titulo: titulo.nombre_titulo,
      tipo: titulo.tipo,
      institucion: titulo.institucion,
      fecha_obtencion: titulo.fecha_obtencion
    })
  }

  const handleUpdateTitulo = async () => {
    if (!editingTitulo) return

    try {
      const updated = await applicationService.updateTitulo(editingTitulo, {
        nombre_titulo: editTitulo.nombre_titulo,
        tipo: editTitulo.tipo,
        institucion: editTitulo.institucion,
        fecha_obtencion: editTitulo.fecha_obtencion
      })
      
      setTitulos(prev => prev.map(t => t.id_titulo === editingTitulo ? updated : t))
      setEditingTitulo(null)
      setEditTitulo({ nombre_titulo: '', tipo: 'Licenciatura', institucion: '', fecha_obtencion: '' })
      toast.success('Título actualizado')
    } catch (error: any) {
      console.error('Error al actualizar título:', error)
      toast.error(error.message || 'Error al actualizar título')
    }
  }

  const handleDeleteTitulo = async (id: number) => {
    try {
      await applicationService.deleteTitulo(id)
      setTitulos(prev => prev.filter(t => t.id_titulo !== id))
      toast.success('Título eliminado')
    } catch (error: any) {
      console.error('Error al eliminar título:', error)
      toast.error(error.message || 'Error al eliminar título')
    }
  }

  const handleCancelEditTitulo = () => {
    setEditingTitulo(null)
    setEditTitulo({ nombre_titulo: '', tipo: 'Licenciatura', institucion: '', fecha_obtencion: '' })
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

  // Validaciones
  const validateEmail = (email: string): { valid: boolean; error?: string } => {
    if (!email || email.trim() === '') return { valid: true } // Email es opcional
    
    // Verificar caracteres no permitidos (emojis, caracteres especiales raros)
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u
    if (emojiRegex.test(email)) {
      return { valid: false, error: 'El email no puede contener emojis' }
    }
    
    // Formato de email válido
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'El formato del email no es válido' }
    }
    
    return { valid: true }
  }

  const validatePhone = (phone: string): { valid: boolean; error?: string } => {
    if (!phone || phone.trim() === '') {
      return { valid: false, error: 'El teléfono es requerido' }
    }
    
    // Verificar que no contenga emojis
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u
    if (emojiRegex.test(phone)) {
      return { valid: false, error: 'El teléfono no puede contener emojis' }
    }
    
    // Solo números, espacios, guiones, paréntesis y el símbolo +
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(phone)) {
      return { valid: false, error: 'El teléfono solo puede contener números, espacios, guiones, paréntesis y el símbolo +' }
    }
    
    // Verificar longitud mínima (al menos 8 dígitos)
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 8) {
      return { valid: false, error: 'El teléfono debe tener al menos 8 dígitos' }
    }
    
    return { valid: true }
  }

  const validateTextField = (text: string, fieldName: string): { valid: boolean; error?: string } => {
    if (!text || text.trim() === '') {
      return { valid: false, error: `${fieldName} es requerido` }
    }
    
    // Verificar que no contenga emojis
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u
    if (emojiRegex.test(text)) {
      return { valid: false, error: `${fieldName} no puede contener emojis` }
    }
    
    return { valid: true }
  }

  const handleAddWorkReference = async () => {
    // Validar nombre
    const nameValidation = validateTextField(newWorkRef.name, 'El nombre')
    if (!nameValidation.valid) {
      toast.error(nameValidation.error!)
      return
    }
    
    // Validar empresa
    const companyValidation = validateTextField(newWorkRef.company, 'La empresa')
    if (!companyValidation.valid) {
      toast.error(companyValidation.error!)
      return
    }
    
    // Validar cargo (opcional pero si está, validar)
    if (newWorkRef.position) {
      const positionValidation = validateTextField(newWorkRef.position, 'El cargo')
      if (!positionValidation.valid) {
        toast.error(positionValidation.error!)
        return
      }
    }
    
    // Validar teléfono
    const phoneValidation = validatePhone(newWorkRef.phone)
    if (!phoneValidation.valid) {
      toast.error(phoneValidation.error!)
      return
    }
    
    // Validar email
    const emailValidation = validateEmail(newWorkRef.email)
    if (!emailValidation.valid) {
      toast.error(emailValidation.error!)
      return
    }

    try {
      const created = await applicationService.createReferenciaLaboral({
        nombre: newWorkRef.name,
        empresa: newWorkRef.company,
        cargo: newWorkRef.position,
        telefono: newWorkRef.phone,
        email: newWorkRef.email || null,
        relacion: null
      })
      
      setRefLaborales(prev => [...prev, created])
      setNewWorkRef({ name: '', company: '', position: '', phone: '', email: '' })
      toast.success('Referencia laboral guardada')
    } catch (error: any) {
      console.error('Error al crear referencia:', error)
      toast.error(error.message || 'Error al guardar referencia laboral')
    }
  }

  const handleDeleteWorkReference = async (id: number) => {
    try {
      await applicationService.deleteReferenciaLaboral(id)
      setRefLaborales(prev => prev.filter(ref => ref.id_ref_lab !== id))
      toast.success('Referencia eliminada ')
    } catch (error: any) {
      console.error('Error al eliminar referencia:', error)
      toast.error(error.message || 'Error al eliminar referencia')
    }
  }

  const handleEditWorkReference = (ref: ReferenciaLaboral) => {
    setEditingWorkRef(ref.id_ref_lab!)
    setEditWorkRef({
      name: ref.nombre,
      company: ref.empresa,
      position: ref.cargo,
      phone: ref.telefono,
      email: ref.email || ''
    })
  }

  const handleUpdateWorkReference = async () => {
    if (!editingWorkRef) return

    // Validar nombre
    const nameValidation = validateTextField(editWorkRef.name, 'El nombre')
    if (!nameValidation.valid) {
      toast.error(nameValidation.error!)
      return
    }
    
    // Validar empresa
    const companyValidation = validateTextField(editWorkRef.company, 'La empresa')
    if (!companyValidation.valid) {
      toast.error(companyValidation.error!)
      return
    }
    
    // Validar cargo
    if (editWorkRef.position) {
      const positionValidation = validateTextField(editWorkRef.position, 'El cargo')
      if (!positionValidation.valid) {
        toast.error(positionValidation.error!)
        return
      }
    }
    
    // Validar teléfono
    const phoneValidation = validatePhone(editWorkRef.phone)
    if (!phoneValidation.valid) {
      toast.error(phoneValidation.error!)
      return
    }
    
    // Validar email
    const emailValidation = validateEmail(editWorkRef.email)
    if (!emailValidation.valid) {
      toast.error(emailValidation.error!)
      return
    }

    try {
      const updated = await applicationService.updateReferenciaLaboral(editingWorkRef, {
        nombre: editWorkRef.name,
        empresa: editWorkRef.company,
        cargo: editWorkRef.position,
        telefono: editWorkRef.phone,
        email: editWorkRef.email || null,
        relacion: null
      })
      
      setRefLaborales(prev => prev.map(ref => 
        ref.id_ref_lab === editingWorkRef ? updated : ref
      ))
      setEditingWorkRef(null)
      setEditWorkRef({ name: '', company: '', position: '', phone: '', email: '' })
      toast.success('Referencia laboral actualizada')
    } catch (error: any) {
      console.error('Error al actualizar referencia:', error)
      toast.error(error.message || 'Error al actualizar referencia laboral')
    }
  }

  const handleCancelEditWorkReference = () => {
    setEditingWorkRef(null)
    setEditWorkRef({ name: '', company: '', position: '', phone: '', email: '' })
  }

  const handleAddPersonalReference = async () => {
    // Validar nombre
    const nameValidation = validateTextField(newPersonalRef.name, 'El nombre')
    if (!nameValidation.valid) {
      toast.error(nameValidation.error!)
      return
    }
    
    // Validar relación
    const relationshipValidation = validateTextField(newPersonalRef.relationship, 'La relación')
    if (!relationshipValidation.valid) {
      toast.error(relationshipValidation.error!)
      return
    }
    
    // Validar teléfono
    const phoneValidation = validatePhone(newPersonalRef.phone)
    if (!phoneValidation.valid) {
      toast.error(phoneValidation.error!)
      return
    }
    
    // Validar email
    const emailValidation = validateEmail(newPersonalRef.email)
    if (!emailValidation.valid) {
      toast.error(emailValidation.error!)
      return
    }

    try {
      const created = await applicationService.createReferenciaPersonal({
        nombre: newPersonalRef.name,
        relacion: newPersonalRef.relationship,
        telefono: newPersonalRef.phone,
        email: newPersonalRef.email || null
      })
      
      setRefPersonales(prev => [...prev, created])
      setNewPersonalRef({ name: '', relationship: '', phone: '', email: '' })
      toast.success('Referencia personal guardada ')
    } catch (error: any) {
      console.error('Error al crear referencia:', error)
      toast.error(error.message || 'Error al guardar referencia personal')
    }
  }

  const handleDeletePersonalReference = async (id: number) => {
    try {
      await applicationService.deleteReferenciaPersonal(id)
      setRefPersonales(prev => prev.filter(ref => ref.id_ref_per !== id))
      toast.success('Referencia eliminada ')
    } catch (error: any) {
      console.error('Error al eliminar referencia:', error)
      toast.error(error.message || 'Error al eliminar referencia')
    }
  }

  const handleEditPersonalReference = (ref: ReferenciaPersonal) => {
    setEditingPersonalRef(ref.id_ref_per!)
    setEditPersonalRef({
      name: ref.nombre,
      relationship: ref.relacion,
      phone: ref.telefono,
      email: ref.email || ''
    })
  }

  const handleUpdatePersonalReference = async () => {
    if (!editingPersonalRef) return

    // Validar nombre
    const nameValidation = validateTextField(editPersonalRef.name, 'El nombre')
    if (!nameValidation.valid) {
      toast.error(nameValidation.error!)
      return
    }
    
    // Validar relación
    const relationshipValidation = validateTextField(editPersonalRef.relationship, 'La relación')
    if (!relationshipValidation.valid) {
      toast.error(relationshipValidation.error!)
      return
    }
    
    // Validar teléfono
    const phoneValidation = validatePhone(editPersonalRef.phone)
    if (!phoneValidation.valid) {
      toast.error(phoneValidation.error!)
      return
    }
    
    // Validar email
    const emailValidation = validateEmail(editPersonalRef.email)
    if (!emailValidation.valid) {
      toast.error(emailValidation.error!)
      return
    }

    try {
      const updated = await applicationService.updateReferenciaPersonal(editingPersonalRef, {
        nombre: editPersonalRef.name,
        relacion: editPersonalRef.relationship,
        telefono: editPersonalRef.phone,
        email: editPersonalRef.email || null
      })
      
      setRefPersonales(prev => prev.map(ref => 
        ref.id_ref_per === editingPersonalRef ? updated : ref
      ))
      setEditingPersonalRef(null)
      setEditPersonalRef({ name: '', relationship: '', phone: '', email: '' })
      toast.success('Referencia personal actualizada')
    } catch (error: any) {
      console.error('Error al actualizar referencia:', error)
      toast.error(error.message || 'Error al actualizar referencia personal')
    }
  }

  const handleCancelEditPersonalReference = () => {
    setEditingPersonalRef(null)
    setEditPersonalRef({ name: '', relationship: '', phone: '', email: '' })
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
              {loadingProfile && <span className="ml-2 text-xs">(Cargando...)</span>}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditingPersonal(!isEditingPersonal)}
            className="text-primary hover:text-primary hover:bg-primary/10"
            disabled={loadingProfile}
          >
            <PencilSimple size={20} weight="duotone" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {loadingProfile ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Cargando datos personales...</p>
            </div>
          ) : isEditingPersonal ? (
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

              <div className="space-y-2">
                <Label htmlFor="profession">Profesión</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Briefcase size={18} weight="duotone" />
                  </div>
                  <Input
                    id="profession"
                    value={personalData.profession}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, profession: e.target.value }))}
                    placeholder="Ej: Ingeniero en Sistemas"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn (Opcional)</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <LinkedinLogo size={18} weight="duotone" />
                  </div>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={personalData.linkedin_url}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    placeholder="https://linkedin.com/in/tu-perfil"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio_url">Portafolio/Sitio Web (Opcional)</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <BriefcaseIcon size={18} weight="duotone" />
                  </div>
                  <Input
                    id="portfolio_url"
                    type="url"
                    value={personalData.portfolio_url}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                    placeholder="https://tu-sitio-web.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSavePersonal} className="gap-2" disabled={savingProfile || loadingProfile}>
                  <FloppyDisk size={18} weight="duotone" />
                  {savingProfile ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditingPersonal(false)} disabled={savingProfile}>
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
                    {formatInputDate(personalData.dateOfBirth)}
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

              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Profesión</p>
                  <p className="font-medium">{personalData.profession || 'No especificada'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">LinkedIn</p>
                  {personalData.linkedin_url ? (
                    <a 
                      href={personalData.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      <LinkedinLogo size={16} weight="duotone" />
                      Ver perfil
                    </a>
                  ) : (
                    <p className="font-medium">No especificado</p>
                  )}
                </div>
              </div>

              {personalData.portfolio_url && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Portafolio/Sitio Web</p>
                    <a 
                      href={personalData.portfolio_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      <BriefcaseIcon size={16} weight="duotone" />
                      Visitar sitio
                    </a>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* <Card>
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
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Briefcase size={24} weight="duotone" className="text-primary" />
            Referencias Laborales
          </CardTitle>
          <CardDescription className="mt-1.5">
            Personas que pueden confirmar tu Experiencia Laboral
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {loadingRefs ? (
            <p className="text-sm text-muted-foreground">Cargando referencias...</p>
          ) : refLaborales.length > 0 ? (
            <div className="space-y-3">
              {refLaborales.map((ref) => (
                <motion.div
                  key={ref.id_ref_lab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-border rounded-lg bg-muted/30 space-y-2"
                >
                  {editingWorkRef === ref.id_ref_lab ? (
                    // Modo edición
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Nombre</Label>
                          <Input
                            value={editWorkRef.name}
                            onChange={(e) => setEditWorkRef(prev => ({ ...prev, name: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Empresa</Label>
                          <Input
                            value={editWorkRef.company}
                            onChange={(e) => setEditWorkRef(prev => ({ ...prev, company: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Cargo</Label>
                          <Input
                            value={editWorkRef.position}
                            onChange={(e) => setEditWorkRef(prev => ({ ...prev, position: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Teléfono</Label>
                          <Input
                            value={editWorkRef.phone}
                            onChange={(e) => setEditWorkRef(prev => ({ ...prev, phone: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs">Email (opcional)</Label>
                        <Input
                          type="email"
                          value={editWorkRef.email}
                          onChange={(e) => setEditWorkRef(prev => ({ ...prev, email: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateWorkReference} size="sm" className="gap-1">
                          <FloppyDisk size={16} weight="duotone" />
                          Guardar
                        </Button>
                        <Button onClick={handleCancelEditWorkReference} size="sm" variant="outline">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Modo visualización
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{ref.nombre}</p>
                          <p className="text-sm text-muted-foreground">{ref.cargo} en {ref.empresa}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditWorkReference(ref)}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <PencilSimple size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteWorkReference(ref.id_ref_lab!)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash size={18} />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone size={16} weight="duotone" />
                          <span>{ref.telefono}</span>
                        </div>
                        {ref.email && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <EnvelopeSimple size={16} weight="duotone" />
                            <span>{ref.email}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay referencias laborales registradas</p>
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
          {loadingRefs ? (
            <p className="text-sm text-muted-foreground">Cargando referencias...</p>
          ) : refPersonales.length > 0 ? (
            <div className="space-y-3">
              {refPersonales.map((ref) => (
                <motion.div
                  key={ref.id_ref_per}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-border rounded-lg bg-muted/30 space-y-2"
                >
                  {editingPersonalRef === ref.id_ref_per ? (
                    // Modo edición
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Nombre</Label>
                          <Input
                            value={editPersonalRef.name}
                            onChange={(e) => setEditPersonalRef(prev => ({ ...prev, name: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Relación</Label>
                          <Input
                            value={editPersonalRef.relationship}
                            onChange={(e) => setEditPersonalRef(prev => ({ ...prev, relationship: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Teléfono</Label>
                          <Input
                            value={editPersonalRef.phone}
                            onChange={(e) => setEditPersonalRef(prev => ({ ...prev, phone: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Email (opcional)</Label>
                          <Input
                            type="email"
                            value={editPersonalRef.email}
                            onChange={(e) => setEditPersonalRef(prev => ({ ...prev, email: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleUpdatePersonalReference} size="sm" className="gap-1">
                          <FloppyDisk size={16} weight="duotone" />
                          Guardar
                        </Button>
                        <Button onClick={handleCancelEditPersonalReference} size="sm" variant="outline">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Modo visualización
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{ref.nombre}</p>
                          <p className="text-sm text-muted-foreground">{ref.relacion}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPersonalReference(ref)}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <PencilSimple size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePersonalReference(ref.id_ref_per!)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash size={18} />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone size={16} weight="duotone" />
                          <span>{ref.telefono}</span>
                        </div>
                        {ref.email && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <EnvelopeSimple size={16} weight="duotone" />
                            <span>{ref.email}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay referencias personales registradas</p>
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
