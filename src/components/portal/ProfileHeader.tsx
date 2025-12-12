import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Camera, MapPin, Phone, EnvelopeSimple, Briefcase } from '@phosphor-icons/react'
import type { User } from '@/lib/types'

type ProfileHeaderProps = {
  user: User
  onEditAvatar?: () => void
}

export default function ProfileHeader({ user, onEditAvatar }: ProfileHeaderProps) {
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <div className="h-28 sm:h-36 md:h-48 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-t-xl sm:rounded-t-2xl" />
      
      <div className="px-3 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 md:gap-6 -mt-10 sm:-mt-12 md:-mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4 md:gap-6">
            <div className="relative group">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 border-2 sm:border-3 md:border-4 border-background shadow-lg sm:shadow-xl">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-br from-primary to-primary/80 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              {onEditAvatar && (
                <button
                  onClick={onEditAvatar}
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera size={16} weight="bold" className="text-white sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2 min-w-0 flex-1">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-0.5 sm:mb-1 truncate">{user.name}</h1>
                {user.profile?.bio && (
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl line-clamp-2">
                    {user.profile.bio}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-muted-foreground">
                {user.email && (
                  <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                    <EnvelopeSimple size={14} weight="duotone" className="flex-shrink-0 sm:w-4 sm:h-4" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{user.email}</span>
                  </div>
                )}
                {user.profile?.phone && (
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Phone size={14} weight="duotone" className="flex-shrink-0 sm:w-4 sm:h-4" />
                    <span className="truncate">{user.profile.phone}</span>
                  </div>
                )}
                {user.profile?.location && (
                  <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                    <MapPin size={14} weight="duotone" className="flex-shrink-0 sm:w-4 sm:h-4" />
                    <span className="truncate max-w-[120px] sm:max-w-none">{user.profile.location}</span>
                  </div>
                )}
              </div>

              {user.profile?.skills && user.profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1.5 sm:pt-2">
                  {user.profile.skills.slice(0, 5).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                      {skill}
                    </Badge>
                  ))}
                  {user.profile.skills.length > 5 && (
                    <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                      +{user.profile.skills.length - 5}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-2.5 sm:px-3 md:px-4">
              <Briefcase size={20} weight="duotone" />
              <span className="hidden sm:inline">Descargar CV</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
