import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Camera, Upload, X } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { applicationService } from '@/lib/applicationService'

type ProfilePhotoUploadProps = {
  currentPhotoUrl?: string
  userName: string
  onPhotoUpdate: (photoDataUrl: string) => void
}

export default function ProfilePhotoUpload({
  currentPhotoUrl,
  userName,
  onPhotoUpdate,
}: ProfilePhotoUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleFileSelect = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar 2 MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen (JPG, PNG, WEBP)')
      return
    }

    // Guardar el archivo para subirlo después
    setSelectedFile(file)

    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleSave = async () => {
    if (!selectedFile) {
      toast.error('No has seleccionado ninguna foto')
      return
    }

    setUploading(true)
    try {
      // Subir foto al backend
      const result = await applicationService.uploadProfilePhoto(selectedFile)
      
      // Actualizar el componente padre con la URL de la foto
      onPhotoUpdate(result.avatar_url)
      
      toast.success('Foto de perfil actualizada exitosamente')
      setIsOpen(false)
      setPreviewUrl(null)
      setSelectedFile(null)
    } catch (error: any) {
      console.error('Error al subir foto:', error)
      toast.error(error.message || 'Error al subir la foto de perfil')
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setPreviewUrl(null)
    setSelectedFile(null)
  }

  return (
    <>
      <div className="relative group">
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          <AvatarImage src={currentPhotoUrl} alt={userName} />
          <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <Camera size={16} weight="bold" />
        </motion.button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar foto de perfil</DialogTitle>
            <DialogDescription>
              Sube una foto en formato JPG o PNG (máx. 3 MB)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {previewUrl ? (
              <div className="relative">
                <div className="flex justify-center">
                  <Avatar className="h-48 w-48 border-4 border-border">
                    <AvatarImage src={previewUrl} alt="Preview" />
                  </Avatar>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setPreviewUrl(null)}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-colors duration-200
                  ${isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }
                `}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  Haz clic o arrastra una imagen aquí
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG o WEBP, máximo 2 MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={uploading}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!previewUrl || uploading}
              className="bg-secondary hover:bg-secondary/90"
            >
              {uploading ? 'Subiendo...' : 'Guardar foto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
