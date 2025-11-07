import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ChatCircleDots, PaperPlaneRight, Robot, X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Application, ApplicationStatus } from '@/lib/types'

type ChatMessage = {
  id: string
  type: 'bot' | 'user'
  content: string
  timestamp: Date
}

type ChatbotProps = {
  applications?: Application[]
  userName?: string
}

const statusMessages: Record<ApplicationStatus, string> = {
  'postulado': '¡Hemos recibido tu postulación exitosamente! Nuestro equipo de recursos humanos revisará tu CV en los próximos días. Te mantendremos informado sobre cualquier avance.',
  'cv-visto': '¡Buenas noticias! Tu CV ha sido revisado por nuestro equipo. Has pasado el primer filtro de selección. Estaremos evaluando tu perfil para los siguientes pasos.',
  'en-proceso': '¡Felicitaciones! Has avanzado en el proceso de selección. Pronto nos pondremos en contacto contigo para coordinar los siguientes pasos. Mantente atento a tu correo electrónico.',
  'finalista': '¡Excelente! Has sido seleccionado como finalista para esta posición. Esto significa que estás entre los mejores candidatos. Pronto recibirás información sobre la entrevista final.',
  'proceso-finalizado': 'El proceso de selección para esta posición ha finalizado. Agradecemos tu interés y participación. Tu perfil quedará en nuestro banco de talento para futuras oportunidades.'
}

const psychometricMessages = {
  sent: '📋 Se te han enviado las pruebas psicométricas a tu correo electrónico. Por favor, complétalas lo antes posible. El enlace es válido por 7 días.',
  completed: '✅ ¡Perfecto! Has completado las pruebas psicométricas exitosamente. Nuestro equipo evaluará los resultados y te notificaremos sobre los siguientes pasos.'
}

const welcomeMessages = [
  '¡Hola! Soy el asistente virtual de CoosajerJobs. Estoy aquí para mantenerte informado sobre el progreso de tus postulaciones.',
  '¿Tienes alguna pregunta sobre el proceso de selección? Puedo ayudarte con información sobre:',
  '• Estado de tus postulaciones',
  '• Tiempos estimados del proceso',
  '• Qué esperar en cada etapa',
  '• Información sobre pruebas psicométricas'
]

const faqResponses: Record<string, string> = {
  'tiempo': 'El proceso de selección generalmente toma entre 2 a 4 semanas, dependiendo de la posición. Te notificaremos en cada etapa del proceso.',
  'entrevista': 'Si avanzas al proceso de entrevista, te contactaremos por correo electrónico o teléfono para coordinar fecha y hora. Las entrevistas pueden ser presenciales o virtuales.',
  'pruebas': 'Las pruebas psicométricas evalúan competencias profesionales y aptitudes. Son completamente en línea y toman aproximadamente 45 minutos. Recibirás un enlace por correo cuando sea necesario.',
  'resultados': 'Te notificaremos sobre los resultados en cada etapa del proceso. Puedes revisar el estado actualizado de tus postulaciones en tu portal de usuario.',
  'banco': 'Si tu perfil no es seleccionado para una posición específica, permanecerá en nuestro banco de talento por 1 año. Te consideraremos para futuras vacantes que coincidan con tu perfil.'
}

export default function Chatbot({ applications = [], userName }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [hasNewNotification, setHasNewNotification] = useState(false)

  useEffect(() => {
    if (messages.length === 0) {
      const initialMessages: ChatMessage[] = welcomeMessages.map((content, index) => ({
        id: `welcome-${index}`,
        type: 'bot' as const,
        content,
        timestamp: new Date(Date.now() - (welcomeMessages.length - index) * 1000)
      }))
      setMessages(initialMessages)
    }
  }, [])

  useEffect(() => {
    applications.forEach(app => {
      const lastMessageForApp = messages.find(m => 
        m.content.includes(statusMessages[app.status]) || 
        m.id.includes(app.id)
      )

      if (!lastMessageForApp) {
        const statusMessage: ChatMessage = {
          id: `status-${app.id}-${app.status}`,
          type: 'bot',
          content: statusMessages[app.status],
          timestamp: new Date(app.updatedDate)
        }

        setMessages(prev => [...prev, statusMessage])
        setHasNewNotification(true)
      }

      if (app.psychometricTestSent && !app.psychometricTestCompleted) {
        const psychTestMessage = messages.find(m => 
          m.id === `psych-sent-${app.id}`
        )
        if (!psychTestMessage) {
          const newMessage: ChatMessage = {
            id: `psych-sent-${app.id}`,
            type: 'bot',
            content: psychometricMessages.sent,
            timestamp: new Date(app.psychometricTestSentDate || app.updatedDate)
          }
          setMessages(prev => [...prev, newMessage])
          setHasNewNotification(true)
        }
      }

      if (app.psychometricTestCompleted) {
        const psychCompletedMessage = messages.find(m => 
          m.id === `psych-completed-${app.id}`
        )
        if (!psychCompletedMessage) {
          const newMessage: ChatMessage = {
            id: `psych-completed-${app.id}`,
            type: 'bot',
            content: psychometricMessages.completed,
            timestamp: new Date(app.psychometricTestCompletedDate || app.updatedDate)
          }
          setMessages(prev => [...prev, newMessage])
          setHasNewNotification(true)
        }
      }
    })
  }, [applications])

  const handleQuickQuestion = (keyword: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: keyword === 'tiempo' ? '¿Cuánto tarda el proceso?' :
               keyword === 'entrevista' ? '¿Cómo funciona la entrevista?' :
               keyword === 'pruebas' ? '¿Qué son las pruebas psicométricas?' :
               keyword === 'resultados' ? '¿Cuándo sabré los resultados?' :
               '¿Qué es el banco de talento?',
      timestamp: new Date()
    }

    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: faqResponses[keyword],
      timestamp: new Date(Date.now() + 500)
    }

    setMessages(prev => [...prev, userMessage, botMessage])
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Ahora'
    if (minutes < 60) return `Hace ${minutes}m`
    if (hours < 24) return `Hace ${hours}h`
    return `Hace ${days}d`
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setHasNewNotification(false)
    }
  }

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleChat}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg relative"
        >
          {isOpen ? (
            <X size={24} weight="bold" />
          ) : (
            <>
              <ChatCircleDots size={28} weight="duotone" />
              {hasNewNotification && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full"
                />
              )}
            </>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl">
              <CardHeader className="bg-primary text-primary-foreground pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Robot size={24} weight="duotone" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Asistente Virtual</CardTitle>
                    <p className="text-xs opacity-90">Siempre disponible para ayudarte</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    En línea
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-96 p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "flex gap-2",
                          message.type === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.type === 'bot' && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Robot size={18} weight="duotone" className="text-primary" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                            message.type === 'bot' 
                              ? "bg-muted text-foreground" 
                              : "bg-primary text-primary-foreground"
                          )}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className={cn(
                            "text-xs mt-1",
                            message.type === 'bot' ? "text-muted-foreground" : "opacity-70"
                          )}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-3">Preguntas frecuentes:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(faqResponses).map(keyword => (
                      <Button
                        key={keyword}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleQuickQuestion(keyword)}
                      >
                        {keyword === 'tiempo' && '⏱️ Tiempos'}
                        {keyword === 'entrevista' && '🎤 Entrevista'}
                        {keyword === 'pruebas' && '📋 Pruebas'}
                        {keyword === 'resultados' && '📊 Resultados'}
                        {keyword === 'banco' && '💼 Banco de talento'}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
