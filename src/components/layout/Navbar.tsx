import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Briefcase, User, Bell, Heart, PaperPlaneRight } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import AuthModal from '@/components/auth/AuthModal'
import type { User as UserType } from '@/lib/types'

type NavbarProps = {
  currentUser: UserType | null
  onLoginSuccess: (user: UserType) => void
  onLogout: () => void
  onNavigate: (view: string) => void
  notificationCount?: number
}

export default function Navbar({ 
  currentUser, 
  onLoginSuccess, 
  onLogout,
  onNavigate,
  notificationCount = 0
}: NavbarProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleAuthSuccess = (user: UserType) => {
    onLoginSuccess(user)
    setShowAuthModal(false)
  }

  return (
    <>
      <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => onNavigate('listings')}
              className="flex items-center gap-2 group"
            >
              <Briefcase size={28} weight="bold" className="text-primary" />
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  Computrabajo
                </span>
              </div>
            </button>

            <div className="flex items-center gap-3">
              {currentUser ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('listings')}
                    className="hidden sm:flex items-center gap-2"
                  >
                    <Briefcase size={18} weight="duotone" />
                    <span>Empleos</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('applications')}
                    className="hidden sm:flex items-center gap-2"
                  >
                    <PaperPlaneRight size={18} weight="duotone" />
                    <span>Postulaciones</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('favorites')}
                    className="hidden sm:flex items-center gap-2"
                  >
                    <Heart size={18} weight="duotone" />
                    <span>Favoritos</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('alerts')}
                    className="relative"
                  >
                    <Bell size={20} weight="duotone" />
                    {notificationCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>

                  <div className="h-6 w-px bg-border hidden sm:block" />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('profile')}
                    className="flex items-center gap-2"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={18} weight="bold" className="text-primary" />
                    </div>
                    <span className="hidden sm:inline font-medium">{currentUser.name}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLogout}
                  >
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('listings')}
                  >
                    Explorar Empleos
                  </Button>
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    size="sm"
                  >
                    Iniciar Sesión
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  )
}
