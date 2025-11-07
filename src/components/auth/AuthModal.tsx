import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { EnvelopeSimple, LockKey, User as UserIcon, Eye, EyeSlash, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { User } from '@/lib/types'

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: User) => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLogin) {
      const user: User = {
        id: Date.now().toString(),
        email: formData.email,
        password: formData.password,
        name: formData.email.split('@')[0],
        profile: {
          experience: [],
          education: [],
          skills: []
        }
      }
      
      toast.success('¡Sesión iniciada exitosamente!')
      onSuccess(user)
      onClose()
    } else {
      if (!formData.name) {
        toast.error('Por favor ingresa tu nombre')
        return
      }
      
      const user: User = {
        id: Date.now().toString(),
        email: formData.email,
        password: formData.password,
        name: formData.name,
        profile: {
          experience: [],
          education: [],
          skills: []
        }
      }
      
      toast.success('¡Cuenta creada exitosamente!')
      onSuccess(user)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
          
          <div className="relative p-8">
            <DialogHeader className="space-y-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20"
              >
                <UserIcon size={32} weight="bold" className="text-white" />
              </motion.div>
              
              <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
              </DialogTitle>
              
              <DialogDescription className="text-center text-base">
                {isLogin 
                  ? 'Ingresa tus credenciales para acceder a tu cuenta' 
                  : 'Comienza tu búsqueda de empleo hoy mismo'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-5 mt-8">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-sm font-semibold">Nombre Completo</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <UserIcon size={20} weight="duotone" />
                      </div>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Juan Pérez"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required={!isLogin}
                        className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Correo Electrónico</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <EnvelopeSimple size={20} weight="duotone" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">Contraseña</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <LockKey size={20} weight="duotone" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="pl-11 pr-11 h-12 bg-background/50 border-border/50 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              {!isLogin && (
                <div className="space-y-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <p className="text-sm font-medium text-accent-foreground/80">Tu cuenta incluye:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle size={16} weight="fill" className="text-secondary" />
                      <span>Perfil profesional completo</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle size={16} weight="fill" className="text-secondary" />
                      <span>Seguimiento de postulaciones</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle size={16} weight="fill" className="text-secondary" />
                      <span>Alertas personalizadas de empleo</span>
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all"
                size="lg"
              >
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta Gratis'}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">o</span>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {isLogin 
                    ? '¿No tienes cuenta? Regístrate gratis' 
                    : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
