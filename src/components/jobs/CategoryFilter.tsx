import { motion } from 'framer-motion'
import {
  Code,
  PaintBrush,
  ChartLineUp,
  ShoppingCart,
  Headset,
  Users,
  Calculator,
  Briefcase,
  Wrench,
  GraduationCap,
  FirstAid,
  HardHat,
  GridFour,
  Bank,
  ChartBar,
  Cardholder,
  Buildings,
  Truck,
  Factory,
} from '@phosphor-icons/react'
import type { JobCategory } from '@/lib/publicJobService'

type CategoryFilterProps = {
  categories: JobCategory[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  jobCounts: Record<string, number>
  totalJobs: number
}

// Mapeo de iconos por nombre
const iconMap: Record<string, any> = {
  'code': Code,
  'paint-brush': PaintBrush,
  'chart-line-up': ChartLineUp,
  'shopping-cart': ShoppingCart,
  'headset': Headset,
  'users': Users,
  'calculator': Calculator,
  'briefcase': Briefcase,
  'wrench': Wrench,
  'graduation-cap': GraduationCap,
  'first-aid': FirstAid,
  'hard-hat': HardHat,
  'grid-four': GridFour,
  'bank': Bank,
  'chart-bar': ChartBar,
  'cardholder': Cardholder,
  'buildings': Buildings,
  'truck': Truck,
  'factory': Factory,
}

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || GridFour
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  jobCounts,
  totalJobs 
}: CategoryFilterProps) {

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <GridFour size={20} weight="duotone" className="text-primary" />
        Categorías
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Categoría "Todas" */}
        <motion.button
          onClick={() => onSelectCategory(null)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`
            relative flex flex-col items-center justify-center p-4 rounded-lg
            border-2 transition-all duration-200
            ${selectedCategory === null
              ? 'border-primary bg-primary/5 shadow-md' 
              : 'border-border bg-background hover:border-primary/40 hover:bg-muted/50'
            }
          `}
        >
          <motion.div
            animate={selectedCategory === null ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <GridFour 
              size={28} 
              weight="duotone" 
              className={selectedCategory === null ? 'text-primary' : 'text-muted-foreground'}
            />
          </motion.div>
          <span className={`text-xs font-medium mt-2 text-center line-clamp-2 ${selectedCategory === null ? 'text-primary' : 'text-foreground'}`}>
            Todas
          </span>
          {totalJobs > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`
                absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center
                rounded-full text-[10px] font-bold
                ${selectedCategory === null
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}
            >
              {totalJobs}
            </motion.span>
          )}
        </motion.button>

        {/* Categorías dinámicas */}
        {categories.map((category) => {
          const Icon = getIconComponent(category.icon)
          const count = jobCounts[category.name] || 0
          const isSelected = selectedCategory === category.name
          
          return (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.name)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`
                relative flex flex-col items-center justify-center p-4 rounded-lg
                border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-border bg-background hover:border-primary/40 hover:bg-muted/50'
                }
              `}
            >
              <motion.div
                animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Icon 
                  size={28} 
                  weight="duotone" 
                  className={isSelected ? 'text-primary' : 'text-muted-foreground'}
                />
              </motion.div>
              <span className={`text-xs font-medium mt-2 text-center line-clamp-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                {category.name}
              </span>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                    absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center
                    rounded-full text-[10px] font-bold
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  {count}
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
