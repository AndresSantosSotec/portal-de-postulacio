import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EnvelopeSimple, ArrowLeft, CheckCircle, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { authService } from '@/lib/authService'

type ForgotPasswordModalProps = {
  isOpen: boolean
  onClose: () => void
  onBackToLogin: () => void
}

export default function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Por favor ingresa tu correo electrónico')
      return
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Por favor ingresa un correo electrónico válido')
      return
    }

    setIsLoading(true)

    try {
      const response = await authService.forgotPassword(email)
      
      console.log('📧 [ForgotPassword] Respuesta:', response)
      
      setIsSuccess(true)
      toast.success('Solicitud enviada correctamente')
      
      // Si estamos en modo debug, mostrar el token
      if (response.debug) {
        console.log('🔑 [ForgotPassword] Token de debug:', response.debug?.token)
        console.log('🔗 [ForgotPassword] URL de reset:', response.debug?.reset_url)
      }
    } catch (error: any) {
      console.error('❌ [ForgotPassword] Error:', error)
      toast.error(error.message || 'Error al enviar la solicitud')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setIsSuccess(false)
    onClose()
  }

  const handleBackToLogin = () => {
    setEmail('')
    setIsSuccess(false)
    onBackToLogin()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] max-w-[95vw] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
          
          <div className="relative p-4 sm:p-6 md:p-8">
            {!isSuccess ? (
              <>
                <DialogHeader className="space-y-2 sm:space-y-3">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20"
                  >
                    <EnvelopeSimple size={24} weight="bold" className="text-white sm:hidden" />
                    <EnvelopeSimple size={32} weight="bold" className="text-white hidden sm:block" />
                  </motion.div>
                  
                  <DialogTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                    ¿Olvidaste tu contraseña?
                  </DialogTitle>
                  
                  <DialogDescription className="text-center text-sm sm:text-base px-2">
                    No te preocupes, te enviaremos una contraseña temporal a tu correo
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 mt-4 sm:mt-6 md:mt-8">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary transition-all"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ingresa el correo asociado a tu cuenta
                    </p>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 sm:p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800"
                  >
                    <div className="flex items-start gap-3">
                      <Warning size={20} weight="fill" className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        <p className="font-medium">Importante:</p>
                        <p className="text-xs mt-1 opacity-80">
                          Si no recibes el correo, revisa tu carpeta de spam o correo no deseado.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20 transition-all"
                    size="lg"
                  >
                    {isLoading ? 'Enviando...' : 'Enviar contraseña temporal'}
                  </Button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <DialogHeader className="space-y-2 sm:space-y-3">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20"
                  >
                    <CheckCircle size={32} weight="bold" className="text-white sm:hidden" />
                    <CheckCircle size={40} weight="bold" className="text-white hidden sm:block" />
                  </motion.div>
                  
                  <DialogTitle className="text-2xl sm:text-3xl font-bold text-center text-green-600 dark:text-green-400">
                    ¡Contraseña Enviada!
                  </DialogTitle>
                  
                  <DialogDescription className="text-center text-sm sm:text-base px-2">
                    Hemos enviado una contraseña temporal a
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-foreground">{email}</p>
                </div>
                
                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <p>Revisa tu bandeja de entrada y usa la <span className="font-semibold text-foreground">contraseña temporal</span> para iniciar sesión.</p>
                  <p>Si no recibes el correo, revisa tu carpeta de spam.</p>
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    🔐 <span className="font-medium">Recomendación:</span> Una vez que inicies sesión, 
                    te sugerimos cambiar la contraseña por una personalizada.
                  </p>
                </div>
              </motion.div>
            )}
            
            <div className="mt-4 sm:mt-6 text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft size={16} weight="bold" />
                Volver a iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
