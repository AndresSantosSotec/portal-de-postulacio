import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MagnifyingGlass, Funnel, CaretLeft, CaretRight, CheckCircle, XCircle } from '@phosphor-icons/react'
import JobCard from './JobCard'
import CategoryFilter from './CategoryFilter'
import WorkplaceGallery from './WorkplaceGallery'
import { SkeletonJobCard } from '@/components/ui/skeleton-card'
import { publicJobService, type Job, type JobCategory } from '@/lib/publicJobService'
import { applicationService } from '@/lib/applicationService'
import { toast } from 'sonner'

const JOBS_PER_PAGE = 9

type JobListingsProps = {
  onViewJob: (jobId: string) => void
  currentUser: any
  onFavoriteToggle?: () => void
}

export default function JobListings({ onViewJob, currentUser, onFavoriteToggle }: JobListingsProps) {
  // Estados para datos de API
  const [jobs, setJobs] = useState<Job[]>([])
  const [categories, setCategories] = useState<JobCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [employmentType, setEmploymentType] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Estados para favoritos y postulaciones
  const [favoriteJobIds, setFavoriteJobIds] = useState<number[]>([])
  const [applications, setApplications] = useState<any[]>([])

  // Cargar datos al montar
  useEffect(() => {
    loadJobsData()
  }, [])

  useEffect(() => {
    if (currentUser) {
      loadFavorites()
    } else {
      setFavoriteJobIds([])
    }
  }, [currentUser])

  const loadJobsData = async () => {
    try {
      setIsLoading(true)
      const [categoriesData, offersData] = await Promise.all([
        publicJobService.getCategories(),
        publicJobService.getOffers({ per_page: 100 })
      ])
      
      setCategories(categoriesData)
      setJobs(offersData.offers || [])
    } catch (error: any) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar ofertas laborales')
    } finally {
      setIsLoading(false)
    }
  }

  const loadFavorites = async () => {
    try {
      const favorites = await applicationService.getFavorites()
      setFavoriteJobIds(favorites.map(fav => fav.oferta_id))
    } catch (error) {
      console.error('Error al cargar favoritos:', error)
    }
  }

  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(jobs.map(job => job.location).filter(Boolean))]
    return uniqueLocations.sort()
  }, [jobs])

  const jobCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    jobs.forEach(job => {
      counts[job.category] = (counts[job.category] || 0) + 1
    })
    return counts
  }, [jobs])

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements?.join(' ')?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === null || job.category === selectedCategory
      const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation
      const matchesType = employmentType === 'all' || job.type === employmentType
      const isNotOccupied = !job.isOccupied
      
      return matchesSearch && matchesCategory && matchesLocation && matchesType && isNotOccupied
    })
  }, [jobs, searchTerm, selectedCategory, selectedLocation, employmentType])

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
  
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE
    const endIndex = startIndex + JOBS_PER_PAGE
    return filteredJobs.slice(startIndex, endIndex)
  }, [filteredJobs, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedLocation, employmentType])

  const handleToggleFavorite = async (jobId: string) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para guardar favoritos', {
        description: 'Regístrate o inicia sesión para continuar'
      })
      return
    }

    const jobIdNum = parseInt(jobId)
    const isFavorite = favoriteJobIds.includes(jobIdNum)

    try {
      if (isFavorite) {
        await applicationService.removeFavorite(jobIdNum)
        setFavoriteJobIds(prev => prev.filter(id => id !== jobIdNum))
        toast.success('Eliminado de favoritos')
      } else {
        await applicationService.addFavorite(jobIdNum)
        setFavoriteJobIds(prev => [...prev, jobIdNum])
        toast.success('Agregado a favoritos')
      }
      onFavoriteToggle?.()
    } catch (error: any) {
      console.error('Error al actualizar favorito:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al actualizar favoritos')
      }
    }
  }

  const appliedJobIds = applications.map(app => app.jobId)

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="bg-gradient-to-r from-primary via-[#003875] to-primary text-primary-foreground py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            Encuentra tu próximo empleo
          </h1>
          <p className="text-primary-foreground/90 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base">
            Conectando talento con las mejores oportunidades
          </p>
          
          <div className="bg-card rounded-xl p-2 sm:p-3 md:p-4 shadow-xl">
            <div className="flex flex-col gap-2">
              <div className="relative flex-1">
                <MagnifyingGlass 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  placeholder="Buscar empleo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 sm:h-10 md:h-11 text-sm"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Select 
                  value={selectedCategory || 'all'} 
                  onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}
                >
                  <SelectTrigger className="w-full h-9 sm:h-10 text-sm">
                    <Funnel size={14} className="mr-2" />
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
                </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full sm:w-auto md:w-56 h-10 sm:h-11">
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
      </div>

      <WorkplaceGallery />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            jobCounts={jobCounts}
            totalJobs={jobs.length}
          />
        </motion.div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 mt-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {isLoading ? 'Cargando empleos...' : `${filteredJobs.length} ${filteredJobs.length === 1 ? 'empleo disponible' : 'empleos disponibles'}`}
            </h2>
          </div>
          
          {!isLoading && (searchTerm || selectedCategory !== null || selectedLocation !== 'all' || employmentType !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory(null)
                setSelectedLocation('all')
                setEmploymentType('all')
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
                  isFavorite={favoriteJobIds.includes(parseInt(job.id))}
                  onToggleFavorite={() => handleToggleFavorite(job.id)}
                  onViewJob={() => onViewJob(job.id)}
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
    </div>
  )
}
