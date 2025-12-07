import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LockKey, Eye, EyeSlash, CheckCircle, XCircle, ShieldCheck } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { authService } from '@/lib/authService'

export default function ChangePasswordSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Validar criterios de contraseña
  const passwordCriteria = {
    minLength: formData.newPassword.length >= 6,
    hasUppercase: /[A-Z]/.test(formData.newPassword),
    hasLowercase: /[a-z]/.test(formData.newPassword),
    hasNumber: /[0-9]/.test(formData.newPassword),
    matches: formData.newPassword === formData.confirmPassword && formData.confirmPassword !== ''
  }

  const isFormValid = 
    formData.currentPassword.length > 0 &&
    passwordCriteria.minLength && 
    passwordCriteria.matches

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    setIsLoading(true)

    try {
      await authService.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      )
      
      toast.success('¡Contraseña actualizada exitosamente!')
      
      // Limpiar formulario y colapsar
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setIsExpanded(false)
      
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error)
      toast.error(error.message || 'Error al cambiar la contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  const CriteriaItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <CheckCircle size={14} weight="fill" className="text-green-500 flex-shrink-0" />
      ) : (
        <XCircle size={14} weight="fill" className="text-gray-300 flex-shrink-0" />
      )}
      <span className={met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
        {text}
      </span>
    </div>
  )

  return (
    <Card className="border-amber-200 dark:border-amber-800/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <ShieldCheck size={24} weight="duotone" className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Seguridad de la Cuenta</CardTitle>
              <CardDescription>Gestiona tu contraseña de acceso</CardDescription>
            </div>
          </div>
          <Button
            variant={isExpanded ? "secondary" : "outline"}
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Cancelar' : 'Cambiar Contraseña'}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contraseña Actual */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium">
                  Contraseña Actual
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <LockKey size={18} weight="duotone" />
                  </div>
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña actual"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrentPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Nueva Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  Nueva Contraseña
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <LockKey size={18} weight="duotone" />
                  </div>
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu nueva contraseña"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar Nueva Contraseña
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <LockKey size={18} weight="duotone" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirma tu nueva contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Criterios de contraseña */}
              {formData.newPassword.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-1.5"
                >
                  <p className="text-xs font-medium text-foreground mb-2">Requisitos de contraseña:</p>
                  <CriteriaItem met={passwordCriteria.minLength} text="Mínimo 6 caracteres" />
                  <CriteriaItem met={passwordCriteria.hasUppercase} text="Al menos una mayúscula (recomendado)" />
                  <CriteriaItem met={passwordCriteria.hasLowercase} text="Al menos una minúscula" />
                  <CriteriaItem met={passwordCriteria.hasNumber} text="Al menos un número (recomendado)" />
                  <CriteriaItem met={passwordCriteria.matches} text="Las contraseñas coinciden" />
                </motion.div>
              )}

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                    setIsExpanded(false)
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                >
                  {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
              </div>
            </form>
          </motion.div>
        </CardContent>
      )}
    </Card>
  )
}
