import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Circle, Clock, Flask } 
import type { Application } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { Application } from '@/lib/types'
import { statusLabels } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusSteps = [
  { key: 'cv-visto', label
 

export default functi

    return new Date(dateString).toLocaleDateString('es-GT', {
      month: 'short',
      hour: '2-digit',
    })


        <CardTitle className="text-lg">Seguimiento del Proceso</CardTitle>
      <CardContent>

            const isCompleted = index <= curre
            const isPending = index > currentStatusIndex
            const his
            return (
                key={s
                animat
                classNa
      
   

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
                className="relative flex gap-4"
              >
                {index !== statusSteps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-[15px] top-8 w-0.5 h-full",
                      isCompleted ? "bg-primary" : "bg-border"
                    )}
                  />
                )}

                <div className={cn(
                  "relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  isPending && "bg-muted text-muted-foreground"
                )}>
                  <Icon size={18} weight={isCompleted ? "fill" : "regular"} />
                </div>

                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className={cn(
                      "font-semibold",
                      isCompleted && "text-foreground",
                      isPending && "text-muted-foreground"
                    )}>
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <Badge variant="default" className="text-xs">
                        Estado Actual
                      </Badge>
                    )}
                  </div>
                  
                  {historyEntry && (
                    <div className="text-sm text-muted-foreground">
                      <p>{formatDate(historyEntry.date)}</p>
                      {historyEntry.note && (
                        <p className="mt-1 text-foreground">{historyEntry.note}</p>
                      )}
                    </div>
                  )}

                  {!historyEntry && isCompleted && (
                    <p className="text-sm text-muted-foreground">
                      {formatDate(application.updatedDate)}
                    </p>
                  )}

                  {isPending && (
                    <p className="text-sm text-muted-foreground">Pendiente</p>
                  )}
                </div>
              </motion.div>
            )
          })}

          {application.psychometricTestSent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  <Flask size={20} weight="duotone" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Pruebas Psicométricas</h4>
                  {application.psychometricTestCompleted ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} weight="fill" className="text-success" />
                        <span className="text-sm font-medium text-success">Completadas</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
}





























