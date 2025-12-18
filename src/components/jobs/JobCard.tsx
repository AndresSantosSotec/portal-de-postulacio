import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Briefcase, Heart, Image as ImageIcon, Buildings } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { Job, JobCategory } from '@/lib/types'
import { categoryLabels } from '@/lib/types'

type JobCardProps = {
  job: Job
  isFavorite: boolean
  onToggleFavorite: (jobId: string) => void
  onViewJob: (jobId: string) => void
  isApplied?: boolean
}

export default function JobCard({ 
  job, 
  isFavorite, 
  onToggleFavorite, 
  onViewJob,
  isApplied 
}: JobCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const daysAgo = Math.floor(
    (Date.now() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="group hover:shadow-xl transition-all duration-200 cursor-pointer relative overflow-hidden h-full flex flex-col"
        onClick={() => onViewJob(job.id)}
      >
        {job.imageUrl && (
          <div className="relative w-full h-40 sm:h-48 bg-muted overflow-hidden">
            {!imageLoaded && !imageError && (
              <Skeleton className="absolute inset-0" />
            )}
            {imageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
                <ImageIcon size={48} weight="duotone" className="mb-2" />
                <span className="text-sm">Imagen no disponible</span>
              </div>
            ) : (
              <img
                src={job.imageUrl}
                alt={job.title}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={cn(
                  "w-full h-full object-cover transition-all duration-300",
                  imageLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
                )}
              />
            )}
          </div>
        )}
        
        <CardHeader className="pb-2 sm:pb-3 px-4 pt-3 sm:pt-6">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                {job.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1 truncate">
                {job.company}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full shrink-0 transition-all",
                isFavorite && "text-destructive hover:text-destructive"
              )}
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(job.id)
              }}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={isFavorite ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  size={20} 
                  weight={isFavorite ? "fill" : "regular"}
                />
              </motion.div>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 flex-1 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin size={16} weight="duotone" />
              <span>{job.location}</span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1">
              <Briefcase size={16} weight="duotone" />
              <span className="capitalize">{job.type?.replace('-', ' ') || 'No especificado'}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Badge de oferta interna - solo visible para colaboradores */}
            {job.isInternal && (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium">
                <Buildings size={14} weight="fill" className="mr-1" />
                Interna
              </Badge>
            )}
            <Badge variant="secondary" className="font-medium">
              {categoryLabels[job.category as JobCategory]}
            </Badge>
            {job.salary && (
              <Badge variant="outline" className="font-medium border-secondary/50 text-secondary">
                {job.salary}
              </Badge>
            )}
            {job.isOccupied && (
              <Badge variant="destructive" className="font-medium">
                Plaza Ocupada
              </Badge>
            )}
            {isApplied && (
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Postulado
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
            <p className="text-xs text-muted-foreground">
              {daysAgo === 0 ? 'Hoy' : daysAgo === 1 ? 'Ayer' : `Hace ${daysAgo} días`}
            </p>
            <p className="text-xs text-muted-foreground">
              {job.applicants} candidatos
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
