import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { statusLabels } from '@/lib/types'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, Eye, UserFocus, Sparkle, Flask } from '@phosphor-icons/react'
import type { Application, ApplicationStatus } from '@/lib/types'

const statusSteps: Array<{ key: ApplicationStatus; label: string; icon: typeof CheckCircle }> = [
  { key: 'postulado', label: 'Postulado', icon: CheckCircle },
  { key: 'cv-visto', label: 'CV Visto', icon: Eye },
  { key: 'en-proceso', label: 'En Proceso', icon: Clock },
  { key: 'finalista', label: 'Finalista', icon: UserFocus },
  { key: 'proceso-finalizado', label: 'Proceso Finalizado', icon: Sparkle }
]

export default function ApplicationTimeline({ application }: { application: Application }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const currentStatusIndex = statusSteps.findIndex(step => step.key === application.status)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Seguimiento de Aplicación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = index <= currentStatusIndex
            const isPending = index > currentStatusIndex
            const historyEntry = application.statusHistory?.find(h => h.status === step.key)

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      isCompleted && "bg-success text-success-foreground",
                      isPending && "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon size={20} weight="bold" />
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={cn(
                        "w-0.5 h-12 mt-2",
                        isCompleted ? "bg-success" : "bg-muted"
                      )}
                    />
                  )}
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <h4
                      className={cn(
                        "font-semibold",
                        isPending && "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </h4>
                    {isCompleted && (
                      <Badge variant="secondary" className="text-xs">
                        Completado
                      </Badge>
                    )}
                  </div>

                  {historyEntry && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(historyEntry.date)}
                      {historyEntry.note && ` - ${historyEntry.note}`}
                    </p>
                  )}

                  {!historyEntry && isCompleted && step.key === 'postulado' && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(application.appliedDate)}
                    </p>
                  )}

                  {isPending && (
                    <p className="text-sm text-muted-foreground mt-1">Pendiente</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {application.psychometricTestSent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/20"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Flask size={20} weight="bold" className="text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Pruebas Psicométricas</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} weight="bold" className="text-success" />
                    <span>Prueba enviada: {application.psychometricTestSentDate && formatDate(application.psychometricTestSentDate)}</span>
                  </div>
                  {application.psychometricTestCompleted ? (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} weight="bold" className="text-success" />
                      <span>Prueba completada: {application.psychometricTestCompletedDate && formatDate(application.psychometricTestCompletedDate)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={16} weight="bold" />
                      <span>Pendiente de completar</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
