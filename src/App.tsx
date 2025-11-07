import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import Navbar from '@/components/layout/Navbar'
import JobListings from '@/components/jobs/JobListings'
import JobDetail from '@/components/jobs/JobDetail'
import UserPortal from '@/components/portal/UserPortal'
import { useKV } from '@github/spark/hooks'
import type { User } from '@/lib/types'

type View = 'listings' | 'detail' | 'portal'

function App() {
  const [currentView, setCurrentView] = useState<View>('listings')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useKV<User | null>('current_user', null)
  
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
    setCurrentView('portal')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView('listings')
  }

  const handleViewPortal = () => {
    setCurrentView('portal')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        currentUser={user}
        onViewPortal={handleViewPortal}
        onViewListings={handleBackToListings}
        onLogout={handleLogout}
      />
      
      <main>
        {currentView === 'listings' && (
          <JobListings onViewJob={handleViewJob} />
        )}
        
        {currentView === 'detail' && selectedJobId && (
          <JobDetail
            jobId={selectedJobId}
            currentUser={user}
            onBack={handleBackToListings}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        
        {currentView === 'portal' && user && (
          <UserPortal
            user={user}
            onUpdateUser={setCurrentUser}
          />
        )}
      </main>
      
      <Toaster />
    </div>
  )
}

export default App