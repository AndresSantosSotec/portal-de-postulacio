import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Circle, Clock, Flask } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { statusLabels } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import type { Application } from '@/lib/types'

const statusSteps = [
  { key: 'postulado', label: 'Postulado', icon: Circle },
  { key: 'cv-visto', label: 'CV Visto', icon: CheckCircle },
  { key: 'en-proceso', label: 'En Proceso', icon: Clock },
  { key: 'finalista', label: 'Finalista', icon: CheckCircle },
  { key: 'proceso-finalizado', label: 'Proceso Finalizado', icon: CheckCircle }
]

export default function ApplicationTimeline({ application }: { application: Application }) {
  const currentStatusIndex = statusSteps.findIndex(s => s.key === application.status)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Seguimiento del Proceso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {statusSteps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = index <= currentStatusIndex
            const isCurrent = index === currentStatusIndex
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

                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2">
                    <h4
                      className={cn(
                        "font-semibold",
                        isPending && "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <Badge variant="secondary" className="text-xs">
                        Estado Actual
                      </Badge>
                    )}
                  </div>

                  {historyEntry && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(historyEntry.date)}
                      {historyEntry.note && ` - ${historyEntry.note}`}
                    </p>
                  )}
                  {!historyEntry && isCompleted && (
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

          {application.psychometricTestSent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/20"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Flask size={20} weight="bold" className="text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Pruebas Psicométricas</h4>
                  {application.psychometricTestCompleted ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} weight="bold" className="text-success" />
                        <span className="text-sm font-medium text-success">Completadas</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {application.psychometricTestCompletedDate && formatDate(application.psychometricTestCompletedDate)}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock size={16} weight="bold" className="text-warning" />
                        <span className="text-sm font-medium text-warning">Pendiente de completar</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enviadas: {application.psychometricTestSentDate && formatDate(application.psychometricTestSentDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
