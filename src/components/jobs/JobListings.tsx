import { useState, useMemo } from 'react'
import { MagnifyingGlass, Funnel, MapPin, Briefcase, Clock } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import type { Job } from '@/lib/types'
import { formatShortDate } from '@/lib/helpers'

interface JobListingsProps {
  onViewJob: (jobId: string) => void
}

export default function JobListings({ onViewJob }: JobListingsProps) {
  const [jobs] = useKV<Job[]>('jobs', [])
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [areaFilter, setAreaFilter] = useState<string>('all')
  const [contractFilter, setContractFilter] = useState<string>('all')
  const [experienceFilter, setExperienceFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  const locations = useMemo(() => {
    const uniqueLocations = [...new Set((jobs || []).map(job => job.location))]
    return uniqueLocations.sort()
  }, [jobs])

  const areas = useMemo(() => {
    const uniqueAreas = [...new Set((jobs || []).map(job => job.area))]
    return uniqueAreas.sort()
  }, [jobs])

  const filteredJobs = useMemo(() => {
    return (jobs || []).filter(job => {
      if (!job.isActive) return false
      
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesLocation = locationFilter === 'all' || job.location === locationFilter
      const matchesArea = areaFilter === 'all' || job.area === areaFilter
      const matchesContract = contractFilter === 'all' || job.contractType === contractFilter
      const matchesExperience = experienceFilter === 'all' || job.experienceLevel === experienceFilter
      
      return matchesSearch && matchesLocation && matchesArea && matchesContract && matchesExperience
    })
  }, [jobs, searchTerm, locationFilter, areaFilter, contractFilter, experienceFilter])

  const contractTypeLabels: Record<string, string> = {
    'full-time': 'Tiempo Completo',
    'part-time': 'Medio Tiempo',
    'contract': 'Contrato',
    'internship': 'Pasantía',
  }

  const experienceLevelLabels: Record<string, string> = {
    'entry': 'Principiante',
    'mid': 'Intermedio',
    'senior': 'Senior',
    'lead': 'Líder',
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Encuentra tu próxima oportunidad
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Explora ofertas laborales y construye tu futuro profesional
          </p>
          
          <div className="flex gap-4 max-w-2xl">
            <div className="flex-1 relative">
              <MagnifyingGlass 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                size={20} 
              />
              <Input
                id="search-jobs"
                placeholder="Buscar por título o palabra clave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background text-foreground border-none h-12"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6 flex items-center gap-2"
            >
              <Funnel size={20} />
              Filtros
            </Button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-card border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ubicación</label>
                <select
                  id="location-filter"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">Todas</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Área</label>
                <select
                  id="area-filter"
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">Todas</option>
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Contrato</label>
                <select
                  id="contract-filter"
                  value={contractFilter}
                  onChange={(e) => setContractFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">Todos</option>
                  <option value="full-time">Tiempo Completo</option>
                  <option value="part-time">Medio Tiempo</option>
                  <option value="contract">Contrato</option>
                  <option value="internship">Pasantía</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Nivel de Experiencia</label>
                <select
                  id="experience-filter"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">Todos</option>
                  <option value="entry">Principiante</option>
                  <option value="mid">Intermedio</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Líder</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
          </p>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No se encontraron ofertas</h3>
            <p className="text-muted-foreground">
              Intenta ajustar los filtros o busca con otros términos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20"
                onClick={() => onViewJob(job.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold line-clamp-2 flex-1">
                    {job.title}
                  </h3>
                  <Badge className="ml-2 bg-accent text-accent-foreground">
                    Activa
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase size={16} />
                    {contractTypeLabels[job.contractType]} • {experienceLevelLabels[job.experienceLevel]}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={16} />
                    Publicado {formatShortDate(job.postedDate)}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {job.description}
                </p>
                
                <div className="pt-4 border-t">
                  <Badge variant="secondary">{job.area}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
