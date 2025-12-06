import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ChatCircleDots, Robot, X, ArrowsClockwise, CaretLeft, House } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { notificationService, type Notification } from '@/lib/notificationService'

type ChatMessage = {
  id: string
  type: 'bot' | 'user'
  content: string
  timestamp: Date
  notificationId?: number
}

type ChatbotProps = {
  userName?: string
}

type FAQCategory = 'main' | 'proceso' | 'portal' | 'cuenta' | 'vacantes' | 'contacto'

const welcomeMessages = [
  '¡Hola! 👋 Soy el asistente virtual de CoosanjerJobs.',
  'Estoy aquí para ayudarte con cualquier duda sobre la plataforma y mantenerte informado sobre tus postulaciones.',
  'Selecciona una categoría abajo para ver las preguntas frecuentes o espera las actualizaciones automáticas.'
]

// Categorías principales de FAQ
const faqCategories: Record<string, { icon: string; label: string; description: string }> = {
  'proceso': { icon: '📋', label: 'Proceso de selección', description: 'Tiempos, etapas y resultados' },
  'portal': { icon: '🖥️', label: 'Uso del portal', description: 'Cómo usar la plataforma' },
  'cuenta': { icon: '👤', label: 'Mi cuenta', description: 'Perfil, CV y configuración' },
  'vacantes': { icon: '💼', label: 'Vacantes', description: 'Búsqueda y postulación' },
  'contacto': { icon: '📞', label: 'Contacto y soporte', description: 'Ayuda adicional' }
}

