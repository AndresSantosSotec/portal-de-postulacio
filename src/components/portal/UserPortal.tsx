import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { User as UserIcon, Briefcase, PencilSimple, Plus, Trash, MapPin, CalendarBlank, GraduationCap } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { User, WorkExperience, Education, Application, Job, JobAlert } from '@/lib/types'
import { statusLabels, categoryLabels } from '@/lib/types'

type UserPortalProps = {
  user: User
  onUpdateUser: (user: User) => void
  onViewJob: (jobId: string) => void
}

export default function UserPortal({ user, onUpdateUser, onViewJob }: UserPortalProps) {
  const [jobs] = useKV<Job[]>('jobs', [])
  const [applications] = useKV<Application[]>('applications', [])
  const [favorites] = useKV<string[]>('favorites', [])
  const [alerts, setAlerts] = useKV<JobAlert[]>('job_alerts', [])
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.profile?.phone || '',
    location: user.profile?.location || '',
    bio: user.profile?.bio || ''
  })

  const userApplications = applications?.filter(app => app.userId === user.id) || []
  const userFavorites = jobs?.filter(job => favorites?.includes(job.id)) || []
  const userAlerts = alerts?.filter(alert => alert.userId === user.id) || []

  const handleSaveProfile = () => {
    const updatedUser: User = {
      ...user,
      name: formData.name,
      profile: {
        ...user.profile!,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio
      }
    }
    onUpdateUser(updatedUser)
    setIsEditing(false)
    toast.success('Perfil actualizado exitosamente')
  }

  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: `exp_${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
    
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        experience: [...(user.profile?.experience || []), newExp]
      }
    }
    onUpdateUser(updatedUser)
  }

  const handleRemoveExperience = (id: string) => {
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        experience: user.profile!.experience.filter(exp => exp.id !== id)
      }
    }
    onUpdateUser(updatedUser)
    toast.success('Experiencia eliminada')
  }

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu_${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false
    }
    
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        education: [...(user.profile?.education || []), newEdu]
      }
    }
    onUpdateUser(updatedUser)
  }

  const handleRemoveEducation = (id: string) => {
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        education: user.profile!.education.filter(edu => edu.id !== id)
      }
    }
    onUpdateUser(updatedUser)
    toast.success('Educación eliminada')
  }

  const handleAddSkill = (skill: string) => {
    if (!skill.trim()) return
    
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        skills: [...(user.profile?.skills || []), skill.trim()]
      }
    }
    onUpdateUser(updatedUser)
  }

  const handleRemoveSkill = (skill: string) => {
    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile!,
        skills: user.profile!.skills.filter(s => s !== skill)
      }
    }
    onUpdateUser(updatedUser)
  }

  const handleAddAlert = (category: string, location: string, keywords: string) => {
    const newAlert: JobAlert = {
      id: `alert_${Date.now()}`,
      userId: user.id,
      category: (category as any) || undefined,
      location: location || undefined,
      keywords: keywords || undefined,
      createdDate: new Date().toISOString()
    }
    
    setAlerts(currentAlerts => [...(currentAlerts || []), newAlert])
    toast.success('Alerta creada exitosamente')
  }

  const handleRemoveAlert = (id: string) => {
    setAlerts(currentAlerts => currentAlerts?.filter(alert => alert.id !== id) || [])
    toast.success('Alerta eliminada')
  }

  const getJobForApplication = (app: Application) => {
    return jobs?.find(j => j.id === app.jobId)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-accent text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <UserIcon size={40} weight="bold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-white/90">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
            <TabsTrigger value="applications">
              Mis Postulaciones
              {userApplications.length > 0 && (
                <Badge variant="secondary" className="ml-2">{userApplications.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="favorites">
              Favoritos
              {userFavorites.length > 0 && (
                <Badge variant="secondary" className="ml-2">{userFavorites.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="alerts">
              Mis Alertas
              {userAlerts.length > 0 && (
                <Badge variant="secondary" className="ml-2">{userAlerts.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Información Personal</CardTitle>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  >
                    {isEditing ? 'Guardar Cambios' : (
                      <>
                        <PencilSimple size={16} className="mr-2" />
                        Editar
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="+502 1234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Ciudad, País"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Sobre mí</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Describe tu perfil profesional..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Experiencia Laboral</CardTitle>
                  <Button size="sm" onClick={handleAddExperience}>
                    <Plus size={16} className="mr-2" />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.profile?.experience.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No has agregado experiencia laboral
                  </p>
                ) : (
                  user.profile?.experience.map((exp) => (
                    <div key={exp.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Cargo"
                            value={exp.position}
                            readOnly
                          />
                          <Input
                            placeholder="Empresa"
                            value={exp.company}
                            readOnly
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExperience(exp.id)}
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Descripción..."
                        value={exp.description}
                        rows={2}
                        readOnly
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Educación</CardTitle>
                  <Button size="sm" onClick={handleAddEducation}>
                    <Plus size={16} className="mr-2" />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.profile?.education.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No has agregado información educativa
                  </p>
                ) : (
                  user.profile?.education.map((edu) => (
                    <div key={edu.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Institución"
                            value={edu.institution}
                          />
                          <div className="grid sm:grid-cols-2 gap-2">
                            <Input
                              placeholder="Título/Grado"
                              value={edu.degree}
                            />
                            <Input
                              placeholder="Campo de estudio"
                              value={edu.field}
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEducation(edu.id)}
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Habilidades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {user.profile?.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="gap-2 pr-1"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:bg-destructive/20 rounded p-0.5"
                      >
                        <Trash size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar habilidad..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSkill(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      handleAddSkill(input.value)
                      input.value = ''
                    }}
                  >
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            {userApplications.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Briefcase size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No tienes postulaciones</h3>
                  <p className="text-muted-foreground mb-6">
                    Comienza a explorar empleos y postúlate a los que te interesen
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userApplications.map((app) => {
                  const job = getJobForApplication(app)
                  if (!job) return null

                  return (
                    <Card key={app.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                            <p className="text-muted-foreground mb-3">{job.company}</p>
                            
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarBlank size={16} />
                                Postulado el {new Date(app.appliedDate).toLocaleDateString('es-ES')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-start sm:items-end gap-3">
                            <Badge className="bg-accent text-accent-foreground">
                              {statusLabels[app.status]}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewJob(job.id)}
                            >
                              Ver empleo
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {userFavorites.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <div className="text-6xl mb-4">❤️</div>
                  <h3 className="text-xl font-semibold mb-2">No tienes empleos favoritos</h3>
                  <p className="text-muted-foreground">
                    Guarda empleos que te interesen para revisarlos más tarde
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userFavorites.map((job) => (
                  <Card
                    key={job.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onViewJob(job.id)}
                  >
                    <CardHeader>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin size={16} />
                        {job.location}
                      </div>
                      <Badge variant="secondary">
                        {categoryLabels[job.category]}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Crear Nueva Alerta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input id="alert-keywords" placeholder="Palabras clave..." />
                    <Input id="alert-location" placeholder="Ubicación..." />
                    <Button
                      onClick={() => {
                        const keywords = (document.getElementById('alert-keywords') as HTMLInputElement).value
                        const location = (document.getElementById('alert-location') as HTMLInputElement).value
                        handleAddAlert('', location, keywords);
                        (document.getElementById('alert-keywords') as HTMLInputElement).value = '';
                        (document.getElementById('alert-location') as HTMLInputElement).value = ''
                      }}
                    >
                      Crear Alerta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {userAlerts.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <div className="text-6xl mb-4">🔔</div>
                  <h3 className="text-xl font-semibold mb-2">No tienes alertas activas</h3>
                  <p className="text-muted-foreground">
                    Crea alertas para recibir notificaciones de nuevos empleos
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userAlerts.map((alert) => (
                  <Card key={alert.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {alert.keywords && (
                              <Badge variant="secondary">Palabras: {alert.keywords}</Badge>
                            )}
                            {alert.location && (
                              <Badge variant="secondary">Ubicación: {alert.location}</Badge>
                            )}
                            {alert.category && (
                              <Badge variant="secondary">Categoría: {categoryLabels[alert.category]}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Creada el {new Date(alert.createdDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAlert(alert.id)}
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    </CardContent>
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
