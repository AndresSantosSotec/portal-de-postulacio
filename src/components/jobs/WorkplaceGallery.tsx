import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Play, Image as ImageIcon, X, Users, BuildingOffice, Coffee, Laptop } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

type MediaItem = {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  title: string
  description?: string
  category: 'office' | 'team' | 'events' | 'culture'
}

const sampleMedia: MediaItem[] = [
  {
    id: 'img1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
    title: 'Oficinas Modernas',
    description: 'Espacios de trabajo colaborativo diseñados para la innovación',
    category: 'office'
  },
  {
    id: 'img2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop',
    title: 'Nuestro Equipo',
    description: 'Un equipo diverso trabajando juntos hacia el éxito',
    category: 'team'
  },
  {
    id: 'img3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop',
    title: 'Eventos y Capacitaciones',
    description: 'Desarrollo profesional continuo para nuestro equipo',
    category: 'events'
  },
  {
    id: 'img4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=800&fit=crop',
    title: 'Áreas de Descanso',
    description: 'Espacios para relajarse y conectar con compañeros',
    category: 'culture'
  },
  {
    id: 'img5',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=800&fit=crop',
    title: 'Colaboración Activa',
    description: 'Trabajo en equipo es parte de nuestra cultura',
    category: 'team'
  },
  {
    id: 'img6',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop',
    title: 'Tecnología de Punta',
    description: 'Herramientas modernas para el trabajo del futuro',
    category: 'office'
  }
]

const categoryIcons = {
  office: BuildingOffice,
  team: Users,
  events: Coffee,
  culture: Laptop
}

const categoryLabels = {
  office: 'Oficinas',
  team: 'Equipo',
  events: 'Eventos',
  culture: 'Cultura'
}

export default function WorkplaceGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  const filteredMedia = selectedCategory
    ? sampleMedia.filter(item => item.category === selectedCategory)
    : sampleMedia

  const categories = Array.from(new Set(sampleMedia.map(item => item.category)))

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Conoce Nuestro Ambiente Laboral</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre cómo es trabajar en CoosajerJobs. Espacios modernos, equipo talentoso y una cultura organizacional enfocada en el crecimiento profesional.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todas
          </Button>
          {categories.map(category => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons]
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="gap-2"
              >
                <Icon size={16} weight="duotone" />
                {categoryLabels[category as keyof typeof categoryLabels]}
              </Button>
            )
          })}
        </div>

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
                  className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
                  onClick={() => setSelectedMedia(item)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {!imageError[item.id] ? (
                        <>
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={() => setImageError(prev => ({ ...prev, [item.id]: true }))}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {item.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play size={28} weight="fill" className="text-primary-foreground ml-1" />
                              </div>
                            </div>
                          )}
                          <Badge
                            variant="secondary"
                            className="absolute top-3 right-3 gap-1"
                          >
                            {item.type === 'image' ? (
                              <ImageIcon size={14} weight="duotone" />
                            ) : (
                              <Play size={14} weight="fill" />
                            )}
                            {item.type === 'image' ? 'Foto' : 'Video'}
                          </Badge>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon size={48} weight="duotone" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-base mb-1 line-clamp-1">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
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
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl p-0">
          {selectedMedia && (
            <>
              <DialogHeader className="p-6 pb-0">
                <DialogTitle>{selectedMedia.title}</DialogTitle>
              </DialogHeader>
              <div className="relative aspect-video bg-muted">
                {selectedMedia.type === 'image' ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="w-full h-full"
                    autoPlay
                  />
                )}
              </div>
              {selectedMedia.description && (
                <div className="p-6 pt-4">
                  <p className="text-muted-foreground">{selectedMedia.description}</p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
