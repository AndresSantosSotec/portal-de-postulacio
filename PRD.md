# Planning Guide

CoosajerJobs es una plataforma moderna de gestión de talento que conecta a cooperativas, empresas asociadas y candidatos de la red Coosajer, con diseño institucional, microanimaciones sutiles, experiencia de usuario excepcional, y un enfoque en accesibilidad y seguimiento transparente del proceso de selección.

**Experience Qualities**:

- **Profesional y Confiable**: Diseño institucional con azul Coosajer (#004082) que transmite estabilidad, seriedad y confianza, haciendo que los usuarios se sientan seguros en la plataforma.
- **Dinámico pero Sobrio**: Interfaz moderna con microanimaciones sutiles, transiciones fluidas (framer-motion), skeleton loaders animados y elementos visuales que mantienen la identidad institucional sin perder formalidad.
- **Accesible y Transparente**: Modo claro/oscuro automático con preferencia del sistema, diseño responsive, controles accesibles que funcionan en cualquier dispositivo, y seguimiento visual completo del proceso de selección para candidatos.

**Complexity Level**: Light Application (múltiples features con estado intermedio)
- Gestión de perfil, postulaciones, favoritos, notificaciones y seguimiento de proceso sin requerir backend complejo. Usa KV storage para persistencia y ofrece funciones avanzadas como postulación rápida, filtros visuales por categoría, chatbot informativo, y visualización de ambiente laboral.

## Essential Features

### Exploración Visual de Empleos por Categoría
- **Functionality**: Grid visual con iconos para filtrar empleos por categoría (desarrollo, diseño, marketing, ventas, etc.) mostrando conteo de ofertas en cada una
- **Purpose**: Facilitar navegación rápida y visual sin depender de dropdowns, mejorando la experiencia de descubrimiento
- **Trigger**: Usuario accede al listado de empleos
- **Progression**: Ver grid de categorías → Click en categoría con ícono → Lista se filtra → Empleos relevantes aparecen con animación
- **Success criteria**: Grid responsive, animaciones fluidas en selección, contadores precisos, iconos duotone de Phosphor

### Modo Claro/Oscuro Automático
- **Functionality**: Toggle de tema con opciones claro, oscuro y automático (según preferencia del sistema), con transiciones suaves entre modos
- **Purpose**: Mejorar accesibilidad y confort visual según preferencias y condiciones de iluminación del usuario
- **Trigger**: Usuario hace click en botón de tema en navbar
- **Progression**: Click ícono sol/luna → Dropdown con opciones → Seleccionar modo → Cambio animado de colores → Preferencia guardada
- **Success criteria**: Transición suave sin parpadeo, modo automático detecta sistema, persistencia entre sesiones, todos los componentes adaptan colores correctamente

### Skeleton Loaders Animados
- **Functionality**: Placeholders animados con efecto shimmer durante carga de datos (listados, perfiles, formularios)
- **Purpose**: Prevenir sensación de delay y mantener al usuario informado durante cargas, mejorando percepción de velocidad
- **Trigger**: Inicio de carga de datos (800ms delay para demo)
- **Progression**: Inicio carga → Skeletons con shimmer aparecen → Datos cargan → Transición fade-in a contenido real
- **Success criteria**: Shimmer fluido 2s loop, forma similar al contenido final, colores muted apropiados, no afecta layout

### Postulación con Datos del Perfil
- **Functionality**: Toggle para autocompletar formulario de postulación con datos guardados del perfil (nombre, email, teléfono, CV)
- **Purpose**: Reducir fricción en postulaciones y evitar re-ingreso de datos, manteniendo opción de personalización
- **Trigger**: Usuario abre formulario de postulación y tiene perfil completo
- **Progression**: Abrir formulario → Toggle "usar datos de perfil" activado → Campos pre-llenados → Usuario verifica/edita → Envía postulación
- **Success criteria**: Toggle funcional, datos se llenan reactivamente, CV guardado se muestra con indicador visual, validación funciona

### Postulación Rápida
- **Functionality**: Botón de un click para postular usando perfil y CV guardados, sin llenar formulario
- **Trigger**: Usuario con perfil completo hace click en "Postularme ahora"
- **Progression**: Click botón → Confirmación modal con opción rápida destacada → Click "Postular Rápido" ⚡ → Animación envío → Confirmación success
- **Success criteria**: Solo aparece si usuario tiene CV y datos completos, animación lightning distintiva, toast de confirmación

### Registro Rápido y Postulación Sin Logeo
- **Functionality**: Formulario de registro en 4 pasos que permite crear cuenta completa y postularse inmediatamente a un empleo sin necesidad de iniciar sesión primero
- **Purpose**: Reducir fricción en el proceso de postulación permitiendo a usuarios nuevos registrarse y postularse en una sola acción, capturando información completa desde el inicio
- **Trigger**: Usuario no logueado hace click en "Registro rápido y postularme" desde el detalle de un empleo
- **Progression**: Click botón → Modal de registro paso 1 (datos básicos: usuario, email, contraseña) → Paso 2 (datos personales: nombre completo, fecha nacimiento, teléfono, dirección, DPI) → Paso 3 (datos profesionales: título medio, universidad, profesión, estudios adicionales) → Paso 4 (subir CV y opción de registrar y postular en un click) → Cuenta creada y postulación enviada
- **Success criteria**: 4 pasos con validación, barra de progreso, opción de postularse al final o solo registrarse, todos los datos se guardan en el perfil, CV se adjunta automáticamente

### Perfil de Usuario Extendido con DPI y Referencias
- **Functionality**: Sección completa de perfil con datos personales (DPI, fecha nacimiento, dirección completa), datos profesionales (títulos, profesión) y referencias laborales/personales
- **Purpose**: Permitir a usuarios completar su perfil profesional de forma exhaustiva con toda la información que las empresas necesitan para procesos de selección
- **Trigger**: Usuario accede a pestaña "Datos Personales" en su portal
- **Progression**: Ver pestaña → Secciones de datos personales, profesionales y referencias → Click editar → Modificar campos → Guardar → Agregar referencias con formulario inline → Referencias listadas con opción de eliminar
- **Success criteria**: Todos los campos del registro rápido editables, sección separada para referencias laborales (nombre, empresa, cargo, teléfono, email) y personales (nombre, relación, teléfono, email), agregar/eliminar referencias con animaciones suaves

### Microanimaciones en Interacciones
- **Functionality**: Animaciones sutiles con framer-motion en hover de cards, click de botones, toggle de favoritos, cambio de tabs, transición de vistas
- **Purpose**: Dar feedback inmediato de interacciones y crear experiencia moderna sin ralentizar navegación
- **Trigger**: Cualquier interacción del usuario con elementos interactivos
- **Progression**: Hover card → Elevación y scale sutil → Click favorito → Scale pulse animation → Cambio tab → Fade slide transition
- **Success criteria**: Animaciones ≤300ms, no interfieren con UX, mejoran percepción de calidad, funcionan en todos los navegadores

### Amplio Catálogo de Empleos Demo
- **Functionality**: 36+ empleos de muestra en diversas categorías con imágenes, datos reales y preguntas personalizadas
- **Purpose**: Permitir exploración completa de features sin necesidad de cargar datos, ideal para demo y pruebas
- **Trigger**: Primera carga de la aplicación
- **Progression**: App inicia → Verifica si hay empleos → Si vacío, genera 36 empleos de muestra → Usuario explora catálogo variado
- **Success criteria**: Empleos distribuidos en todas las categorías, imágenes relevantes de Unsplash, fechas variadas, salarios realistas

### Sistema de Notificaciones Interactivo
- **Functionality**: Notificaciones automáticas cuando cambia el estado de postulación, con dropdown en navbar y panel completo
- **Trigger**: Cambio de estado de aplicación (postulado → cv-visto → en-proceso → finalista → proceso-finalizado)
- **Success criteria**: Notificaciones instantáneas, contador de no leídas funciona, historial accesible, animaciones suaves (pulse en badge)

### CV Mejorado con Visual Feedback  
- **Functionality**: Upload de CV con animación, preview visual, indicador de archivo guardado con ícono PDF y check verde
- **Purpose**: Dar certeza al usuario de que su CV está cargado correctamente y será usado en postulaciones
- **Trigger**: Usuario sube CV en perfil o formulario de postulación
- **Progression**: Click área upload → Animación bounce icon → Seleccionar archivo → Preview con ícono PDF → Confirmación visual verde
- **Success criteria**: Animación smooth, preview claro, estado guardado persistente, uso automático en postulaciones futuras

### Timeline de Seguimiento del Proceso
- **Functionality**: Visualización paso a paso del proceso de selección con estados completados, actuales y pendientes, incluyendo fechas y notas para cada etapa
- **Purpose**: Dar transparencia completa al candidato sobre su progreso en el proceso de selección y reducir ansiedad por falta de información
- **Trigger**: Usuario hace click en "Ver seguimiento" en su postulación
- **Progression**: Ver postulación → Click "Ver seguimiento" → Timeline expandible aparece → Estados visualizados con iconos y colores → Información de pruebas psicométricas si aplica
- **Success criteria**: Timeline responsive, estados claramente diferenciados (completado/actual/pendiente), animaciones fluidas de expansión, información de fechas precisa

### Chatbot Informativo Automatizado
- **Functionality**: Asistente virtual flotante que envía mensajes automáticos según cambios de estado, responde preguntas frecuentes, y mantiene comunicación constante con aspirantes
- **Purpose**: Mantener a los candidatos informados en tiempo real sobre avances en su proceso y responder dudas comunes sin necesidad de contacto humano
- **Trigger**: Cambio de estado de aplicación, envío de pruebas psicométricas, o usuario abre el chatbot
- **Progression**: Estado cambia → Notificación automática en chat → Usuario puede abrir chatbot → Ver historial de mensajes → Hacer preguntas predefinidas → Recibir respuestas instantáneas
- **Success criteria**: Notificaciones automáticas correctas para cada evento, respuestas FAQ precisas, UI del chat profesional y amigable, badge de notificación cuando hay mensajes nuevos

### Integración de Pruebas Psicométricas
- **Functionality**: Sistema de tracking para pruebas psicométricas externas, mostrando cuándo fueron enviadas, estado de completado, y notificaciones automáticas vía chatbot
- **Purpose**: Permitir seguimiento del proceso de pruebas psicométricas aunque se realicen en plataforma externa, manteniendo al candidato informado
- **Trigger**: Administrador marca que pruebas fueron enviadas o completadas
- **Progression**: Admin envía pruebas → Candidato recibe notificación en chatbot y email → Estado se muestra en timeline → Candidato completa → Admin marca como completado → Nueva notificación al candidato
- **Success criteria**: Estados de pruebas visibles en timeline, notificaciones automáticas funcionan, fechas de envío y completado se registran

### Galería de Ambiente Laboral (Fotos y Videos)
- **Functionality**: Sección dedicada con galería filtrable de fotos y videos del ambiente laboral de Coosajer, mostrando oficinas, equipo, eventos y cultura organizacional
- **Purpose**: Atraer candidatos mostrando la cultura y ambiente de trabajo real, aumentando confianza y transparencia sobre la organización
- **Trigger**: Usuario navega en la página principal de empleos (scroll hasta la sección)
- **Progression**: Ver listado de empleos → Scroll down → Galería de ambiente laboral aparece → Filtrar por categoría (oficinas/equipo/eventos/cultura) → Click en foto/video → Modal con vista ampliada
- **Success criteria**: Galería responsive con grid adaptativo, filtros funcionales, imágenes se cargan con placeholder, modal de vista ampliada con transiciones suaves

### Filtro de Plazas Disponibles/Ocupadas
- **Functionality**: Sistema de tabs para filtrar empleos por estado (todas/disponibles/ocupadas), permitiendo ver tanto plazas activas como las ya ocupadas para futuras oportunidades
- **Purpose**: Mostrar transparencia sobre plazas ocupadas y permitir a candidatos postularse anticipadamente para el banco de talento
- **Trigger**: Usuario accede a listado de empleos
- **Progression**: Ver listado → Tabs disponibles debajo del título → Click en "Ocupadas" → Listado filtra a solo plazas ocupadas → Badge visual en cada card identifica estado
- **Success criteria**: Tabs funcionan correctamente, badge "Plaza Ocupada" visible en cards, filtro afecta conteo de empleos, jobs ocupados tienen fecha de ocupación


- **Sin Notificaciones**: Estado vacío amigable con mensaje motiva
- **Errores de Red**: Manejo elegante con opciones de reintentar y mensajes user-friendly sin jerga técnica
- **Imágenes No Cargadas**: Fallback con placeholder elegante y opción de reintentar carga

## Design Direction
El diseño debe evocar profesionalismo institucional con vitalidad moderna - usando el azul corporativo Coosajer (#004082) como ancl
## Color Selection
Esquema de colores **Complementario con Acentos Institucionales** - combinando el azul corporativo Coosajer con ve
- **Primary Color**: Azul Institucional Coosajer oklch(0.38 0.08 245) (#004082) - El color de marca que comunica confianza, estabilidad profesion
  - Verde Acento oklch(0.65 0.15 145) (#4EAD33) - Color energético para estados positivos (éxito, confirmaciones, iconos che

- **Foreground/Background Pairi
  - Card (Blanco oklch(1 0 0)): Gris Texto (oklch(0.35 0.01 250)) - Ratio 9.1:1 ✓
  - Secondary (Verde Acento oklch(0.65 0.15 145)): Blanco texto (oklch(1 0 0)) - Ra
  - Muted (Gris Claro oklch(0.97 0.003 250)): Gris Medio tex
## Font Selection
La tipografía debe transmitir modernidad, excelente legibilidad y profesionalismo accesible - **Inter** es perfecta por su diseño optimizado para pantallas y carácter

  - H2 (Headers de Sección): Inter Semibold
  - Body (Descripciones de empleo, texto de perfil): Inter Regular / 15px / normal / 1.6 line height
  - Button Text: Inter Semibold / 14px / normal / 1 line height
## Animations

Las animaciones son sutiles, funcionales y rápidas - reforzando acciones sin ralentizar al usuario. Cada animación tiene un propósito claro: orientar, confirmar o guiar atención. El lenguaje de movimiento es ágil, profesional y consistente en toda la aplicación.

- **Purposeful Meaning**: 
  - Elevación y scale en hover de job cards (y: -4px, scale: 1.03) sugiere clickeabilidad
  - Pulse animation en ícono de favorito cuando está activo (scale: [1, 1.1, 1]) confirma acción
  - Shimmer en skeleton loaders (translateX: -100% → 100%, 2s loop) indica carga en progreso
  - Transiciones de estado en aplicaciones con fade-in y slide-up muestran progreso
  - Rotación del ícono sol/luna (180deg) al cambiar tema hace el cambio tangible
  - Lightning icon con spin en postulación rápida enfatiza velocidad
  - Bounce animation en ícono de upload hace el área más invitante
  - Fade slide (opacity + y offset) en cambio de tabs mantiene contexto espacial

- **Hierarchy of Movement**:
  - Primary: Envío de postulaciones, confirmaciones de éxito, cambio de tema (300ms ease-out)
  - Secondary: Hover en cards, filtro por categoría, transiciones de tabs (200ms ease-in-out)  
  - Tertiary: Hover en botones, tooltips, badges (150ms ease-in)
  - Continuous: Skeleton shimmer (2000ms linear infinite), notification badge pulse

- **Implementation**: Todas las animaciones usan framer-motion para consistencia y performance. Las transiciones CSS se usan solo para propiedades simples (color, border). Skeleton shimmer usa keyframe CSS nativo para mejor performance en loops largos.

## Component Selection

- **Components**: 
  - **Dialog**: Modal de login/registro, confirmación de aplicación, galería de fotos ampliadas
  - **Card**: Job cards con hover effects, application cards, profile sections, galería de ambiente laboral
  - **Tabs**: Portal navigation con estado activo visual, filtros de plazas disponibles/ocupadas
  - **Input/Textarea/Select**: Con focus states y validación visual
  - **Button**: Variants (default, secondary, ghost, outline) con hover animations
  - **Badge**: Para categorías, estados, contadores, plazas ocupadas
  - **Avatar**: Con fallback gradient e iniciales
  - **Skeleton**: Shimmer loaders para loading states
  - **Progress**: Barra de progreso en formularios
  - **Popover/DropdownMenu**: Para notificaciones y menús
  - **Sonner Toast**: Para feedback de acciones
  - **ScrollArea**: Para contenido del chatbot

- **Custom Components**:
  - **CategoryFilter**: Grid visual con iconos y contadores
  - **ThemeToggle**: Selector de tema animado
  - **ThemeProvider**: Context provider para dark/light mode
  - **ApplicationForm**: Con auto-fill y quick apply
  - **JobCard**: Con imagen, favoritos, badges, indicador de plaza ocupada
  - **ApplicationTimeline**: Timeline visual del proceso con estados e historial
  - **Chatbot**: Asistente virtual flotante con mensajes automáticos y FAQs
  - **WorkplaceGallery**: Galería filtrable de fotos y videos del ambiente laboral
  - **NotificationService**: Hook para generar notificaciones automáticas

## Edge Case Handling

- **Acciones Sin Autenticación**: Usuarios no logueados ven modal de login o pueden usar registro rápido al intentar aplicar, guardar favoritos o ver notificaciones
- **Registro Rápido Incompleto**: Validación en cada paso previene avanzar sin completar campos requeridos, con mensajes claros de error
- **CV No Cargado en Registro Rápido**: Usuario puede continuar sin CV pero se recomienda subirlo para completar postulación
- **Datos Duplicados en Referencias**: Sistema permite múltiples referencias sin validación de duplicados (común tener mismo contacto en diferentes contextos)
- **Sin Notificaciones**: Estado vacío amigable con mensaje motivacional cuando usuario no tiene notificaciones aún
- **Datos de Perfil Inválidos**: Validación de formularios previene envío de campos incompletos con mensajes de error claros y constructivos
- **Errores de Red**: Manejo elegante con opciones de reintentar y mensajes user-friendly sin jerga técnica
- **Cambios Concurrentes de Estado**: Sistema de notificaciones maneja múltiples cambios correctamente con orden apropiado
- **Imágenes No Cargadas**: Fallback con placeholder elegante y opción de reintentar carga
- **Formularios Dinámicos Vacíos**: Si empresa no define preguntas, muestra solo campos base sin errores
- **Postulación Rápida Sin CV**: Botón deshabilitado con tooltip explicativo si usuario no ha subido CV
- **Postulación a Plaza Ocupada**: Usuarios pueden postularse a plazas ocupadas para banco de talento, con mensaje explicativo
- **Chatbot Sin Mensajes**: Estado inicial con mensajes de bienvenida y opciones de preguntas frecuentes
- **Pruebas Psicométricas Vencidas**: Sistema muestra si el enlace de pruebas está vencido con mensaje para contactar RRHH
- **Timeline Sin Historial**: Si aplicación no tiene historial de estados, se genera automáticamente basado en estado actual

## Design Direction

El diseño debe evocar profesionalismo institucional con vitalidad moderna - usando el azul corporativo Coosajer (#004082) como ancla de confianza, complementado con verde acento (#4EAD33) para acciones positivas y confirmaciones. La interfaz es sobria pero no aburrida: microanimaciones sutiles, transiciones fluidas, y elementos visuales modulares con tarjetas flotantes y sombras suaves crean dinamismo sin perder formalidad. El balance perfecto entre "institución seria" y "plataforma moderna".

## Color Selection

Esquema de colores **Complementario con Acentos Institucionales** - combinando el azul corporativo Coosajer con verde complementario para crear contraste visual profesional y dirigir la atención a acciones clave.

- **Primary Color**: Azul Institucional Coosajer oklch(0.38 0.08 245) (#004082) - El color de marca que comunica confianza, estabilidad profesional y autoridad institucional. Usado en cabeceras, botones principales y elementos de navegación.
- **Secondary Colors**: 
  - Verde Acento oklch(0.65 0.15 145) (#4EAD33) - Color energético para estados positivos (éxito, confirmaciones, iconos check), botones secundarios de acción
  - Gris Claro oklch(0.97 0.003 250) (#F6F8FA) - Fondos de paneles secundarios, bordes suaves, estados deshabilitados
  - Gris Texto oklch(0.35 0.01 250) (#4A4A4A) - Tipografía base y contenido
- **Accent Color**: Amarillo Suave oklch(0.88 0.12 90) (#FFD23B) - Usado estratégicamente para badges "nuevo" o "recomendado", llamadas de atención no urgentes
- **Foreground/Background Pairings**:
  - Background (Blanco Puro oklch(1 0 0)): Gris Texto (oklch(0.35 0.01 250)) - Ratio 9.1:1 ✓
  - Card (Blanco oklch(1 0 0)): Gris Texto (oklch(0.35 0.01 250)) - Ratio 9.1:1 ✓
  - Primary (Azul Coosajer oklch(0.38 0.08 245)): Blanco texto (oklch(1 0 0)) - Ratio 8.9:1 ✓
  - Secondary (Verde Acento oklch(0.65 0.15 145)): Blanco texto (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Accent (Amarillo Suave oklch(0.88 0.12 90)): Gris Oscuro texto (oklch(0.30 0.01 90)) - Ratio 8.5:1 ✓
  - Muted (Gris Claro oklch(0.97 0.003 250)): Gris Medio texto (oklch(0.50 0.01 250)) - Ratio 6.8:1 ✓

## Font Selection

La tipografía debe transmitir modernidad, excelente legibilidad y profesionalismo accesible - **Inter** es perfecta por su diseño optimizado para pantallas y carácter profesional pero no intimidante, funcionando impecablemente desde títulos de puestos hasta texto de descripciones extensas.

- **Typographic Hierarchy**:
  - H1 (Títulos Principales de Página): Inter Bold / 32px / -0.02em letter spacing / 1.2 line height
  - H2 (Headers de Sección): Inter Semibold / 24px / -0.01em / 1.3 line height
  - H3 (Títulos de Empleo, Headers de Cards): Inter Semibold / 18px / normal / 1.4 line height
  - Body (Descripciones de empleo, texto de perfil): Inter Regular / 15px / normal / 1.6 line height
  - Small (Metadata, fechas, ubicaciones): Inter Medium / 13px / normal / 1.4 line height
  - Button Text: Inter Semibold / 14px / normal / 1 line height

## Icon Selection

Usando @phosphor-icons/react con weight="duotone" para dar profundidad visual sin añadir ruido:
- **Briefcase**: Jobs, logo de app
- **User/UserCircle**: Perfil, avatar
- **Heart**: Favoritos (regular/fill states con animación)
- **Bell**: Alertas, notificaciones (pulse cuando hay nuevas)
- **PaperPlaneRight**: Postulaciones
- **MagnifyingGlass**: Búsqueda
- **Funnel**: Filtros
- **Code, PaintBrush, ChartLineUp**: Categorías de empleos
- **Moon/Sun**: Theme toggle (con rotación animada)
- **Lightning**: Quick apply (con spin animation)
- **Upload/FilePdf**: CV y archivos
- **Check/CheckCircle**: Confirmaciones
- **MapPin, Buildings, CalendarBlank**: Metadata de empleos

## Mobile Responsiveness

- Grid de categorías: 2 cols en móvil → 3 en tablet → 7 en desktop
- Job cards: 1 col móvil → 2 tablet → 3 desktop
- Tabs: 2 cols móvil → 6 desktop con labels abreviados
- Navbar: Logo + theme + menu hamburger
- Touch targets: Mínimo 44px en móviles
- Font sizes adaptados: H1 24px móvil / 32px desktop