// Respuestas organizadas por categoría
const faqResponses: Record<string, Record<string, { question: string; answer: string }>> = {
  'proceso': {
    'tiempo': {
      question: '¿Cuánto tarda el proceso de selección?',
      answer: '⏱️ Tiempos del proceso\n\nEl proceso de selección generalmente toma entre 2 a 4 semanas, dependiendo de:\n\n• La posición y nivel del cargo\n• La cantidad de candidatos\n• Los requisitos específicos\n\nTe notificaremos en cada etapa para que siempre estés informado.'
    },
    'etapas': {
      question: '¿Cuáles son las etapas del proceso?',
      answer: '📊 Etapas del proceso de selección\n\n1️⃣ Postulado - Recibimos tu aplicación\n2️⃣ CV Visto - Revisamos tu perfil\n3️⃣ En Proceso - Evaluación activa\n4️⃣ Finalista - Entre los mejores candidatos\n5️⃣ Contratado - ¡Bienvenido al equipo!\n\nCada cambio de etapa te será notificado por correo y en este chat.'
    },
    'entrevista': {
      question: '¿Cómo funcionan las entrevistas?',
      answer: '🎤 Sobre las entrevistas\n\nSi avanzas al proceso de entrevista:\n\n• Te contactaremos por correo o teléfono\n• Coordinaremos fecha y hora según tu disponibilidad\n• Pueden ser presenciales o virtuales\n\n💡 Tip: Prepara ejemplos de tus logros y experiencia. ¡Tú puedes!'
    },
    'pruebas': {
      question: '¿Qué son las pruebas psicométricas?',
      answer: '📝 Pruebas psicométricas\n\nSon evaluaciones que miden:\n• Competencias profesionales\n• Aptitudes y habilidades\n• Personalidad laboral\n\n⏰ Duración: ~45 minutos\n🌐 100% en línea\n📧 Recibirás el enlace por correo\n\n¡No hay respuestas correctas o incorrectas, sé tú mismo!'
    },
    'resultados': {
      question: '¿Cuándo sabré los resultados?',
      answer: '📊 Resultados del proceso\n\nTe notificaremos en cada etapa a través de:\n\n• 🔔 Este chat (actualizaciones automáticas)\n• 📧 Correo electrónico\n• 📱 Panel de notificaciones\n\nPuedes revisar el estado en "Mis Postulaciones" en cualquier momento.'
    },
    'banco': {
      question: '¿Qué es el banco de talento?',
      answer: '💼 Banco de talento\n\nSi no eres seleccionado para una posición:\n\n✅ Tu perfil permanece activo por 1 año\n✅ Te consideramos para futuras vacantes\n✅ Puedes actualizar tu información cuando quieras\n\n¡No te desanimes! Cada proceso es una oportunidad de aprendizaje.'
    }
  },
  'portal': {
    'navegacion': {
      question: '¿Cómo navego en el portal?',
      answer: '🧭 Navegación del portal\n\nDesde el menú principal puedes acceder a:\n\n• 🏠 Inicio - Ver todas las vacantes\n• 👤 Mi Perfil - Datos personales y CV\n• 📋 Mis Postulaciones - Estado de aplicaciones\n• ⭐ Favoritos - Vacantes guardadas\n• 🔔 Notificaciones - Alertas y mensajes\n\n¡Explora todas las secciones!'
    },
    'postular': {
      question: '¿Cómo me postulo a una vacante?',
      answer: '✨ Cómo postularte\n\n1️⃣ Busca la vacante que te interese\n2️⃣ Haz clic en "Ver detalles"\n3️⃣ Lee los requisitos cuidadosamente\n4️⃣ Presiona "Postularme"\n5️⃣ Confirma tu aplicación\n\n💡 Tip: Asegúrate de tener tu CV actualizado antes de postularte.'
    },
    'favoritos': {
      question: '¿Para qué sirven los favoritos?',
      answer: '⭐ Vacantes favoritas\n\nPuedes guardar vacantes que te interesen para:\n\n• Revisarlas después con calma\n• Compararlas antes de postularte\n• No perderlas de vista\n\nHaz clic en el ⭐ de cualquier vacante para guardarla.'
    },
    'alertas': {
      question: '¿Cómo funcionan las alertas de empleo?',
      answer: '🔔 Alertas de empleo\n\nConfigura alertas para recibir notificaciones cuando:\n\n• Se publiquen vacantes en tu área\n• Haya empleos en tu ubicación preferida\n• Aparezcan ofertas con tu salario deseado\n\nVe a "Alertas" en tu perfil para configurarlas.'
    },
    'notificaciones': {
      question: '¿Dónde veo mis notificaciones?',
      answer: '📬 Notificaciones\n\nEncuentra tus notificaciones en:\n\n• 🔔 Icono de campana (menú superior)\n• 💬 Este chat (actualizaciones de estado)\n• 📧 Tu correo electrónico\n\nLas notificaciones incluyen:\n- Cambios en tus postulaciones\n- Mensajes del equipo de RRHH\n- Alertas de nuevas vacantes'
    }
  },
  'cuenta': {
    'perfil': {
      question: '¿Cómo actualizo mi perfil?',
      answer: '👤 Actualizar perfil\n\nPara editar tu información:\n\n1️⃣ Ve a "Mi Perfil"\n2️⃣ Selecciona la sección a editar:\n   • Datos personales\n   • Experiencia laboral\n   • Formación académica\n   • Habilidades\n3️⃣ Guarda los cambios\n\n💡 Un perfil completo tiene más visibilidad.'
    },
    'cv': {
      question: '¿Cómo subo o actualizo mi CV?',
      answer: '📄 Gestión del CV\n\nPara subir o actualizar tu CV:\n\n1️⃣ Ve a "Mi Perfil" > "Currículum"\n2️⃣ Haz clic en "Subir CV"\n3️⃣ Selecciona tu archivo (PDF recomendado)\n4️⃣ Espera la confirmación\n\n📏 Tamaño máximo: 5MB\n📋 Formatos: PDF, DOC, DOCX'
    },
    'foto': {
      question: '¿Cómo cambio mi foto de perfil?',
      answer: '📸 Foto de perfil\n\nPara cambiar tu foto:\n\n1️⃣ Ve a "Mi Perfil"\n2️⃣ Haz clic en tu foto actual\n3️⃣ Selecciona una nueva imagen\n4️⃣ Ajusta el recorte si es necesario\n\n💡 Tips:\n• Usa una foto profesional\n• Fondo neutro\n• Buena iluminación'
    },
    'contrasena': {
      question: '¿Cómo cambio mi contraseña?',
      answer: '🔐 Cambiar contraseña\n\nPara mayor seguridad, puedes cambiar tu contraseña:\n\n1️⃣ Ve a "Mi Perfil" > "Configuración"\n2️⃣ Selecciona "Cambiar contraseña"\n3️⃣ Ingresa tu contraseña actual\n4️⃣ Escribe la nueva contraseña\n5️⃣ Confirma el cambio\n\n💡 Usa una contraseña fuerte con letras, números y símbolos.'
    },
    'eliminar': {
      question: '¿Puedo eliminar mi cuenta?',
      answer: '🗑️ Eliminar cuenta\n\nSi deseas eliminar tu cuenta:\n\n⚠️ Esta acción es permanente\n⚠️ Se borrarán todos tus datos\n⚠️ Perderás el historial de postulaciones\n\nPara proceder, contacta a soporte técnico desde la sección "Contacto".\n\n¿Seguro que quieres irte? 😢'
    }
  },
  'vacantes': {
    'buscar': {
      question: '¿Cómo busco vacantes?',
      answer: '🔍 Búsqueda de vacantes\n\nEncuentra tu empleo ideal:\n\n• 🔎 Usa la barra de búsqueda\n• 🏷️ Filtra por categoría\n• 📍 Filtra por ubicación\n• 💰 Filtra por salario\n• ⏰ Filtra por tipo de empleo\n\n💡 Combina filtros para resultados más precisos.'
    },
    'requisitos': {
      question: '¿Qué requisitos necesito?',
      answer: '📋 Requisitos para postular\n\nCada vacante tiene sus propios requisitos:\n\n• 📚 Formación académica\n• 💼 Experiencia laboral\n• 🛠️ Habilidades técnicas\n• 🌐 Idiomas\n• 📍 Disponibilidad\n\nLee bien la descripción antes de postularte para asegurar que cumples con el perfil.'
    },
    'multiples': {
      question: '¿Puedo postularme a varias vacantes?',
      answer: '✅ Múltiples postulaciones\n\n¡Sí! Puedes postularte a todas las vacantes que desees.\n\n💡 Recomendaciones:\n• Elige vacantes acordes a tu perfil\n• No te postules a TODAS, sé selectivo\n• Personaliza tu aplicación si es posible\n• Mantén tu CV actualizado\n\nCalidad sobre cantidad 😉'
    },
    'tipos': {
      question: '¿Qué tipos de empleo hay?',
      answer: '📊 Tipos de empleo disponibles\n\n• ⏰ Tiempo completo\n• 🕐 Medio tiempo\n• 📝 Por proyecto\n• 🏠 Remoto\n• 🔄 Híbrido\n• 📅 Temporal\n• 🎓 Prácticas profesionales\n\nFiltra por tipo de empleo en la búsqueda.'
    },
    'salario': {
      question: '¿Cómo veo el salario de las vacantes?',
      answer: '💰 Información salarial\n\nEl salario puede aparecer como:\n\n• Rango específico (ej: Q8,000 - Q12,000)\n• "A convenir" - Se discute en entrevista\n• "Competitivo" - Según experiencia\n\n💡 En la entrevista podrás negociar según tu experiencia y habilidades.'
    }
  },
  'contacto': {
    'soporte': {
      question: '¿Cómo contacto a soporte?',
      answer: '📞 Contactar soporte\n\nSi necesitas ayuda adicional:\n\n📧 Email: soporte@coosanjerjobs.com\n📱 WhatsApp: +502 1234-5678\n⏰ Horario: Lun-Vie 8:00-17:00\n\nTambién puedes usar el formulario de contacto en la sección "Ayuda".'
    },
    'reclutador': {
      question: '¿Puedo contactar al reclutador?',
      answer: '👔 Contacto con reclutadores\n\nEl contacto directo con reclutadores se da cuando:\n\n• Avanzas en el proceso de selección\n• Te contactan para entrevista\n• Necesitan información adicional\n\n⚠️ No es posible contactarlos directamente antes de aplicar. ¡Postúlate primero!'
    },
    'problemas': {
      question: 'Tengo un problema técnico',
      answer: '🔧 Problemas técnicos\n\nSi experimentas problemas:\n\n1️⃣ Intenta refrescar la página (F5)\n2️⃣ Limpia caché del navegador\n3️⃣ Prueba otro navegador\n4️⃣ Si persiste, contacta a soporte\n\n📧 Describe el problema con detalle\n📸 Incluye capturas de pantalla si es posible'
    },
    'horarios': {
      question: '¿Cuál es el horario de atención?',
      answer: '🕐 Horarios de atención\n\n📅 Lunes a Viernes\n⏰ 8:00 AM - 5:00 PM\n🌎 Hora de Guatemala (GMT-6)\n\n📧 Los correos fuera de horario serán respondidos el siguiente día hábil.\n\n💬 Este chat está disponible 24/7 para preguntas frecuentes.'
    },
    'ubicacion': {
      question: '¿Dónde están ubicados?',
      answer: '📍 Nuestra ubicación\n\nCoosanjerJobs\nCiudad de Guatemala, Guatemala\n\n🏢 Las entrevistas presenciales se realizan en nuestras oficinas.\n\n📌 La dirección exacta te será enviada cuando seas citado a entrevista.'
    }
  }
}

