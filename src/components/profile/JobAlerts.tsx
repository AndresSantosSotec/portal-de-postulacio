import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Briefcase, Lightning, Eye, X, CheckCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { notificationService, type SuggestedJob } from '@/lib/notificationService'
import { applicationService } from '@/lib/applicationService'

interface JobAlertsProps {
  categories?: Array<{ id: string; name: string }>
  onViewJob?: (jobId: string) => void
}

export function JobAlerts({ categories, onViewJob }: JobAlertsProps) {
  const [suggestedJobs, setSuggestedJobs] = useState<SuggestedJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSuggestedJobs()
  }, [])

  const loadSuggestedJobs = async () => {
    try {
      setLoading(true)
      const suggestedData = await notificationService.getSuggestedJobs()
      
      // Verificar para cada vacante sugerida si realmente hay una aplicación
      const jobsWithApplicationStatus = await Promise.all(
        suggestedData.map(async (suggestion) => {
          try {
            const checkResult = await applicationService.checkApplication(suggestion.job.id)
            return {
              ...suggestion,
              hasApplied: checkResult.has_applied
            }
          } catch (error) {
            console.error(`Error al verificar aplicación para job ${suggestion.job.id}:`, error)
            return {
              ...suggestion,
              hasApplied: false
            }
          }
        })
      )

      // Solo mostrar vacantes que NO han sido aplicadas realmente
      const filteredJobs = jobsWithApplicationStatus.filter(job => !job.hasApplied)
      
      setSuggestedJobs(filteredJobs)
    } catch (error) {
      console.error('Error al cargar vacantes sugeridas:', error)
      toast.error('Error al cargar vacantes sugeridas')
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestedJobAction = async (id: number, action: 'aplicado' | 'descartado') => {
    try {
      await notificationService.updateSuggestedJobStatus(id, action)
      
      if (action === 'descartado') {
        // Si descarta, quitar de la lista
        setSuggestedJobs(prev => prev.filter(s => s.id !== id))
        toast.success('Vacante descartada')
      } else {
        // Si marca como aplicado pero aún no hay aplicación real, mantener visible
        // Pero actualizar el estado visual
        setSuggestedJobs(prev => prev.map(s => s.id === id ? { ...s, estado: action } : s))
        toast.success('Marcado como aplicado')
      }
    } catch (error) {
      console.error('Error al actualizar:', error)
      toast.error('Error al actualizar')
    }
  }

  const handleViewAndApply = async (jobId: number, suggestionId?: number, currentEstado?: string) => {
    console.log('🔄 [JobAlerts] Ver y aplicar a vacante:', { jobId, suggestionId, currentEstado })
    
    // Si está pendiente, marcarla como vista primero (no bloquea la navegación)
    if (suggestionId && currentEstado === 'pendiente') {
      notificationService.updateSuggestedJobStatus(suggestionId, 'visto')
        .then(() => {
          setSuggestedJobs(prev => prev.map(s => 
            s.id === suggestionId ? { ...s, estado: 'visto' } : s
          ))
        })
        .catch(error => {
          console.error('Error al actualizar estado:', error)
        })
    }

    // Redirigir al JobDetail inmediatamente
    if (onViewJob) {
      console.log('✅ [JobAlerts] Redirigiendo a JobDetail con jobId:', jobId.toString())
      onViewJob(jobId.toString())
    } else {
      console.warn('⚠️ [JobAlerts] onViewJob no disponible, usando fallback')
      // Fallback: abrir en nueva pestaña
      window.open(`/jobs/${jobId}`, '_blank')
    }
  }

  const pendingSuggestions = suggestedJobs.filter(s => s.estado === 'pendiente' || s.estado === 'visto')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightning size={24} className="text-amber-500" />
            Vacantes Sugeridas
            {pendingSuggestions.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingSuggestions.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Vacantes que los reclutadores han sugerido especialmente para ti
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suggestedJobs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Lightning size={64} className="mx-auto mb-4 opacity-30" weight="duotone" />
              <h3 className="text-lg font-semibold mb-2">No tienes vacantes sugeridas</h3>
              <p className="text-sm">
                Los reclutadores te sugerirán vacantes que coincidan con tu perfil y habilidades
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {suggestedJobs.map(suggestion => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-5 rounded-lg border transition-all ${
                      suggestion.estado === 'pendiente' 
                        ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 shadow-sm' 
                        : suggestion.estado === 'aplicado' 
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' :
                        suggestion.estado === 'descartado' 
                        ? 'bg-muted/50 opacity-60' 
                        : 'bg-card'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-semibold text-lg">{suggestion.job.titulo}</h4>
                          {suggestion.estado === 'pendiente' && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                              Nueva
                            </Badge>
                          )}
                          {suggestion.estado === 'visto' && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              Vista
                            </Badge>
                          )}
                          {suggestion.estado === 'aplicado' && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle size={12} className="mr-1" />
                              Aplicaste
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1.5 mb-3">
                          <div className="flex items-center gap-2">
                            <Briefcase size={16} className="shrink-0" />
                            <span>{suggestion.job.empresa}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="shrink-0" />
                            <span>{suggestion.job.ubicacion}</span>
                          </div>
                          {suggestion.job.categoria && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                                {suggestion.job.categoria.nombre}
                              </span>
                            </div>
                          )}
                        </div>
                        {suggestion.notas && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                              💬 Mensaje del reclutador:
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                              "{suggestion.notas}"
                            </p>
                          </div>
                        )}
                        <div className="mt-3 text-xs text-muted-foreground">
                          Sugerido por: <span className="font-medium">{suggestion.sugerido_por}</span> • {new Date(suggestion.fecha).toLocaleDateString('es-GT', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      
                      {(suggestion.estado === 'pendiente' || suggestion.estado === 'visto' || suggestion.estado === 'aplicado') && (
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button 
                            size="sm" 
                            className="gap-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Redirigir al JobDetail - el estado se actualizará automáticamente
                              handleViewAndApply(suggestion.job.id, suggestion.id, suggestion.estado)
                            }}
                          >
                            <Eye size={16} />
                            Ver y Aplicar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSuggestedJobAction(suggestion.id, 'descartado')
                            }}
                          >
                            <X size={16} />
                            Descartar
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Export default para compatibilidad
export default JobAlerts