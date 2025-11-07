import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MagnifyingGlass, Funnel } from '@phosphor-icons/react'
import JobCard from './JobCard'
import type { Job, JobCategory } from '@/lib/types'
import { categoryLabels } from '@/lib/types'

type JobListingsProps = {
  onViewJob: (jobId: string) => void
  currentUser: any
  onFavoriteToggle?: () => void
}

export default function JobListings({ onViewJob, currentUser, onFavoriteToggle }: JobListingsProps) {
  const [jobs] = useKV<Job[]>('jobs', [])
  const [favorites, setFavorites] = useKV<string[]>('favorites', [])
  const [applications] = useKV<any[]>('applications', [])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')

  const jobList = jobs || []
  const favoritesList = favorites || []
  const applicationsList = applications || []

  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(jobList.map(job => job.location))]
    return uniqueLocations.sort()
  }, [jobList])

  const filteredJobs = useMemo(() => {
    return jobList.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory
      const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation
      
      return matchesSearch && matchesCategory && matchesLocation
    })
  }, [jobList, searchTerm, selectedCategory, selectedLocation])

  const handleToggleFavorite = (jobId: string) => {
    setFavorites(currentFavorites => {
      const favs = currentFavorites || []
      if (favs.includes(jobId)) {
        return favs.filter(id => id !== jobId)
      } else {
        return [...favs, jobId]
      }
    })
    onFavoriteToggle?.()
  }

  const appliedJobIds = applicationsList.map(app => app.jobId)

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Encuentra tu próximo empleo
          </h1>
          
          <div className="bg-card rounded-lg p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <MagnifyingGlass 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  placeholder="Buscar por cargo, empresa o palabra clave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-64 h-11">
                  <Funnel size={16} className="mr-2" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-56 h-11">
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ubicaciones</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'empleo disponible' : 'empleos disponibles'}
          </h2>
          
          {(searchTerm || selectedCategory !== 'all' || selectedLocation !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedLocation('all')
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              No se encontraron empleos
            </h3>
            <p className="text-muted-foreground">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                isFavorite={favoritesList.includes(job.id)}
                onToggleFavorite={handleToggleFavorite}
                onViewJob={onViewJob}
                isApplied={appliedJobIds.includes(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