export default function Chatbot({ userName }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [hasNewNotification, setHasNewNotification] = useState(false)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentCategory, setCurrentCategory] = useState<FAQCategory>('main')
  const processedNotificationIds = useRef<Set<number>>(new Set())
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Cargar notificaciones de tipo Postulación y Manual desde el backend
  const loadApplicationNotifications = useCallback(async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    setIsLoadingNotifications(true)
    try {
      // Cargar notificaciones relevantes para el chatbot
      const [postulacionResponse, manualResponse] = await Promise.all([
        notificationService.getNotifications({ 
          tipo: 'Postulación',
          per_page: 20 
        }),
        notificationService.getNotifications({ 
          tipo: 'Manual',
          per_page: 20 
        })
      ])
      
      const allNotifications = [
        ...postulacionResponse.notifications,
        ...manualResponse.notifications
      ].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      
      let hasNew = false
      let newUnread = 0

      allNotifications.forEach((notification: Notification) => {
        if (!notification.leido) newUnread++
        
        if (!processedNotificationIds.current.has(notification.id)) {
          processedNotificationIds.current.add(notification.id)
          
          const newMessage: ChatMessage = {
            id: `notification-${notification.id}`,
            type: 'bot',
            content: `📬 ${notification.titulo}\n\n${notification.mensaje}`,
            timestamp: new Date(notification.fecha),
            notificationId: notification.id
          }

          setMessages(prev => {
            const exists = prev.some(m => m.notificationId === notification.id)
            if (!exists) {
              hasNew = true
              return [...prev, newMessage].sort((a, b) => 
                a.timestamp.getTime() - b.timestamp.getTime()
              )
            }
            return prev
          })

          // Marcar como leída si el chat está abierto
          if (isOpen && !notification.leido) {
            notificationService.markAsRead(notification.id).catch(console.error)
          }
        }
      })

      setUnreadCount(newUnread)
      
      if (hasNew && !isOpen) {
        setHasNewNotification(true)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoadingNotifications(false)
    }
  }, [isOpen])

  // Cargar mensajes de bienvenida iniciales
  useEffect(() => {
    const greetingName = userName ? userName.split(' ')[0] : ''
    const personalizedWelcome = greetingName 
      ? [`¡Hola ${greetingName}! 👋 Soy el asistente virtual de CoosanjerJobs.`, ...welcomeMessages.slice(1)]
      : welcomeMessages

    const initialMessages: ChatMessage[] = personalizedWelcome.map((content, index) => ({
      id: `welcome-${index}`,
      type: 'bot' as const,
      content,
      timestamp: new Date(Date.now() - (personalizedWelcome.length - index) * 1000)
    }))
    setMessages(initialMessages)
  }, [userName])

  // Cargar notificaciones al montar y cada 30 segundos
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    loadApplicationNotifications()

    const interval = setInterval(() => {
      loadApplicationNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [loadApplicationNotifications])

  // Scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    if (scrollAreaRef.current && isOpen) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isOpen])

  const handleQuickQuestion = (category: string, key: string) => {
    const faq = faqResponses[category]?.[key]
    if (!faq) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: faq.question,
      timestamp: new Date()
    }

    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: faq.answer,
      timestamp: new Date(Date.now() + 300)
    }

    setMessages(prev => [...prev, userMessage, botMessage])
  }

  const handleCategorySelect = (category: FAQCategory) => {
    if (category === 'main') {
      setCurrentCategory('main')
      return
    }

    const categoryInfo = faqCategories[category]
    if (!categoryInfo) return

    // Agregar mensaje del bot indicando la categoría seleccionada
    const botMessage: ChatMessage = {
      id: `category-${Date.now()}`,
      type: 'bot',
      content: `${categoryInfo.icon} ${categoryInfo.label}\n\nSelecciona una pregunta de esta categoría para obtener más información.`,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, botMessage])
    setCurrentCategory(category)
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
    if (days < 7) return `Hace ${days}d`
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setHasNewNotification(false)
      loadApplicationNotifications()
    }
  }

  const handleRefresh = () => {
    loadApplicationNotifications()
  }

  return (
    <>
      {/* Botón flotante del chatbot */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleChat}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg relative bg-primary hover:bg-primary/90"
        >
          {isOpen ? (
            <X size={24} weight="bold" />
          ) : (
            <>
              <ChatCircleDots size={28} weight="duotone" />
              {(hasNewNotification || unreadCount > 0) && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-destructive rounded-full flex items-center justify-center text-xs font-bold text-destructive-foreground"
                >
                  {unreadCount > 0 ? (unreadCount > 9 ? '9+' : unreadCount) : '!'}
                </motion.span>
              )}
            </>
          )}
        </Button>
      </motion.div>

      {/* Panel del chatbot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-2">
              {/* Header */}
              <CardHeader className="bg-primary text-primary-foreground pb-4 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Robot size={24} weight="duotone" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Asistente Virtual</CardTitle>
                    <p className="text-xs opacity-90">Notificaciones y ayuda</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={handleRefresh}
                    disabled={isLoadingNotifications}
                    title="Actualizar notificaciones"
                  >
                    <ArrowsClockwise 
                      size={18} 
                      weight="bold" 
                      className={cn(isLoadingNotifications && "animate-spin")}
                    />
                  </Button>
                  <Badge variant="secondary" className="text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                    En línea
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Área de mensajes */}
                <ScrollArea className="h-80" ref={scrollAreaRef}>
                  <div className="p-4 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex gap-2",
                          message.type === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.type === 'bot' && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <Robot size={18} weight="duotone" className="text-primary" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[85%] rounded-lg px-4 py-3 text-sm",
                            message.type === 'bot' 
                              ? "bg-muted text-foreground" 
                              : "bg-primary text-primary-foreground"
                          )}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                          <p className={cn(
                            "text-xs mt-2",
                            message.type === 'bot' ? "text-muted-foreground" : "opacity-70"
                          )}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Preguntas frecuentes por categoría */}
                <div className="p-3 border-t bg-muted/30 max-h-48 overflow-y-auto">
                  {currentCategory === 'main' ? (
                    <>
                      <p className="text-xs text-muted-foreground mb-2 font-medium">
                        💡 ¿En qué puedo ayudarte?
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(faqCategories).map(([key, category]) => (
                          <Button
                            key={key}
                            variant="outline"
                            size="sm"
                            className="text-xs h-auto py-2 px-2 flex flex-col items-start gap-0.5"
                            onClick={() => handleCategorySelect(key as FAQCategory)}
                          >
                            <span className="font-medium">{category.icon} {category.label}</span>
                            <span className="text-[10px] text-muted-foreground truncate w-full text-left">
                              {category.description}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => setCurrentCategory('main')}
                        >
                          <CaretLeft size={14} weight="bold" />
                        </Button>
                        <p className="text-xs text-muted-foreground font-medium flex-1">
                          {faqCategories[currentCategory]?.icon} {faqCategories[currentCategory]?.label}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => setCurrentCategory('main')}
                          title="Volver al inicio"
                        >
                          <House size={14} weight="bold" />
                        </Button>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {Object.entries(faqResponses[currentCategory] || {}).map(([key, faq]) => (
                          <Button
                            key={key}
                            variant="outline"
                            size="sm"
                            className="text-xs h-auto py-1.5 px-2 justify-start text-left whitespace-normal"
                            onClick={() => handleQuickQuestion(currentCategory, key)}
                          >
                            {faq.question}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
