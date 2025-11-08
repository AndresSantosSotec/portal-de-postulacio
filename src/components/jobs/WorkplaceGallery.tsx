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
  },
  {
    id: 'img7',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=1200&h=800&fit=crop',
    title: 'Espacios Creativos',
    description: 'Ambientes diseñados para fomentar la creatividad',
    category: 'office'
  },
  {
    id: 'img8',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop',
    title: 'Reuniones Productivas',
    description: 'Salas de juntas equipadas con tecnología moderna',
    category: 'office'
  },
  {
    id: 'img9',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=800&fit=crop',
    title: 'Liderazgo Inspirador',
    description: 'Líderes comprometidos con el desarrollo del equipo',
    category: 'team'
  },
  {
    id: 'img10',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
    title: 'Trabajo en Equipo',
    description: 'Colaboración constante para alcanzar objetivos',
    category: 'team'
  },
  {
    id: 'img11',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&h=800&fit=crop',
    title: 'Celebraciones',
    description: 'Celebramos cada logro del equipo',
    category: 'events'
  },
  {
    id: 'img12',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop',
    title: 'Workshops y Talleres',
    description: 'Aprendizaje continuo a través de talleres especializados',
    category: 'events'
  },
  {
    id: 'img13',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800&fit=crop',
    title: 'Balance Vida-Trabajo',
    description: 'Promovemos un balance saludable para nuestro equipo',
    category: 'culture'
  },
  {
    id: 'img14',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=800&fit=crop',
    title: 'Innovación Constante',
    description: 'Fomentamos la innovación en cada proyecto',
    category: 'culture'
  },
  {
    id: 'img15',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=800&fit=crop',
    title: 'Espacios Compartidos',
    description: 'Áreas comunes que promueven la interacción',
    category: 'culture'
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
              Todas ({sampleMedia.length})
            </Button>
          </motion.div>
          {categories.map(category => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons]
            const count = sampleMedia.filter(item => item.category === category).length
            return (
              <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedCategory(category)}
                  className="gap-2 font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <Icon size={18} weight="duotone" />
                  {categoryLabels[category as keyof typeof categoryLabels]} ({count})
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
                      {!imageError[item.id] ? (
                        <>
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={() => setImageError(prev => ({ ...prev, [item.id]: true }))}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                          {item.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div 
                                className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center"
                                whileHover={{ scale: 1.15 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Play size={28} weight="fill" className="text-primary-foreground ml-1" />
                              </motion.div>
                            </div>
                          )}
                          <Badge
                            variant="secondary"
                            className="absolute top-3 right-3 gap-1 backdrop-blur-md bg-background/80"
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
