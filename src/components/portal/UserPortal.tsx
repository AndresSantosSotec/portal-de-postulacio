import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, User as UserIcon, Bell, Upload, CalendarBlank } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { User, Application, Notification } from '@/lib/types'
import { getStatusLabel, getStatusClass, formatShortDate } from '@/lib/helpers'

interface UserPortalProps {
  user: User
  onUpdateUser: (user: User) => void
}

export default function UserPortal({ user, onUpdateUser }: UserPortalProps) {
  const [applications] = useKV<Application[]>('applications', [])
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])
  const [users, setUsers] = useKV<User[]>('users', [])
  
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: user.fullName,
    phone: user.phone,
    linkedIn: user.linkedIn || '',
    portfolio: user.portfolio || '',
    experience: user.experience || '',
    education: user.education || '',
    skills: user.skills?.join(', ') || '',
  })
  const [cvFile, setCvFile] = useState<File | null>(null)

  const userApplications = applications?.filter(app => app.userId === user.id) || []
  const userNotifications = notifications?.filter(notif => notif.userId === user.id) || []
  const unreadCount = userNotifications.filter(n => !n.read).length

  const handleUpdateProfile = () => {
    const updatedUser: User = {
      ...user,
      fullName: profileData.fullName,
      phone: profileData.phone,
      linkedIn: profileData.linkedIn || undefined,
      portfolio: profileData.portfolio || undefined,
      experience: profileData.experience || undefined,
      education: profileData.education || undefined,
      skills: profileData.skills ? profileData.skills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      cvUrl: cvFile ? `cv_${user.id}_${cvFile.name}` : user.cvUrl,
    }

    setUsers((currentUsers = []) =>
      currentUsers.map(u => u.id === user.id ? updatedUser : u)
    )
    onUpdateUser(updatedUser)
    setIsEditingProfile(false)
    setCvFile(null)
    toast.success('Perfil actualizado exitosamente')
  }

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((current = []) =>
      current.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCvFile(file)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            Bienvenido, {user.fullName}
          </h1>
          <p className="text-lg opacity-90">
            Gestiona tus postulaciones y mantén tu perfil actualizado
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText size={20} />
              <span className="hidden sm:inline">Mis Postulaciones</span>
              <span className="sm:hidden">Postulaciones</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon size={20} />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 relative">
              <Bell size={20} />
              Notificaciones
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Mis Postulaciones</h2>
              <p className="text-muted-foreground mb-6">
                {userApplications.length} {userApplications.length === 1 ? 'postulación activa' : 'postulaciones activas'}
              </p>
            </div>

            {userApplications.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tienes postulaciones</h3>
                <p className="text-muted-foreground">
                  Explora las ofertas disponibles y comienza a aplicar
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {userApplications.map((application) => (
                  <Card key={application.id} className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          {application.jobTitle}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarBlank size={16} />
                            Aplicado: {formatShortDate(application.appliedDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarBlank size={16} />
                            Actualizado: {formatShortDate(application.lastUpdated)}
                          </div>
                        </div>
                        {application.interviewDate && (
                          <p className="text-sm text-warning mt-2 font-medium">
                            Entrevista programada: {formatShortDate(application.interviewDate)}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusClass(application.status)}>
                          {getStatusLabel(application.status)}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mi Perfil</h2>
              {!isEditingProfile && (
                <Button onClick={() => setIsEditingProfile(true)}>
                  Editar Perfil
                </Button>
              )}
            </div>

            <Card className="p-6">
              {isEditingProfile ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-fullName">Nombre Completo</Label>
                      <Input
                        id="edit-fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Teléfono</Label>
                      <Input
                        id="edit-phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-email">Correo Electrónico</Label>
                    <Input
                      id="edit-email"
                      value={user.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      El correo electrónico no se puede modificar
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-linkedIn">LinkedIn</Label>
                      <Input
                        id="edit-linkedIn"
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        value={profileData.linkedIn}
                        onChange={(e) => setProfileData(prev => ({ ...prev, linkedIn: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-portfolio">Portafolio</Label>
                      <Input
                        id="edit-portfolio"
                        type="url"
                        placeholder="https://..."
                        value={profileData.portfolio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, portfolio: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-experience">Experiencia</Label>
                    <Textarea
                      id="edit-experience"
                      placeholder="Describe tu experiencia profesional..."
                      value={profileData.experience}
                      onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-education">Educación</Label>
                    <Textarea
                      id="edit-education"
                      placeholder="Describe tu formación académica..."
                      value={profileData.education}
                      onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-skills">Habilidades</Label>
                    <Input
                      id="edit-skills"
                      placeholder="JavaScript, React, Node.js..."
                      value={profileData.skills}
                      onChange={(e) => setProfileData(prev => ({ ...prev, skills: e.target.value }))}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Separa las habilidades con comas
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="edit-cv">Actualizar Hoja de Vida</Label>
                    <div className="mt-2">
                      <label
                        htmlFor="edit-cv"
                        className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        <Upload size={24} />
                        <span>{cvFile ? cvFile.name : user.cvUrl || 'Seleccionar archivo'}</span>
                      </label>
                      <input
                        id="edit-cv"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false)
                        setCvFile(null)
                        setProfileData({
                          fullName: user.fullName,
                          phone: user.phone,
                          linkedIn: user.linkedIn || '',
                          portfolio: user.portfolio || '',
                          experience: user.experience || '',
                          education: user.education || '',
                          skills: user.skills?.join(', ') || '',
                        })
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleUpdateProfile}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-muted-foreground">Nombre Completo</Label>
                      <p className="text-lg">{user.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Teléfono</Label>
                      <p className="text-lg">{user.phone}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Correo Electrónico</Label>
                    <p className="text-lg">{user.email}</p>
                  </div>

                  {(user.linkedIn || user.portfolio) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {user.linkedIn && (
                        <div>
                          <Label className="text-muted-foreground">LinkedIn</Label>
                          <a
                            href={user.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {user.linkedIn}
                          </a>
                        </div>
                      )}
                      {user.portfolio && (
                        <div>
                          <Label className="text-muted-foreground">Portafolio</Label>
                          <a
                            href={user.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {user.portfolio}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {user.experience && (
                    <div>
                      <Label className="text-muted-foreground">Experiencia</Label>
                      <p className="mt-1 whitespace-pre-line">{user.experience}</p>
                    </div>
                  )}

                  {user.education && (
                    <div>
                      <Label className="text-muted-foreground">Educación</Label>
                      <p className="mt-1 whitespace-pre-line">{user.education}</p>
                    </div>
                  )}

                  {user.skills && user.skills.length > 0 && (
                    <div>
                      <Label className="text-muted-foreground">Habilidades</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.cvUrl && (
                    <div>
                      <Label className="text-muted-foreground">Hoja de Vida</Label>
                      <p className="text-sm mt-1">{user.cvUrl}</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Notificaciones</h2>
              <p className="text-muted-foreground mb-6">
                {unreadCount > 0
                  ? `Tienes ${unreadCount} ${unreadCount === 1 ? 'notificación nueva' : 'notificaciones nuevas'}`
                  : 'No tienes notificaciones nuevas'}
              </p>
            </div>

            {userNotifications.length === 0 ? (
              <Card className="p-12 text-center">
                <Bell size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tienes notificaciones</h3>
                <p className="text-muted-foreground">
                  Te notificaremos cuando haya actualizaciones en tus postulaciones
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {userNotifications
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((notification) => (
                    <Card
                      key={notification.id}
                      className={`p-4 ${notification.read ? 'bg-card' : 'bg-accent/5 border-accent'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className={notification.read ? 'text-muted-foreground' : 'font-medium'}>
                            {notification.message}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatShortDate(notification.date)}
                          </p>
                        </div>
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Marcar como leída
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
