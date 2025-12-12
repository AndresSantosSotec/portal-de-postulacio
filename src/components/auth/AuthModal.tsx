import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { EnvelopeSimple, LockKey, User as UserIcon, Eye, EyeSlash, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { authService } from '@/lib/authService'
import type { User } from '@/lib/types'
import ForgotPasswordModal from './ForgotPasswordModal'

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: User) => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // console.log('🔐 [Portal Login] Iniciando autenticación...')
    // console.log('📧 Email:', formData.email)
    // console.log('🔑 Password length:', formData.password.length)
    // console.log('🎯 Modo:', isLogin ? 'Login' : 'Registro')
    
    if (!formData.email || !formData.password) {
      toast.error('Por favor completa todos los campos')
      return
    }

    if (!isLogin && !formData.name) {
      toast.error('Por favor ingresa tu nombre')
      return
    }

    setIsLoading(true)

    try {
      if (isLogin) {
        // console.log('🔄 [Portal Login] Enviando petición de login...')
        const response = await authService.login({
          email: formData.email,
          password: formData.password,
          user_type: 'candidate'
        })
        
        // console.log('✅ [Portal Login] Respuesta recibida:', response)
        // console.log('👤 Usuario:', response.user)
        // console.log('🎫 Token guardado:', !!localStorage.getItem('auth_token'))
        
        if (!response.user) {
          throw new Error('No se recibió información del usuario')
        }
        
        const user: User = {
          id: response.user.id.toString(),
          email: response.user.email,
          password: '',
          name: response.user.name,
          profile: {
            experience: [],
            education: [],
            skills: []
          }
        }
        
        toast.success(`¡Bienvenido, ${response.user.name}!`)
        // console.log('🎉 [Portal Login] Login exitoso')
        onSuccess(user)
        onClose()
      } else {
        // console.log('🔄 [Portal Login] Enviando petición de registro...')
        const response = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password,
          user_type: 'candidate'
        })
        
        // console.log('✅ [Portal Login] Registro exitoso:', response)
        // console.log('📦 Respuesta completa:', JSON.stringify(response, null, 2))
        
        // El backend devuelve los datos en response.data.user
        const userData = response.user || (response as any).data?.user
        
        // console.log('👤 Usuario extraído:', userData)
        
        if (!userData) {
          console.error('❌ No se encontró usuario en la respuesta')
          throw new Error('No se recibió información del usuario')
        }
        
        const user: User = {
          id: userData.id.toString(),
          email: userData.email,
          password: '',
          name: userData.name,
          profile: {
            experience: [],
            education: [],
            skills: []
          }
        }
        
        toast.success(`¡Bienvenido, ${userData.name}! Tu cuenta ha sido creada exitosamente`)
        // console.log('🎉 [Portal Login] Registro exitoso, iniciando sesión automáticamente')
        onSuccess(user)
        onClose()
      }
    } catch (error: any) {
      console.error('❌ [Portal Login] Error:', error)
      console.error('📄 Error completo:', error.response?.data)
      
      const errorMessage = error.message || 'Error de autenticación'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] max-w-[92vw] max-h-[92vh] sm:max-h-[88vh] overflow-y-auto p-0">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
          
          <div className="relative p-3 sm:p-5 md:p-6">
            <DialogHeader className="space-y-1.5 sm:space-y-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mx-auto w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md sm:shadow-lg shadow-primary/20"
              >
                <UserIcon size={20} weight="bold" className="text-white sm:hidden" />
                <UserIcon size={28} weight="bold" className="text-white hidden sm:block" />
              </motion.div>
              
              <DialogTitle className="text-lg sm:text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text leading-tight">
                {isLogin ? 'Bienvenido' : 'Crea tu cuenta'}
              </DialogTitle>
              
              <DialogDescription className="text-center text-xs sm:text-sm px-1 sm:px-2 leading-snug">
                {isLogin 
                  ? 'Accede a tu cuenta' 
                  : 'Empieza tu búsqueda hoy'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3 md:space-y-4 mt-3 sm:mt-4 md:mt-6">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor="name" className="text-xs sm:text-sm font-semibold">Nombre Completo</Label>
                    <div className="relative">
                      <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <UserIcon size={16} weight="duotone" className="sm:w-5 sm:h-5" />
                      </div>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Juan Pérez"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required={!isLogin}
                        className="pl-9 sm:pl-11 h-9 sm:h-10 md:h-11 text-sm bg-background/50 border-border/50 focus:border-primary transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs sm:text-sm font-semibold">Correo Electrónico</Label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <EnvelopeSimple size={16} weight="duotone" className="sm:w-5 sm:h-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="pl-9 sm:pl-11 h-9 sm:h-10 md:h-11 text-sm bg-background/50 border-border/50 focus:border-primary transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs sm:text-sm font-semibold">Contraseña</Label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <LockKey size={16} weight="duotone" className="sm:w-5 sm:h-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="pl-9 sm:pl-11 pr-9 sm:pr-11 h-9 sm:h-10 md:h-11 text-sm bg-background/50 border-border/50 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeSlash size={16} className="sm:w-5 sm:h-5" /> : <Eye size={16} className="sm:w-5 sm:h-5" />}
                  </button>
                </div>
                {isLogin && (
                  <div className="flex justify-end pt-0.5">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[10px] sm:text-xs text-primary hover:text-primary/80 transition-colors hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}
              </div>
              
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1.5 sm:space-y-2 p-2.5 sm:p-3 rounded-lg bg-accent/5 border border-accent/20"
                >
                  <p className="text-[10px] sm:text-xs font-medium text-accent-foreground/80">Tu cuenta incluye:</p>
                  <div className="space-y-1 sm:space-y-1.5">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                      <CheckCircle size={12} weight="fill" className="text-secondary sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                      <span>Perfil profesional completo</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <CheckCircle size={14} weight="fill" className="text-secondary sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Seguimiento de postulaciones</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <CheckCircle size={14} weight="fill" className="text-secondary sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Alertas personalizadas</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md sm:shadow-lg shadow-primary/20 transition-all"
                size="lg"
              >
                {isLoading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
              </Button>
            </form>
            
            <div className="mt-3 sm:mt-4 md:mt-5">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">o</span>
                </div>
              </div>
              
              <div className="text-center mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setFormData({ email: '', password: '', name: '' })
                  }}
                  className="text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
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

      {/* Modal de recuperar contraseña */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    </Dialog>
  )
}
