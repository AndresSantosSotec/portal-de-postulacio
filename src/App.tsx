import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import Navbar from '@/components/layout/Navbar'
import JobListings from '@/components/jobs/JobListings'
import JobDetail from '@/components/jobs/JobDetail'
import UserPortal from '@/components/portal/UserPortal'
import type { User } from '@/lib/types'

type View = 'listings' | 'detail' | 'profile' | 'applications' | 'favorites' | 'alerts'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('listings')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useKV<User | null>('current_user', null)
  const [notificationCount] = useState(3)

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

      <Toaster />
    </div>
  )
}
