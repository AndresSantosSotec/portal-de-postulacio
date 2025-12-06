import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Play, Image as ImageIcon, X, Users, BuildingOffice, Coffee, Laptop, Spinner, Briefcase, GraduationCap, Heart } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { publicGalleryService, type GalleryPost, type Category } from '@/lib/publicGalleryService'
import { getStorageUrl } from '@/lib/api'
import { toast } from 'sonner'

// Helper para obtener el icono de categoría
const getCategoryIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    'building-office': BuildingOffice,
    'users': Users,
    'coffee': Coffee,
    'laptop': Laptop,
    'briefcase': Briefcase,
    'graduation-cap': GraduationCap,
    'heart': Heart,
  }
  return icons[iconName] || BuildingOffice
}

// Helper para formatear duración de video
const formatDuration = (seconds?: number): string => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

type MediaItem = {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  title: string
  description?: string
  category: string
  categoryId: number
  duration?: number
}

export default function WorkplaceGallery() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [imageError, setImageError] = useState<Record<string, boolean>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [posts, setPosts] = useState<GalleryPost[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar categorías y posts al montar el componente
  useEffect(() => {
    loadGalleryData()
  }, [])

  const loadGalleryData = async () => {
    try {
      setLoading(true)
      const [categoriesData, postsData] = await Promise.all([
        publicGalleryService.getCategories(),
        publicGalleryService.getPosts({ per_page: 100 })
      ])
      
      setCategories(categoriesData)
      setPosts(postsData?.data || [])
    } catch (error: any) {
      console.error('Error al cargar galería:', error)
      toast.error('Error al cargar la galería')
    } finally {
      setLoading(false)
    }
  }

  // Convertir posts de API a MediaItems
  const mediaItems: MediaItem[] = posts.map(post => ({
    id: post.id.toString(),
    type: post.media_type || 'image',
    url: getStorageUrl(
      post.media_type === 'video' ? post.video_url : post.image_url
    ) || '',
    thumbnail: getStorageUrl(
      post.media_type === 'video' ? post.video_thumbnail_url : post.thumbnail_url
    ) || undefined,
    title: post.title,
    description: post.description,
    category: post.category?.slug || '',
    categoryId: post.category_id,
    duration: post.video_duration
  }))

  const filteredMedia = selectedCategory
    ? mediaItems.filter(item => item.categoryId === selectedCategory)
    : mediaItems

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-muted/50 via-muted/30 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block mb-4"
          >
            <Badge variant="secondary" className="text-sm px-4 py-1.5 gap-2">
              <Users size={16} weight="duotone" />
              Nuestro Ambiente
            </Badge>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Conoce Nuestro Ambiente Laboral
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubre cómo es trabajar en <span className="font-semibold text-foreground">COOSANJER MICOOPE</span>. 
            Espacios modernos, equipo talentoso y una cultura organizacional enfocada en el crecimiento profesional.
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 mt-8 text-center"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BuildingOffice size={28} weight="duotone" className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-2xl text-foreground">Modernos</p>
                <p className="text-sm text-muted-foreground">Espacios de trabajo</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Users size={28} weight="duotone" className="text-secondary" />
              </div>
              <div>
                <p className="font-bold text-2xl text-foreground">Talentoso</p>
                <p className="text-sm text-muted-foreground">Equipo profesional</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Laptop size={28} weight="duotone" className="text-accent-foreground" />
              </div>
              <div>
                <p className="font-bold text-2xl text-foreground">Innovadora</p>
                <p className="text-sm text-muted-foreground">Cultura organizacional</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Spinner size={48} weight="bold" className="text-primary" />
              </motion.div>
              <p className="mt-4 text-muted-foreground">Cargando galería...</p>
            </div>
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon size={64} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay contenido disponible</h3>
            <p className="text-muted-foreground">Aún no se han publicado fotos o videos.</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedCategory(null)}
                  className="font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Todas ({mediaItems.length})
                </Button>
              </motion.div>
              {categories.map(category => {
                const count = mediaItems.filter(item => item.categoryId === category.id).length
                const Icon = category.icon ? getCategoryIcon(category.icon) : BuildingOffice
                return (
                  <motion.div key={category.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="lg"
                      onClick={() => setSelectedCategory(category.id)}
                      className="gap-2 font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      <Icon size={18} weight="duotone" />
                      {category.name} ({count})
                    </Button>
                  </motion.div>
                )
              })}
            </motion.div>

            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredMedia.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-2 hover:border-primary/20"
                  onClick={() => setSelectedMedia(item)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {!imageError[item.id] && item.url ? (
                        <>
                          {item.type === 'video' ? (
                            <video
                              src={item.url}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              preload="metadata"
                              onError={() => setImageError(prev => ({ ...prev, [item.id]: true }))}
                            />
                          ) : (
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={() => setImageError(prev => ({ ...prev, [item.id]: true }))}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                          {item.type === 'video' && (
                            <>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div 
                                  className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-xl"
                                  whileHover={{ scale: 1.15 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <Play size={28} weight="fill" className="text-primary-foreground ml-1" />
                                </motion.div>
                              </div>
                              {item.duration && (
                                <Badge
                                  variant="default"
                                  className="absolute bottom-3 left-3 gap-1 backdrop-blur-md bg-black/70 text-white border-0"
                                >
                                  {formatDuration(item.duration)}
                                </Badge>
                              )}
                            </>
                          )}
                          <Badge
                            variant="secondary"
                            className="absolute top-3 right-3 gap-1 backdrop-blur-md bg-background/80"
                          >
                            {item.type === 'image' ? (
                              <><ImageIcon size={14} weight="duotone" /> Foto</>
                            ) : (
                              <><Play size={14} weight="fill" /> Video</>
                            )}
                          </Badge>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon size={48} weight="duotone" />
                        </div>
                      )}
                    </div>
                    <div className="p-5 bg-gradient-to-b from-card to-card/50">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
          </>
        )}
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-5xl p-0 max-h-[90vh] overflow-y-auto">
          {selectedMedia && (
            <>
              <DialogHeader className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl">{selectedMedia.title}</DialogTitle>
                  <Badge variant={selectedMedia.type === 'video' ? 'default' : 'secondary'} className="gap-1">
                    {selectedMedia.type === 'image' ? (
                      <><ImageIcon size={14} weight="duotone" /> Foto</>
                    ) : (
                      <><Play size={14} weight="fill" /> Video {selectedMedia.duration && `• ${formatDuration(selectedMedia.duration)}`}</>
                    )}
                  </Badge>
                </div>
              </DialogHeader>
              <div className="relative aspect-video bg-muted">
                {selectedMedia.type === 'image' ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4='
                    }}
                  />
                ) : (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="w-full h-full bg-black"
                    autoPlay
                    preload="metadata"
                  >
                    Tu navegador no soporta la reproducción de video.
                  </video>
                )}
              </div>
              {selectedMedia.description && (
                <div className="p-6 pt-4">
                  <p className="text-muted-foreground leading-relaxed">{selectedMedia.description}</p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
