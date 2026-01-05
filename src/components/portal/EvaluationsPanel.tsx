import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CalendarBlank, 
  Clock, 
  VideoCamera, 
  Buildings, 
  User,
  CheckCircle,
  HourglassHigh,
  ChartBar
} from '@phosphor-icons/react'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'https://oportunidadescoosanjer.com.gt/api/v1'

interface Evaluation {
  id: number
  tipo_evaluacion: string
  modalidad: string
  fecha: string
  hora: string
  responsable: string | null
  observaciones: string | null
  resultado: string | null
  completada: boolean
  estado: string
  created_at: string
}

export default function EvaluationsPanel() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvaluations()
  }, [])

  const fetchEvaluations = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/evaluations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setEvaluations(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error al cargar evaluaciones:', error)
      toast.error('Error al cargar tus evaluaciones')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (timeStr: string) => {
    // Manejar formato HH:mm:ss o HH:mm
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const isUpcoming = (fecha: string) => {
    const evaluationDate = new Date(fecha)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return evaluationDate >= today
  }

  const pendingEvaluations = evaluations.filter(e => !e.completada && isUpcoming(e.fecha))
  const completedEvaluations = evaluations.filter(e => e.completada)
  const pastEvaluations = evaluations.filter(e => !e.completada && !isUpcoming(e.fecha))

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando evaluaciones...</p>
        </CardContent>
      </Card>
    )
  }

  if (evaluations.length === 0) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex h-20 w-20 rounded-full bg-accent/10 items-center justify-center mx-auto mb-4"
          >
            <ChartBar size={40} className="text-accent" weight="duotone" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">Sin Evaluaciones Programadas</h3>
          <p className="text-muted-foreground mb-6">
            Cuando te asignen una entrevista o prueba técnica, aparecerá aquí
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Evaluaciones Pendientes */}
      {pendingEvaluations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HourglassHigh className="text-amber-500" weight="duotone" />
            Próximas Evaluaciones ({pendingEvaluations.length})
          </h3>
          <div className="space-y-4">
            {pendingEvaluations.map((evaluation, index) => (
              <motion.div
                key={evaluation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="bg-primary">
                            {evaluation.tipo_evaluacion}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {evaluation.modalidad === 'Virtual' ? (
                              <>
                                <VideoCamera size={14} />
                                Virtual
                              </>
                            ) : (
                              <>
                                <Buildings size={14} />
                                Presencial
                              </>
                            )}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarBlank size={16} />
                            {formatDate(evaluation.fecha)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={16} />
                            {formatTime(evaluation.hora)}
                          </span>
                        </div>

                        {evaluation.responsable && (
                          <p className="text-sm flex items-center gap-1">
                            <User size={16} className="text-muted-foreground" />
                            <span className="text-muted-foreground">Responsable:</span> {evaluation.responsable}
                          </p>
                        )}

                        {evaluation.observaciones && (
                          <p className="text-sm text-muted-foreground italic">
                            "{evaluation.observaciones}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                          <HourglassHigh size={14} className="mr-1" />
                          Pendiente
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Evaluaciones Completadas */}
      {completedEvaluations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500" weight="duotone" />
            Evaluaciones Completadas ({completedEvaluations.length})
          </h3>
          <div className="space-y-4">
            {completedEvaluations.map((evaluation, index) => (
              <motion.div
                key={evaluation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {evaluation.tipo_evaluacion}
                          </Badge>
                          <Badge variant="outline">
                            {evaluation.modalidad}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarBlank size={16} />
                            {formatDate(evaluation.fecha)}
                          </span>
                        </div>

                        {evaluation.resultado && (
                          <div className="mt-2 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium">Resultado:</p>
                            <p className="text-sm">{evaluation.resultado}</p>
                          </div>
                        )}
                      </div>

                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        <CheckCircle size={14} className="mr-1" />
                        Completada
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Evaluaciones Pasadas sin completar */}
      {pastEvaluations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
            Evaluaciones Pasadas ({pastEvaluations.length})
          </h3>
          <div className="space-y-4 opacity-60">
            {pastEvaluations.map((evaluation) => (
              <Card key={evaluation.id} className="border-l-4 border-l-gray-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Badge variant="outline">{evaluation.tipo_evaluacion}</Badge>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(evaluation.fecha)} - {formatTime(evaluation.hora)}
                      </p>
                    </div>
                    <Badge variant="outline">Pasada</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
