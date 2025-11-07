import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import JobListings from '@/components/jobs/JobListings'
import JobDetail from '@/components/jobs/JobDetail'
import UserPortal from '@/components/portal/UserPortal'
import Chatbot from '@/components/jobs/Chatbot'
import { useNotificationService } from '@/hooks/use-notification-service'
import { generateSampleJobs } from '@/lib/sampleData'
import type { User, Job, Application } from '@/lib/types'

type View = 'listings' | 'detail' | 'profile' | 'applications' | 'favorites' | 'alerts'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('listings')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useKV<User | null>('current_user', null)
  const [jobs, setJobs] = useKV<Job[]>('jobs', [])
  const [applications] = useKV<Application[]>('applications', [])
  
  const { notificationCount } = useNotificationService(currentUser?.id || null)
  const [notificationCountState] = useState(notificationCount)

  useEffect(() => {
    if (!jobs || jobs.length === 0) {
      setJobs(generateSampleJobs())
    }
  }, [jobs, setJobs])

  const user = currentUser ?? null

  const handleViewJob = (jobId: string) => {
    setSelectedJobId(jobId)
    setCurrentView('detail')
  }

  const handleBackToListings = () => {
    setCurrentView('listings')
    setSelectedJobId(null)
  }

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user)
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
          currentUser={user}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          notificationCount={notificationCount}
        />

        <main>
          {currentView === 'listings' && (
            <JobListings
              onViewJob={handleViewJob}
              currentUser={user}
            />
          )}

          {currentView === 'detail' && selectedJobId && (
            <JobDetail
              jobId={selectedJobId}
              currentUser={user}
              onBack={handleBackToListings}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {(currentView === 'profile' || 
            currentView === 'applications' || 
            currentView === 'favorites' || 
            currentView === 'alerts') && 
            user && (
            <UserPortal
              user={user}
              onUpdateUser={setCurrentUser}
              onViewJob={handleViewJob}
            />
          )}
        </main>

        <Chatbot 
          applications={currentUser ? applications?.filter(app => app.userId === currentUser.id) : []}
          userName={currentUser?.name}
        />

        <Toaster />
      </div>
    </ThemeProvider>
  )
}
