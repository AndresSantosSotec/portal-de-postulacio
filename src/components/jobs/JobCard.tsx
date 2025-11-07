import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Briefcase, Heart } from '@phosphor-icons/react'
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
  const daysAgo = Math.floor(
    (Date.now() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer relative"
      onClick={() => onViewJob(job.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors leading-tight">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              {job.company}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 w-9 p-0 rounded-full shrink-0",
              isFavorite && "text-destructive hover:text-destructive"
            )}
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(job.id)
            }}
          >
            <Heart 
              size={20} 
              weight={isFavorite ? "fill" : "regular"}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin size={16} weight="duotone" />
            <span>{job.location}</span>
          </div>
          <span className="text-border">•</span>
          <div className="flex items-center gap-1">
            <Briefcase size={16} weight="duotone" />
            <span className="capitalize">{job.type.replace('-', ' ')}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="font-medium">
            {categoryLabels[job.category as JobCategory]}
          </Badge>
          {job.salary && (
            <Badge variant="outline" className="font-medium">
              {job.salary}
            </Badge>
          )}
          {isApplied && (
            <Badge variant="default" className="bg-accent text-accent-foreground">
              Postulado
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {daysAgo === 0 ? 'Hoy' : daysAgo === 1 ? 'Ayer' : `Hace ${daysAgo} días`}
          </p>
          <p className="text-xs text-muted-foreground">
            +{job.applicants} candidatos
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
