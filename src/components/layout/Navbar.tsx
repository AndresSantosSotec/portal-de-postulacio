import { useState } from 'react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Briefcase, 
  User, 
  Bell, 
  Heart, 
  PaperPlaneRight,
  SignOut,
  List
} from '@phosphor-icons/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import AuthModal from '@/components/auth/AuthModal'
import NotificationsPanel from '@/components/portal/NotificationsPanel'
import { ThemeToggle } from './ThemeToggle'
import type { User as UserType } from '@/lib/types'
import type { Notification } from '@/components/portal/NotificationsPanel'

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
  const [notifications] = useKV<Notification[]>('notifications', [])
  
  const unreadCount = notifications?.filter(n => currentUser && n.userId === currentUser.id && !n.read).length || 0

  const handleAuthSuccess = (user: UserType) => {
    onLoginSuccess(user)
    setShowAuthModal(false)
  }

  const initials = currentUser?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <>
      <nav className="bg-card/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => onNavigate('listings')}
              className="flex items-center gap-3 group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-primary to-[#003875] flex items-center justify-center shadow-lg shadow-primary/30"
              >
                <Briefcase size={24} weight="bold" className="text-white" />
              </motion.div>
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-[#003875] bg-clip-text text-transparent group-hover:from-primary/90 group-hover:to-[#003875]/90 transition-all">
                  CoosajerJobs
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Conectando talento con oportunidades
                </span>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {currentUser ? (
                <>
                  <div className="hidden lg:flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('listings')}
                      className="gap-2 hover:bg-primary/10 hover:text-primary"
                    >
                      <Briefcase size={18} weight="duotone" />
                      Empleos
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('applications')}
                      className="gap-2 hover:bg-primary/10 hover:text-primary"
                    >
                      <PaperPlaneRight size={18} weight="duotone" />
                      Postulaciones
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('favorites')}
                      className="gap-2 hover:bg-primary/10 hover:text-primary"
                    >
                      <Heart size={18} weight="duotone" />
                      Favoritos
                    </Button>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="relative hover:bg-warning/10"
                      >
                        <Bell size={20} weight={unreadCount > 0 ? "fill" : "duotone"} className={unreadCount > 0 ? "text-warning" : ""} />
                        {unreadCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                          >
                            {unreadCount}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0" align="end">
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-base">Notificaciones</h3>
                          {unreadCount > 0 && (
                            <Badge variant="default">{unreadCount} nuevas</Badge>
                          )}
                        </div>
                      </div>
                      <div className="p-4 max-h-[400px] overflow-y-auto">
                        {currentUser && <NotificationsPanel user={currentUser} compact={true} />}
                      </div>
                      <div className="p-3 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => onNavigate('alerts')}
                        >
                          Ver todas las notificaciones
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2 hover:bg-primary/10">
                        <Avatar className="h-8 w-8">
                          {currentUser.avatar && <AvatarImage src={currentUser.avatar} alt={currentUser.name} />}
                          <AvatarFallback className="bg-gradient-to-br from-primary to-[#003875] text-white text-sm font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline font-medium">{currentUser.name.split(' ')[0]}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-2">
                        <p className="text-sm font-medium">{currentUser.name}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onNavigate('profile')} className="gap-2 cursor-pointer">
                        <User size={16} weight="duotone" />
                        Mi Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onNavigate('applications')} className="gap-2 cursor-pointer">
                        <PaperPlaneRight size={16} weight="duotone" />
                        Mis Postulaciones
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onNavigate('favorites')} className="gap-2 cursor-pointer">
                        <Heart size={16} weight="duotone" />
                        Favoritos
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onLogout} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                        <SignOut size={16} weight="duotone" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('listings')}
                    className="hidden sm:flex gap-2"
                  >
                    <List size={18} weight="duotone" />
                    Explorar Empleos
                  </Button>
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    size="sm"
                    className="gap-2 bg-gradient-to-r from-primary to-[#003875] hover:from-primary/90 hover:to-[#003875]/90 shadow-lg shadow-primary/25"
                  >
                    <User size={18} weight="bold" />
                    <span className="hidden sm:inline">Iniciar Sesión</span>
                    <span className="sm:hidden">Ingresar</span>
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
