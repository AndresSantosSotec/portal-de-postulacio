import { User as UserIcon, SignOut, Briefcase } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import type { User } from '@/lib/types'

interface NavbarProps {
  currentUser: User | null
  onViewPortal: () => void
  onViewListings: () => void
  onLogout: () => void
}

export default function Navbar({ currentUser, onViewPortal, onViewListings, onLogout }: NavbarProps) {
  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={onViewListings}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Briefcase size={28} weight="bold" />
            <span className="text-xl font-bold tracking-tight">Portal de Postulaciones</span>
          </button>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onViewListings}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              Ofertas
            </Button>
            
            {currentUser ? (
              <>
                <Button
                  variant="ghost"
                  onClick={onViewPortal}
                  className="text-primary-foreground hover:bg-primary-foreground/10 flex items-center gap-2"
                >
                  <UserIcon size={20} />
                  Mi Portal
                </Button>
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="text-primary-foreground hover:bg-primary-foreground/10 flex items-center gap-2"
                >
                  <SignOut size={20} />
                  Cerrar Sesión
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}
