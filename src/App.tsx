import { useState, useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import JobListings from '@/components/jobs/JobListings'
import JobDetail from '@/components/jobs/JobDetail'
import UserPortal from '@/components/portal/UserPortal'
import Chatbot from '@/components/jobs/Chatbot'
import { useNotificationService } from '@/hooks/use-notification-service'
import { applicationService } from '@/lib/applicationService'
import type { User, Job, Application } from '@/lib/types'

type View = 'listings' | 'detail' | 'profile' | 'applications' | 'favorites' | 'alerts'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('listings')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  
  // Usar localStorage en lugar de Spark KV
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('current_user')
    return stored ? JSON.parse(stored) : null
  })
  
  const [applications] = useState<Application[]>([])
  
  const { notificationCount } = useNotificationService(currentUser?.id || null)

  // Escuchar evento de sesión expirada
  useEffect(() => {
    const handleAuthExpired = (event: CustomEvent) => {
      toast.error(event.detail.message, {
        duration: 5000,
        description: 'Serás redirigido al login...'
      })
      setCurrentUser(null)
    }

    window.addEventListener('auth:expired', handleAuthExpired as EventListener)
    
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired as EventListener)
    }
  }, [])

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('current_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('current_user')
    }
  }, [currentUser])

  const handleViewJob = (jobId: string) => {
    console.log('🔄 [App] Navegando a detalle de empleo:', jobId)
    setSelectedJobId(jobId)
    setCurrentView('detail')
  }

  const handleBackToListings = () => {
    setCurrentView('listings')
    setSelectedJobId(null)
  }

  const handleLoginSuccess = async (user: User) => {
    setCurrentUser(user)
    
    // Fetch complete profile to get avatar if user has photo
    try {
      const completeProfile = await applicationService.getCompleteProfile()
      if (completeProfile.postulante?.foto_perfil_url) {
        const avatarUrl = completeProfile.postulante.foto_perfil_url.includes('?')
          ? `${completeProfile.postulante.foto_perfil_url}&t=${Date.now()}`
          : `${completeProfile.postulante.foto_perfil_url}?t=${Date.now()}`
        setCurrentUser(prev => prev ? { ...prev, avatar: avatarUrl } : null)
      }
    } catch (error) {
      console.error('Error loading profile photo:', error)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView('listings')
  }

  const handleNavigate = (view: string) => {
    setCurrentView(view as View)
    setSelectedJobId(null)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar
          currentUser={currentUser}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          notificationCount={notificationCount}
        />

        <main>
          {currentView === 'listings' && (
            <JobListings
              onViewJob={handleViewJob}
              currentUser={currentUser}
            />
          )}

          {currentView === 'detail' && selectedJobId && (
            <JobDetail
              jobId={selectedJobId}
              currentUser={currentUser}
              onBack={handleBackToListings}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {(currentView === 'profile' || 
            currentView === 'applications' || 
            currentView === 'favorites' || 
            currentView === 'alerts') && 
            currentUser && (
            <UserPortal
              user={currentUser}
              onUpdateUser={setCurrentUser}
              onViewJob={handleViewJob}
            />
          )}
        </main>

        <Chatbot userName={currentUser?.name} />

        <Toaster />
      </div>
    </ThemeProvider>
  )
}
