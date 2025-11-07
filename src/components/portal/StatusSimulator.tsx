import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Shuffle, CheckCircle } from '@phosphor-icons/react'
import type { Application, ApplicationStatus } from '@/lib/types'
import { statusLabels } from '@/lib/types'

type StatusSimulatorProps = {
  userId: string
}

export default function StatusSimulator({ userId }: StatusSimulatorProps) {
  const [applications, setApplications] = useKV<Application[]>('applications', [])
  const [selectedAppId, setSelectedAppId] = useState<string>('')
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('postulado')

  const userApplications = applications?.filter(app => app.userId === userId) || []
  const selectedApp = userApplications.find(app => app.id === selectedAppId)

  const handleStatusChange = () => {
    if (!selectedAppId) {
      toast.error('Selecciona una postulación')
      return
    }

    setApplications(current => 
      (current || []).map(app => 
        app.id === selectedAppId 
          ? { ...app, status: newStatus, updatedDate: new Date().toISOString() }
          : app
      )
    )

    toast.success('Estado actualizado', {
      description: `El estado ha sido cambiado a: ${statusLabels[newStatus]}`
    })
  }

  const handleRandomStatusChange = () => {
    if (userApplications.length === 0) {
      toast.error('No tienes postulaciones')
      return
    }

    const randomApp = userApplications[Math.floor(Math.random() * userApplications.length)]
    const statuses: ApplicationStatus[] = ['postulado', 'cv-visto', 'en-proceso', 'finalista', 'proceso-finalizado']
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    setApplications(current => 
      (current || []).map(app => 
        app.id === randomApp.id 
          ? { ...app, status: randomStatus, updatedDate: new Date().toISOString() }
          : app
      )
    )

    toast.success('¡Estado aleatorio aplicado!', {
      description: `${statusLabels[randomStatus]} para una de tus postulaciones`
    })
  }

  if (userApplications.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Postúlate a empleos para probar las notificaciones
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-warning/30 bg-warning/5">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <CheckCircle size={20} weight="duotone" className="text-warning-foreground" />
          Simulador de Estados (Demo)
        </CardTitle>
        <CardDescription>
          Cambia el estado de tus postulaciones para ver las notificaciones en tiempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Postulación</label>
            <Select value={selectedAppId} onValueChange={setSelectedAppId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una postulación" />
              </SelectTrigger>
              <SelectContent>
                {userApplications.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    Postulación #{app.id.slice(-6)}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {statusLabels[app.status]}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nuevo Estado</label>
            <Select value={newStatus} onValueChange={(val) => setNewStatus(val as ApplicationStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="postulado">{statusLabels['postulado']}</SelectItem>
                <SelectItem value="cv-visto">{statusLabels['cv-visto']}</SelectItem>
                <SelectItem value="en-proceso">{statusLabels['en-proceso']}</SelectItem>
                <SelectItem value="finalista">{statusLabels['finalista']}</SelectItem>
                <SelectItem value="proceso-finalizado">{statusLabels['proceso-finalizado']}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedApp && (
          <div className="p-3 rounded-md bg-muted/50 text-sm">
            <p className="font-medium mb-1">Estado actual:</p>
            <Badge variant="outline">{statusLabels[selectedApp.status]}</Badge>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleStatusChange} 
            disabled={!selectedAppId}
            className="flex-1 gap-2"
          >
            <CheckCircle size={18} weight="duotone" />
            Cambiar Estado
          </Button>
          <Button 
            onClick={handleRandomStatusChange}
            variant="outline"
            className="gap-2"
          >
            <Shuffle size={18} weight="duotone" />
            Aleatorio
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
