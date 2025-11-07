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
      <div className="h-48 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-t-2xl" />
      
      <div className="px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/80 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              {onEditAvatar && (
                <button
                  onClick={onEditAvatar}
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera size={24} weight="bold" className="text-white" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">{user.name}</h1>
                {user.profile?.bio && (
                  <p className="text-lg text-muted-foreground max-w-2xl line-clamp-2">
                    {user.profile.bio}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {user.email && (
                  <div className="flex items-center gap-2">
                    <EnvelopeSimple size={18} weight="duotone" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.profile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={18} weight="duotone" />
                    <span>{user.profile.phone}</span>
                  </div>
                )}
                {user.profile?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} weight="duotone" />
                    <span>{user.profile.location}</span>
                  </div>
                )}
              </div>

              {user.profile?.skills && user.profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {user.profile.skills.slice(0, 5).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {user.profile.skills.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{user.profile.skills.length - 5} más
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="gap-2">
              <Briefcase size={20} weight="duotone" />
              <span className="hidden sm:inline">Descargar CV</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
