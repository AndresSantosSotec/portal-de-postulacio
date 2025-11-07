import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { statusLabels } from '@/
import { motion } from 'framer-motion'
import { statusLabels } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import type { Application } from '@/lib/types'

const statusSteps = [
  { key: 'finalista', label: 'Finalista', icon: CheckCirc
]
export default function ApplicationTimeline({ application 

    return new Date(dateString).toLocaleDateString('es-GT', {
 

    })


        <CardTitle className="text-lg">Seguimi
      <CardContent>
      year: 'numeric',
      month: 'long',
            const isC


      
   

          
          
                  
                      isPending && "bg-muted text-muted-foreground"
                  >
                  <
                    <div
                        "w-0.5 h-12 mt-2",
                      )}
                  )}

                  <div className="flex items-center gap-

                        isPending && "text-muted-foreground"

                    
                      <Ba
                      </Badge>
                  </div>
                  {historyEntry && (
                      {formatDate(historyEntry.date
                className="flex gap-4"
               
                <div className="flex flex-col items-center">
                  )}
                    <p className="
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      isCompleted && "bg-success text-success-foreground",
                      isPending && "bg-muted text-muted-foreground"
          {application
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
                    <d

                      </div>
                  <div className="flex items-center gap-2">
                    <h4
                      className={cn(
                        "font-semibold",
                        isPending && "text-muted-foreground"
                      )}
                    >



                      <Badge variant="secondary" className="text-xs">






                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(historyEntry.date)}
                      {historyEntry.note && ` - ${historyEntry.note}`}
                    </p>


                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(application.appliedDate)}



                    <p className="text-sm text-muted-foreground mt-1">Pendiente</p>










              className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/20"


                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Flask size={20} weight="bold" className="text-accent-foreground" />


                  <h4 className="font-semibold mb-2">Pruebas Psicométricas</h4>



                        <CheckCircle size={16} weight="bold" className="text-success" />


























