import { useState, useMemo, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MagnifyingGlass, Funnel, CaretLeft, CaretRight } from '@phosphor-icons/react'
import JobCard from './JobCard'
import { SkeletonJobCard } from '@/components/ui/skeleton-card'
import type { Job, JobCategory } from '@/lib/types'
import { categoryLabels } from '@/lib/types'

const JOBS_PER_PAGE = 9

type JobListingsProps = {
  onViewJob: (jobId: string) => void
  currentUser: any
  onFavoriteToggle?: () => void
}

export default function JobListings({ onViewJob, currentUser, onFavoriteToggle }: JobListingsProps) {
  const [jobs] = useKV<Job[]>('jobs', [])
  const [favorites, setFavorites] = useKV<string[]>('favorites', [])
  const [applications] = useKV<any[]>('applications', [])
  const [isLoading, setIsLoading] = useState(true)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

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

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
  
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE
    const endIndex = startIndex + JOBS_PER_PAGE
    return filteredJobs.slice(startIndex, endIndex)
  }, [filteredJobs, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedLocation])

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
      <div className="bg-gradient-to-r from-primary via-[#003875] to-primary text-primary-foreground py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Encuentra tu próximo empleo
          </h1>
          <p className="text-primary-foreground/90 mb-6">
            Conectando talento con las mejores oportunidades
          </p>
          
          <div className="bg-card rounded-xl p-4 shadow-xl">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {isLoading ? 'Cargando empleos...' : `${filteredJobs.length} ${filteredJobs.length === 1 ? 'empleo disponible' : 'empleos disponibles'}`}
          </h2>
          
          {!isLoading && (searchTerm || selectedCategory !== 'all' || selectedLocation !== 'all') && (
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonJobCard key={i} />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedJobs.map(job => (
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

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <CaretLeft size={16} weight="bold" />
                  Anterior
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-10"
                        >
                          {page}
                        </Button>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Siguiente
                  <CaretRight size={16} weight="bold" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
