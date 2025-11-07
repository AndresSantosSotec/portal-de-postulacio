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
} from '@phosphor-icons/react'
import { categoryLabels, type JobCategory } from '@/lib/types'

type CategoryFilterProps = {
  selectedCategory: string
  onSelectCategory: (category: string) => void
  jobCounts: Record<string, number>
}

const categoryIcons: Record<JobCategory | 'all', any> = {
  'all': GridFour,
  'desarrollo-software': Code,
  'diseno': PaintBrush,
  'marketing': ChartLineUp,
  'ventas': ShoppingCart,
  'atencion-cliente': Headset,
  'recursos-humanos': Users,
  'contabilidad': Calculator,
  'administracion': Briefcase,
  'ingenieria': Wrench,
  'educacion': GraduationCap,
  'salud': FirstAid,
  'construccion': HardHat,
  'otros': GridFour,
}

export default function CategoryFilter({ selectedCategory, onSelectCategory, jobCounts }: CategoryFilterProps) {
  const categories = [
    { key: 'all', label: 'Todas', count: Object.values(jobCounts).reduce((a, b) => a + b, 0) - (jobCounts['all'] || 0) },
    ...Object.entries(categoryLabels).map(([key, label]) => ({
      key,
      label,
      count: jobCounts[key] || 0,
    })),
  ]

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <GridFour size={20} weight="duotone" className="text-primary" />
        Categorías
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {categories.map(({ key, label, count }) => {
          const Icon = categoryIcons[key as JobCategory | 'all']
          const isSelected = selectedCategory === key
          
          return (
            <motion.button
              key={key}
              onClick={() => onSelectCategory(key)}
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
                {label}
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
