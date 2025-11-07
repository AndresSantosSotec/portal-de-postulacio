import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CheckCircle, 
  UserCircle,
  X,
  CircleW
import {
import type { U

  id: string
  type: '
  me
  jobId?
  CircleWavyCheck
} from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import type { User, Application, Job } from '@/lib/types'
import { statusLabels } from '@/lib/types'

export type Notification = {
  id: string
  userId: string
  type: 'status_change' | 'interview' | 'message' | 'system'
  title: string
  message: string
  applicationId?: string
  jobId?: string
  read: boolean



        n.id === notifId ? { ...
    )

    setNotification
 


    setNotifications(current 
    )

    setNotifications(curr
 

    markAsRead(notif.id)
      onViewJob(notif.jobId)
  }
  if (compact) {
      <div className="s
 

          userNotifications.slice(0, 5).map((notif, index) => {
            const colorClass = notificationColors[notif.type]
            return (
                key={notif.id}

                className={`p-3 rounded-lg border
              >
                  <div className={`h-10 w-10 rounded-
                  </div>

  const unreadCount = notifications?.filter(n => n.userId === user.id && !n.read).length || 0

  const markAsRead = (notifId: string) => {
    setNotifications(current => 
      (current || []).map(n => 
        n.id === notifId ? { ...n, read: true } : n
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(current =>
      (current || []).map(n =>
        n.userId === user.id ? { ...n, read: true } : n
      )
    )
  }

  const deleteNotification = (notifId: string) => {
    setNotifications(current => 
      (current || []).filter(n => n.id !== notifId)
    )
  }

  const clearAll = () => {
    setNotifications(current =>
      (current || []).filter(n => n.userId !== user.id)
    )
  }

  const handleNotificationClick = (notif: Notification) => {
    markAsRead(notif.id)
    if (notif.jobId && onViewJob) {
      onViewJob(notif.jobId)
    }
  }

  if (compact) {
    return (
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {userNotifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No tienes notificaciones
          </div>
        ) : (
          userNotifications.slice(0, 5).map((notif, index) => {
            const Icon = notificationIcons[notif.type]
            const colorClass = notificationColors[notif.type]
            
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-accent/5 ${!notif.read ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex gap-3">
                  <div className={`h-10 w-10 rounded-full bg-background flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon size={20} weight="duotone" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-sm line-clamp-1">{notif.title}</p>
                  key={notif.id}
                  animate={{ opacity: 1, y: 0 }}
                  transi
                >
                    className={`transition-all duration-300 hover:shadow-md border-l-4 ${!notif.r
                    <CardContent className="pt-6">
                        <div className={`h-12 w-12 rounded-full bg-background border-2 flex items-center 
                        
                        
                      
                           
             
            
          
            
     
   

          
                              s
                              onClick={(e) => {
                    
                            >
                 
                          
                            <p className="text-xs t
                            </
                            {!notif.r
                                <Separator orientation="vert
                                  varian
                          
                  
                          
                            )}
                            {notif.jobId && onViewJob && (
                  
                  
                
                     
                     
                            )}
                   
                    </CardContent>
                </motio
            })}
        </div>
    </div>
}


















































































                  key={notif.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.03 }}
                  layout
                >
                  <Card 
                    className={`transition-all duration-300 hover:shadow-md border-l-4 ${!notif.read ? 'bg-primary/5 border-l-primary' : 'border-l-transparent'}`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className={`h-12 w-12 rounded-full bg-background border-2 flex items-center justify-center shrink-0 ${colorClass}`}>
                          <Icon size={24} weight="duotone" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-base">{notif.title}</h4>
                                {!notif.read && (
                                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {notif.message}
                              </p>
                              {job && (
                                <div className="mt-2 p-2 rounded-md bg-muted/50 inline-block">
                                  <p className="text-xs font-medium">{job.title}</p>
                                  <p className="text-xs text-muted-foreground">{job.company}</p>
                                </div>
                              )}
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 shrink-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notif.id)
                              }}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-3 mt-3">
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notif.createdDate), { addSuffix: true, locale: es })}
                            </p>
                            
                            {!notif.read && (
                              <>
                                <Separator orientation="vertical" className="h-3" />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs"
                                  onClick={() => markAsRead(notif.id)}
                                >
                                  Marcar como leída
                                </Button>
                              </>
                            )}
                            
                            {notif.jobId && onViewJob && (
                              <>
                                <Separator orientation="vertical" className="h-3" />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs text-primary hover:text-primary"
                                  onClick={() => handleNotificationClick(notif)}
                                >
                                  Ver empleo
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
