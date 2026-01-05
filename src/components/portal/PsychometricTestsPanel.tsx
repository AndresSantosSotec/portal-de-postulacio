import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  ArrowSquareOut,
  HourglassHigh,
  Briefcase,
  CalendarBlank,
  Warning,
  Check,
  SpinnerGap
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const API_URL = import.meta.env.VITE_API_URL || 'https://oportunidadescoosanjer.com.gt/api/v1'

interface PsychometricTest {
  id: number
  test_link: string
  sent_at: string | null
  completed_at: string | null
  status: 'pending' | 'sent' | 'completed' | 'expired'
  results_link: string | null
  job_offer: {
    id: number
    titulo: string
    empresa: string
  } | null
  created_at: string
}

export default function PsychometricTestsPanel() {
  const [tests, setTests] = useState<PsychometricTest[]>([])
  const [loading, setLoading] = useState(true)
  const [startedTests, setStartedTests] = useState<Set<number>>(new Set())
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; testId: number | null }>({ open: false, testId: null })
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    fetchTests()
    // Cargar tests iniciados desde localStorage
    const saved = localStorage.getItem('started_psychometric_tests')
    if (saved) {
      setStartedTests(new Set(JSON.parse(saved)))
    }
  }, [])

  const fetchTests = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/psychometric-tests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTests(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error al cargar pruebas psicométricas:', error)
      toast.error('Error al cargar tus pruebas psicométricas')
    } finally {
      setLoading(false)
    }
  }

  const handleStartTest = async (test: PsychometricTest) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      // Registrar en el backend que se inició
      await fetch(`${API_URL}/psychometric-tests/${test.id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      // Guardar en localStorage que ya inició esta prueba
      const newStarted = new Set(startedTests)
      newStarted.add(test.id)
      setStartedTests(newStarted)
      localStorage.setItem('started_psychometric_tests', JSON.stringify([...newStarted]))

      // Abrir el enlace
      window.open(test.test_link, '_blank')

      toast.success('¡Buena suerte con tu prueba!')
    } catch (error) {
      console.error('Error al iniciar prueba:', error)
      // Aún así abrir el enlace
      window.open(test.test_link, '_blank')
    }
  }

  const handleMarkAsCompleted = async () => {
    if (!confirmDialog.testId) return

    setCompleting(true)
    try {
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch(`${API_URL}/psychometric-tests/${confirmDialog.testId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('¡Prueba marcada como completada! Los reclutadores han sido notificados.')
        
        // Actualizar el estado local
        setTests(prev => prev.map(t => 
          t.id === confirmDialog.testId 
            ? { ...t, status: 'completed' as const, completed_at: data.data.completed_at }
            : t
        ))

        // Limpiar de startedTests
        const newStarted = new Set(startedTests)
        newStarted.delete(confirmDialog.testId)
        setStartedTests(newStarted)
        localStorage.setItem('started_psychometric_tests', JSON.stringify([...newStarted]))
      } else {
        toast.error(data.message || 'Error al marcar la prueba como completada')
      }
    } catch (error) {
      console.error('Error al completar prueba:', error)
      toast.error('Error al marcar la prueba como completada')
    } finally {
      setCompleting(false)
      setConfirmDialog({ open: false, testId: null })
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Pendiente'
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Pendiente', 
          color: 'bg-yellow-500', 
          textColor: 'text-yellow-700',
          bgLight: 'bg-yellow-50',
          icon: <HourglassHigh size={20} weight="duotone" className="text-yellow-600" /> 
        }
      case 'sent':
        return { 
          label: 'Enviada', 
          color: 'bg-blue-500', 
          textColor: 'text-blue-700',
          bgLight: 'bg-blue-50',
          icon: <Clock size={20} weight="duotone" className="text-blue-600" /> 
        }
      case 'completed':
        return { 
          label: 'Completada', 
          color: 'bg-green-500', 
          textColor: 'text-green-700',
          bgLight: 'bg-green-50',
          icon: <CheckCircle size={20} weight="duotone" className="text-green-600" /> 
        }
      case 'expired':
        return { 
          label: 'Expirada', 
          color: 'bg-red-500', 
          textColor: 'text-red-700',
          bgLight: 'bg-red-50',
          icon: <Warning size={20} weight="duotone" className="text-red-600" /> 
        }
      default:
        return { 
          label: status, 
          color: 'bg-gray-500', 
          textColor: 'text-gray-700',
          bgLight: 'bg-gray-50',
          icon: <Clock size={20} weight="duotone" className="text-gray-600" /> 
        }
    }
  }

  const pendingTests = tests.filter(t => t.status === 'pending' || t.status === 'sent')
  const completedTests = tests.filter(t => t.status === 'completed')
  const expiredTests = tests.filter(t => t.status === 'expired')

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Cargando pruebas psicométricas...</p>
        </CardContent>
      </Card>
    )
  }

  if (tests.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex h-20 w-20 rounded-full bg-primary/10 items-center justify-center mx-auto mb-4"
          >
            <Brain size={40} className="text-primary" weight="duotone" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">No tienes pruebas psicométricas</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Cuando avances en un proceso de selección, es posible que te envíen pruebas psicométricas. 
            Las encontrarás aquí junto con los enlaces para realizarlas.
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
            <Brain size={24} weight="duotone" className="text-primary" />
            Mis Pruebas Psicométricas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Aquí puedes ver las pruebas psicométricas que te han enviado como parte de los procesos de selección.
          </p>
          
          {/* Pruebas Pendientes */}
          {pendingTests.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <HourglassHigh size={20} weight="duotone" className="text-yellow-600" />
                Pendientes de realizar ({pendingTests.length})
              </h4>
              <div className="space-y-4">
                {pendingTests.map((test, index) => {
                  const statusConfig = getStatusConfig(test.status)
                  const hasStarted = startedTests.has(test.id) || test.status === 'sent'
                  
                  return (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`border-l-4 ${hasStarted ? 'border-l-blue-500' : 'border-l-yellow-500'}`}>
                        <CardContent className="pt-4">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Brain size={24} className="text-primary" weight="duotone" />
                                  <span className="font-semibold">Prueba Psicométrica</span>
                                  <Badge className={`${hasStarted ? 'bg-blue-500 hover:bg-blue-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}>
                                    {hasStarted ? 'En Progreso' : statusConfig.label}
                                  </Badge>
                                </div>
                                
                                {test.job_offer && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Briefcase size={16} weight="duotone" />
                                    <span>Para: <strong className="text-foreground">{test.job_offer.titulo}</strong> en {test.job_offer.empresa}</span>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CalendarBlank size={16} weight="duotone" />
                                  <span>Enviada: {formatDate(test.sent_at)}</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button 
                                  onClick={() => handleStartTest(test)}
                                  variant={hasStarted ? "outline" : "default"}
                                  className="gap-2"
                                >
                                  <ArrowSquareOut size={18} />
                                  {hasStarted ? 'Volver a la Prueba' : 'Iniciar Prueba'}
                                </Button>
                                
                                {hasStarted && (
                                  <Button 
                                    onClick={() => setConfirmDialog({ open: true, testId: test.id })}
                                    variant="default"
                                    className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Check size={18} weight="bold" />
                                    Ya la completé
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            {!hasStarted && (
                              <div className="p-3 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start gap-2">
                                  <Warning size={18} className="flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" weight="fill" />
                                  <span>
                                    <strong>Importante:</strong> Asegúrate de estar en un lugar tranquilo y sin distracciones 
                                    antes de comenzar. Una vez iniciada, complétala en una sola sesión.
                                  </span>
                                </p>
                              </div>
                            )}
                            
                            {hasStarted && (
                              <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg border border-blue-500/30">
                                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                                  <Clock size={18} className="flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" weight="fill" />
                                  <span>
                                    <strong>¿Ya terminaste?</strong> Una vez que hayas completado la prueba en el enlace externo, 
                                    haz clic en "Ya la completé" para notificar a los reclutadores.
                                  </span>
                                </p>
                              </div>
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

          {/* Pruebas Completadas */}
          {completedTests.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle size={20} weight="duotone" className="text-green-600" />
                Completadas ({completedTests.length})
              </h4>
              <div className="space-y-3">
                {completedTests.map((test, index) => {
                  const statusConfig = getStatusConfig(test.status)
                  return (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`border-l-4 border-l-green-500 ${statusConfig.bgLight}`}>
                        <CardContent className="pt-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Brain size={24} className="text-green-600" weight="duotone" />
                                <span className="font-semibold">Prueba Psicométrica</span>
                                <Badge className="bg-green-500 text-white">
                                  {statusConfig.icon}
                                  <span className="ml-1">Completada</span>
                                </Badge>
                              </div>
                              
                              {test.job_offer && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Briefcase size={16} weight="duotone" />
                                  <span>Para: <strong>{test.job_offer.titulo}</strong></span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle size={16} weight="duotone" className="text-green-600" />
                                <span>Completada: {formatDate(test.completed_at)}</span>
                              </div>
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

          {/* Pruebas Expiradas */}
          {expiredTests.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Warning size={20} weight="duotone" className="text-red-600" />
                Expiradas ({expiredTests.length})
              </h4>
              <div className="space-y-3">
                {expiredTests.map((test, index) => {
                  const statusConfig = getStatusConfig(test.status)
                  return (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`border-l-4 border-l-red-500 ${statusConfig.bgLight} opacity-75`}>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2">
                            <Brain size={24} className="text-red-400" weight="duotone" />
                            <span className="font-semibold text-muted-foreground">Prueba Psicométrica</span>
                            <Badge variant="destructive">Expirada</Badge>
                          </div>
                          {test.job_offer && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Para: {test.job_offer.titulo}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Confirmación */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ open, testId: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check size={24} className="text-green-500" weight="bold" />
              Confirmar Completado
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que has completado esta prueba psicométrica?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-4 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                <Warning size={18} className="flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" weight="fill" />
                <span>
                  <strong>Nota:</strong> Al marcar como completada, los reclutadores serán notificados 
                  y podrán revisar tus resultados. Asegúrate de haber terminado completamente la prueba.
                </span>
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, testId: null })}
              disabled={completing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleMarkAsCompleted}
              disabled={completing}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              {completing ? (
                <>
                  <SpinnerGap size={18} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Check size={18} weight="bold" />
                  Sí, ya la completé
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
