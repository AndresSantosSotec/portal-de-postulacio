import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  GraduationCap, 
  Clock, 
  FileText, 
  VideoCamera,
  Download,
  PlayCircle,
  CalendarBlank,
  User,
  BookOpen,
  CheckCircle,
  HourglassHigh
} from '@phosphor-icons/react'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

interface Capacitacion {
  id: number
  titulo: string
  descripcion: string
  tipo: 'material' | 'clase' | 'video'
  duracion?: string
  fecha_disponible?: string
  instructor?: string
  material_url?: string
  video_url?: string
  clase_url?: string
  estado: 'disponible' | 'proximamente' | 'finalizado'
  categoria?: string
  nivel?: 'basico' | 'intermedio' | 'avanzado'
  created_at: string
}

export default function CapacitacionesPanel() {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'material' | 'clase' | 'video'>('all')

  useEffect(() => {
    fetchCapacitaciones()
  }, [])

  const fetchCapacitaciones = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setLoading(false)
        return
      }

      // TODO: Reemplazar con la ruta real cuando esté disponible
      const response = await fetch(`${API_URL}/capacitaciones`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Asegurar que data.data sea un array
          const capacitacionesData = data.data?.data || data.data || []
          setCapacitaciones(Array.isArray(capacitacionesData) ? capacitacionesData : [])
        } else {
          setCapacitaciones([])
        }
      } else if (response.status === 404) {
        // Si no existe el endpoint aún, usar datos de ejemplo
        setCapacitaciones([])
      }
    } catch (error) {
      console.error('Error al cargar capacitaciones:', error)
      // No mostrar error si el endpoint no existe aún
      setCapacitaciones([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Disponible ahora'
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'material':
        return <FileText size={20} weight="duotone" className="text-blue-600" />
      case 'clase':
        return <VideoCamera size={20} weight="duotone" className="text-purple-600" />
      case 'video':
        return <PlayCircle size={20} weight="duotone" className="text-red-600" />
      default:
        return <BookOpen size={20} weight="duotone" />
    }
  }

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return { 
          label: 'Disponible', 
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgLight: 'bg-green-50 dark:bg-green-900/20',
          icon: <CheckCircle size={16} weight="duotone" className="text-green-600" />
        }
      case 'proximamente':
        return { 
          label: 'Próximamente', 
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgLight: 'bg-yellow-50 dark:bg-yellow-900/20',
          icon: <HourglassHigh size={16} weight="duotone" className="text-yellow-600" />
        }
      case 'finalizado':
        return { 
          label: 'Finalizado', 
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgLight: 'bg-gray-50 dark:bg-gray-900/20',
          icon: <CheckCircle size={16} weight="duotone" className="text-gray-600" />
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

  const handleAccess = (capacitacion: Capacitacion) => {
    let url = capacitacion.material_url || capacitacion.video_url || capacitacion.clase_url
    
    if (url) {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        window.open(url, '_blank')
      } else {
        // Si es una ruta relativa, construir la URL completa
        window.open(`${API_URL}/${url}`, '_blank')
      }
    } else {
      toast.info('El contenido estará disponible próximamente')
    }
  }

  const handleDownload = (capacitacion: Capacitacion) => {
    if (capacitacion.material_url) {
      const url = capacitacion.material_url.startsWith('http') 
        ? capacitacion.material_url 
        : `${API_URL}/${capacitacion.material_url}`
      window.open(url, '_blank')
      toast.success('Descargando material...')
    }
  }

  // Asegurar que capacitaciones sea siempre un array
  const capacitacionesArray = Array.isArray(capacitaciones) ? capacitaciones : []
  
  const filteredCapacitaciones = filter === 'all' 
    ? capacitacionesArray 
    : capacitacionesArray.filter(c => c.tipo === filter)

  const disponibles = Array.isArray(filteredCapacitaciones) 
    ? filteredCapacitaciones.filter(c => c.estado === 'disponible')
    : []
  const proximamente = Array.isArray(filteredCapacitaciones)
    ? filteredCapacitaciones.filter(c => c.estado === 'proximamente')
    : []
  const finalizados = Array.isArray(filteredCapacitaciones)
    ? filteredCapacitaciones.filter(c => c.estado === 'finalizado')
    : []

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando capacitaciones...</p>
        </CardContent>
      </Card>
    )
  }

  if (capacitaciones.length === 0) {
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
          <h3 className="text-xl font-semibold mb-2">No hay capacitaciones disponibles</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Los materiales y clases de capacitación para tu proceso de selección aparecerán aquí.
            Mantente atento a las actualizaciones.
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
            Capacitaciones Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Aquí encontrarás materiales, clases y videos de capacitación relacionados con las plazas a las que has postulado.
          </p>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={filter === 'material' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('material')}
              className="gap-2"
            >
              <FileText size={16} />
              Materiales
            </Button>
            <Button
              variant={filter === 'clase' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('clase')}
              className="gap-2"
            >
              <VideoCamera size={16} />
              Clases
            </Button>
            <Button
              variant={filter === 'video' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('video')}
              className="gap-2"
            >
              <PlayCircle size={16} />
              Videos
            </Button>
          </div>

          {/* Capacitaciones Disponibles */}
          {disponibles.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle size={20} weight="duotone" className="text-green-600" />
                Disponibles ({disponibles.length})
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {disponibles.map((capacitacion, index) => {
                  const estadoConfig = getEstadoConfig(capacitacion.estado)
                  return (
                    <motion.div
                      key={capacitacion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all h-full flex flex-col">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getTipoIcon(capacitacion.tipo)}
                                <Badge variant="outline" className="text-xs">
                                  {capacitacion.tipo === 'material' ? 'Material' : 
                                   capacitacion.tipo === 'clase' ? 'Clase' : 'Video'}
                                </Badge>
                              </div>
                              <CardTitle className="text-base line-clamp-2">
                                {capacitacion.titulo}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                            {capacitacion.descripcion}
                          </p>
                          
                          <div className="space-y-2 mb-4">
                            {capacitacion.categoria && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <BookOpen size={14} />
                                {capacitacion.categoria}
                              </div>
                            )}
                            {capacitacion.duracion && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock size={14} />
                                {capacitacion.duracion}
                              </div>
                            )}
                            {capacitacion.instructor && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <User size={14} />
                                {capacitacion.instructor}
                              </div>
                            )}
                            {capacitacion.nivel && (
                              <Badge variant="secondary" className="text-xs">
                                {capacitacion.nivel === 'basico' ? 'Básico' : 
                                 capacitacion.nivel === 'intermedio' ? 'Intermedio' : 'Avanzado'}
                              </Badge>
                            )}
                          </div>

                          <div className="flex gap-2 mt-auto">
                            {capacitacion.tipo === 'material' ? (
                              <Button
                                onClick={() => handleDownload(capacitacion)}
                                variant="default"
                                size="sm"
                                className="flex-1 gap-2"
                              >
                                <Download size={16} />
                                Descargar
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleAccess(capacitacion)}
                                variant="default"
                                size="sm"
                                className="flex-1 gap-2"
                              >
                                <PlayCircle size={16} />
                                Acceder
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Próximamente */}
          {proximamente.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <HourglassHigh size={20} weight="duotone" className="text-yellow-600" />
                Próximamente ({proximamente.length})
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {proximamente.map((capacitacion, index) => (
                  <motion.div
                    key={capacitacion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-l-4 border-l-yellow-500 opacity-75">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getTipoIcon(capacitacion.tipo)}
                              <Badge variant="outline" className="text-xs">
                                {capacitacion.tipo === 'material' ? 'Material' : 
                                 capacitacion.tipo === 'clase' ? 'Clase' : 'Video'}
                              </Badge>
                            </div>
                            <CardTitle className="text-base line-clamp-2">
                              {capacitacion.titulo}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {capacitacion.descripcion}
                        </p>
                        {capacitacion.fecha_disponible && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarBlank size={14} />
                            Disponible: {formatDate(capacitacion.fecha_disponible)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Finalizados */}
          {finalizados.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle size={20} weight="duotone" className="text-gray-600" />
                Finalizados ({finalizados.length})
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {finalizados.map((capacitacion, index) => (
                  <motion.div
                    key={capacitacion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-l-4 border-l-gray-500 opacity-60">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getTipoIcon(capacitacion.tipo)}
                              <Badge variant="outline" className="text-xs">
                                {capacitacion.tipo === 'material' ? 'Material' : 
                                 capacitacion.tipo === 'clase' ? 'Clase' : 'Video'}
                              </Badge>
                            </div>
                            <CardTitle className="text-base line-clamp-2">
                              {capacitacion.titulo}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {capacitacion.descripcion}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          Finalizado
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
