import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  GraduationCap, 
  Clock, 
  CheckCircle, 
  PlayCircle,
  CalendarBlank,
  User,
  BookOpen,
  Progress,
  Certificate,
  ArrowRight,
  HourglassHigh
} from '@phosphor-icons/react'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

interface Curso {
  id: number
  titulo: string
  descripcion: string
  progreso: number
  estado: 'inscrito' | 'en_progreso' | 'completado' | 'abandonado'
  fecha_inscripcion: string
  fecha_inicio?: string
  fecha_fin?: string
  instructor?: string
  categoria?: string
  nivel?: 'basico' | 'intermedio' | 'avanzado'
  certificado_disponible: boolean
  certificado_url?: string
  ultima_clase_vista?: string
  total_clases?: number
  clases_completadas?: number
  created_at: string
}

export default function MisCursosPanel() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'en_progreso' | 'completado' | 'inscrito'>('all')

  useEffect(() => {
    fetchCursos()
  }, [])

  const fetchCursos = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/mis-cursos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Cursos recibidos del backend:', data)
        if (data.success && data.data) {
          // Transformar los datos para que coincidan con la interfaz
          const cursosTransformados = data.data.map((curso: any) => ({
            id: curso.id,
            titulo: curso.titulo,
            descripcion: curso.descripcion,
            progreso: curso.progreso || 0,
            estado: curso.estado_inscripcion || 'inscrito',
            fecha_inscripcion: curso.fecha_inscripcion,
            fecha_inicio: curso.fecha_inicio,
            fecha_fin: curso.fecha_fin,
            instructor: curso.instructor,
            categoria: curso.categoria,
            nivel: curso.nivel,
            certificado_disponible: curso.certificado_disponible || false,
            certificado_url: curso.certificado_url,
            ultima_clase_vista: curso.ultima_clase_vista,
            total_clases: curso.total_clases || 0,
            clases_completadas: curso.clases_completadas || 0,
            created_at: curso.created_at,
            estado_avance: curso.estado_avance,
            calificacion_final: curso.calificacion_final
          }))
          console.log('Cursos transformados:', cursosTransformados)
          setCursos(cursosTransformados)
        } else {
          console.log('No hay cursos o formato incorrecto:', data)
          setCursos([])
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error al cargar cursos:', response.status, errorData)
        if (response.status !== 404) {
          toast.error('Error al cargar tus cursos')
        }
        setCursos([])
      }
    } catch (error) {
      console.error('Error al cargar cursos:', error)
      toast.error('Error de conexión al cargar cursos')
      setCursos([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case 'inscrito':
        return { 
          label: 'Inscrito', 
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgLight: 'bg-blue-50 dark:bg-blue-900/20',
          icon: <CalendarBlank size={16} weight="duotone" className="text-blue-600" />
        }
      case 'en_progreso':
        return { 
          label: 'En Progreso', 
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgLight: 'bg-yellow-50 dark:bg-yellow-900/20',
          icon: <Progress size={16} weight="duotone" className="text-yellow-600" />
        }
      case 'completado':
        return { 
          label: 'Completado', 
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgLight: 'bg-green-50 dark:bg-green-900/20',
          icon: <CheckCircle size={16} weight="duotone" className="text-green-600" />
        }
      case 'abandonado':
        return { 
          label: 'Abandonado', 
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgLight: 'bg-red-50 dark:bg-red-900/20',
          icon: <HourglassHigh size={16} weight="duotone" className="text-red-600" />
        }
      default:
        return { 
          label: estado, 
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgLight: 'bg-gray-50',
          icon: <Clock size={16} weight="duotone" />
        }
    }
  }

  const handleContinueCourse = async (curso: Curso) => {
    try {
      // Navegar a la vista del curso o abrir el curso
      // Por ahora, redirigir a una página de detalle del curso
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast.error('Debes iniciar sesión para acceder al curso')
        return
      }

      // Obtener el ID de inscripción si está disponible
      const inscripcionId = (curso as any).inscripcion_id
      
      // Por ahora, mostrar un mensaje y redirigir
      toast.info(`Abriendo curso: ${curso.titulo}`)
      
      // Aquí puedes implementar la navegación al curso
      // Por ejemplo: window.location.href = `/curso/${curso.id}` o usar un router
      console.log('Navegando al curso:', curso.id, 'Inscripción:', inscripcionId)
      
      // TODO: Implementar navegación real al curso
      // Por ahora, solo mostramos un mensaje
    } catch (error) {
      console.error('Error al abrir el curso:', error)
      toast.error('Error al abrir el curso')
    }
  }

  const handleDownloadCertificate = (curso: Curso) => {
    if (curso.certificado_url) {
      const url = curso.certificado_url.startsWith('http') 
        ? curso.certificado_url 
        : `${API_URL}/${curso.certificado_url}`
      window.open(url, '_blank')
      toast.success('Descargando certificado...')
    } else {
      toast.error('El certificado aún no está disponible')
    }
  }

  const filteredCursos = filter === 'all' 
    ? cursos 
    : cursos.filter(c => c.estado === filter)

  const enProgreso = filteredCursos.filter(c => c.estado === 'en_progreso')
  const completados = filteredCursos.filter(c => c.estado === 'completado')
  const inscritos = filteredCursos.filter(c => c.estado === 'inscrito')
  const abandonados = filteredCursos.filter(c => c.estado === 'abandonado')

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando mis cursos...</p>
        </CardContent>
      </Card>
    )
  }

  if (cursos.length === 0) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex h-20 w-20 rounded-full bg-primary/10 items-center justify-center mx-auto mb-4"
          >
            <GraduationCap size={40} className="text-primary" weight="duotone" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">No tienes cursos inscritos</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Cuando te inscribas en un curso, aparecerá aquí con tu progreso y estadísticas.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap size={24} weight="duotone" className="text-primary" />
            Mis Cursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Aquí puedes ver todos los cursos en los que estás inscrito, tu progreso y acceder a los certificados.
          </p>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todos
            </Button>
            <Button
              variant={filter === 'en_progreso' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('en_progreso')}
              className="gap-2"
            >
              <Progress size={16} />
              En Progreso
            </Button>
            <Button
              variant={filter === 'completado' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completado')}
              className="gap-2"
            >
              <CheckCircle size={16} />
              Completados
            </Button>
            <Button
              variant={filter === 'inscrito' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('inscrito')}
              className="gap-2"
            >
              <CalendarBlank size={16} />
              Inscritos
            </Button>
          </div>

          {/* Cursos en Progreso */}
          {enProgreso.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Progress size={20} weight="duotone" className="text-yellow-600" />
                En Progreso ({enProgreso.length})
              </h4>
              <div className="space-y-4">
                {enProgreso.map((curso, index) => {
                  const estadoConfig = getEstadoConfig(curso.estado)
                  return (
                    <motion.div
                      key={curso.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-all">
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <GraduationCap size={24} className="text-primary" weight="duotone" />
                                    <CardTitle className="text-lg">{curso.titulo}</CardTitle>
                                    <Badge className={estadoConfig.color + ' text-white'}>
                                      {estadoConfig.icon}
                                      <span className="ml-1">{estadoConfig.label}</span>
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {curso.descripcion}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Barra de Progreso */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Progreso</span>
                                  <span className="font-semibold">{curso.progreso}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2.5">
                                  <div 
                                    className="bg-primary h-2.5 rounded-full transition-all"
                                    style={{ width: `${curso.progreso}%` }}
                                  />
                                </div>
                                {curso.clases_completadas !== undefined && curso.total_clases !== undefined && (
                                  <p className="text-xs text-muted-foreground">
                                    {curso.clases_completadas} de {curso.total_clases} clases completadas
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                {curso.categoria && (
                                  <span className="flex items-center gap-1">
                                    <BookOpen size={14} />
                                    {curso.categoria}
                                  </span>
                                )}
                                {curso.instructor && (
                                  <span className="flex items-center gap-1">
                                    <User size={14} />
                                    {curso.instructor}
                                  </span>
                                )}
                                {curso.nivel && (
                                  <Badge variant="secondary" className="text-xs">
                                    {curso.nivel === 'basico' ? 'Básico' : 
                                     curso.nivel === 'intermedio' ? 'Intermedio' : 'Avanzado'}
                                  </Badge>
                                )}
                                {curso.ultima_clase_vista && (
                                  <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    Última clase: {formatDate(curso.ultima_clase_vista)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Button
                                onClick={() => handleContinueCourse(curso)}
                                variant="default"
                                className="gap-2"
                              >
                                <PlayCircle size={18} />
                                Continuar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Cursos Completados */}
          {completados.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle size={20} weight="duotone" className="text-green-600" />
                Completados ({completados.length})
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {completados.map((curso, index) => {
                  const estadoConfig = getEstadoConfig(curso.estado)
                  return (
                    <motion.div
                      key={curso.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <GraduationCap size={20} className="text-green-600" weight="duotone" />
                                <CardTitle className="text-base line-clamp-2">{curso.titulo}</CardTitle>
                              </div>
                              <Badge className="bg-green-500 text-white">
                                {estadoConfig.icon}
                                <span className="ml-1">Completado</span>
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle size={16} weight="duotone" className="text-green-600" />
                            <span>100% completado</span>
                          </div>
                          {curso.fecha_fin && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CalendarBlank size={16} />
                              <span>Finalizado: {formatDate(curso.fecha_fin)}</span>
                            </div>
                          )}
                          {curso.certificado_disponible && (
                            <Button
                              onClick={() => handleDownloadCertificate(curso)}
                              variant="default"
                              size="sm"
                              className="w-full gap-2"
                            >
                              <Certificate size={18} />
                              Descargar Certificado
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Cursos Inscritos (aún no iniciados) */}
          {inscritos.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CalendarBlank size={20} weight="duotone" className="text-blue-600" />
                Inscritos ({inscritos.length})
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {inscritos.map((curso, index) => (
                  <motion.div
                    key={curso.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <GraduationCap size={20} className="text-blue-600" weight="duotone" />
                              <CardTitle className="text-base line-clamp-2">{curso.titulo}</CardTitle>
                            </div>
                            <Badge variant="outline" className="text-blue-600">
                              Inscrito
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {curso.descripcion}
                        </p>
                        {curso.fecha_inicio && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarBlank size={16} />
                            <span>Inicia: {formatDate(curso.fecha_inicio)}</span>
                          </div>
                        )}
                        <Button
                          onClick={() => handleContinueCourse(curso)}
                          variant="default"
                          size="sm"
                          className="w-full gap-2"
                        >
                          <ArrowRight size={18} />
                          Comenzar Curso
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Cursos Abandonados */}
          {abandonados.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-muted-foreground">
                <HourglassHigh size={20} weight="duotone" className="text-red-600" />
                Abandonados ({abandonados.length})
              </h4>
              <div className="grid sm:grid-cols-2 gap-4 opacity-60">
                {abandonados.map((curso) => (
                  <Card key={curso.id} className="border-l-4 border-l-red-500">
                    <CardHeader>
                      <CardTitle className="text-base line-clamp-2">{curso.titulo}</CardTitle>
                      <Badge variant="destructive">Abandonado</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {curso.descripcion}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
