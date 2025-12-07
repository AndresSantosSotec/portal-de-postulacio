import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LockKey, Eye, EyeSlash, CheckCircle, XCircle, ArrowLeft, SpinnerGap } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { authService } from '@/lib/authService'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: ''
  })

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  // Validar criterios de contraseña
  const passwordCriteria = {
    minLength: formData.password.length >= 6,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    matches: formData.password === formData.password_confirmation && formData.password_confirmation !== ''
  }

  const isPasswordValid = passwordCriteria.minLength && passwordCriteria.matches

  // Verificar token al cargar la página
  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setIsVerifying(false)
        setIsTokenValid(false)
        return
      }

      try {
        const response = await authService.verifyResetToken(email, token)
        setIsTokenValid(response.valid)
      } catch (error) {
        console.error('Error verificando token:', error)
        setIsTokenValid(false)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isPasswordValid) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    if (!token || !email) {
      toast.error('Token o email inválido')
      return
    }

    setIsLoading(true)

    try {
      await authService.resetPassword(email, token, formData.password, formData.password_confirmation)
      setIsSuccess(true)
      toast.success('¡Contraseña actualizada exitosamente!')
    } catch (error: any) {
      console.error('Error al resetear contraseña:', error)
      toast.error(error.message || 'Error al actualizar la contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  const CriteriaItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <CheckCircle size={16} weight="fill" className="text-green-500" />
      ) : (
        <XCircle size={16} weight="fill" className="text-gray-300" />
      )}
      <span className={met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
        {text}
      </span>
    </div>
  )

  // Estado de carga inicial
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <SpinnerGap size={48} className="animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Verificando enlace...</h2>
          <p className="text-muted-foreground mt-2">Por favor espera un momento</p>
        </motion.div>
      </div>
    )
  }

  // Token inválido o expirado
  if (!isTokenValid && !isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-50 dark:to-red-950/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle size={48} weight="fill" className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Enlace inválido o expirado</h2>
          <p className="text-muted-foreground mt-3 mb-6">
            Este enlace de recuperación no es válido o ha expirado. 
            Los enlaces expiran después de 60 minutos por seguridad.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="w-full"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver al inicio
          </Button>
        </motion.div>
      </div>
    )
  }

  // Éxito al cambiar contraseña
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50 dark:to-green-950/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
          >
            <CheckCircle size={48} weight="fill" className="text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">¡Contraseña actualizada!</h2>
          <p className="text-muted-foreground mt-3 mb-6">
            Tu contraseña ha sido cambiada exitosamente. 
            Ya puedes iniciar sesión con tu nueva contraseña.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Ir a iniciar sesión
          </Button>
        </motion.div>
      </div>
    )
  }

  // Formulario de nueva contraseña
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <LockKey size={32} weight="bold" className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Nueva contraseña</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Crea una nueva contraseña para tu cuenta
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold">Nueva Contraseña</Label>
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

          <div className="space-y-2">
            <Label htmlFor="password_confirmation" className="text-sm font-semibold">Confirmar Contraseña</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <LockKey size={20} weight="duotone" />
              </div>
              <Input
                id="password_confirmation"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={(e) => setFormData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                required
                className="pl-11 pr-11 h-12 bg-background/50 border-border/50 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Criterios de contraseña */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-2">
            <p className="text-sm font-medium text-foreground mb-3">La contraseña debe:</p>
            <CriteriaItem met={passwordCriteria.minLength} text="Tener al menos 6 caracteres" />
            <CriteriaItem met={passwordCriteria.hasUppercase} text="Contener una mayúscula (recomendado)" />
            <CriteriaItem met={passwordCriteria.hasNumber} text="Contener un número (recomendado)" />
            <CriteriaItem met={passwordCriteria.matches} text="Las contraseñas deben coincidir" />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || !isPasswordValid}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
            size="lg"
          >
            {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={16} weight="bold" />
            Volver al inicio
          </button>
        </div>
      </motion.div>
    </div>
  )
}
