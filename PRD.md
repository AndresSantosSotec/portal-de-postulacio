# Planning Guide

**CoosajerJobs - Plataforma de Gestión de Talento y Empleos** es una plataforma moderna que conecta a las cooperativas, empresas asociadas y candidatos de la red Coosajer, ofreciendo una experiencia intuitiva y eficiente para explorar vacantes, postularse fácilmente y realizar seguimiento completo del proceso de contratación.

**Experience Qualities**:

- **Profesional y Confiable**: Diseño institucional con azul Coosajer (#004082) que transmite estabilidad, seriedad y confianza, haciendo que los usuarios se sientan seguros en la plataforma.
- **Dinámico pero Sobrio**: Interfaz moderna con microanimaciones sutiles, transiciones suaves y elementos visuales que mantienen la identidad institucional sin perder formalidad.
- **Eficiencia Responsiva**: Feedback instantáneo en cada interacción - skeleton loaders durante cargas, confirmaciones visuales inmediatas, y flujos optimizados que respetan el tiempo del usuario.

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - Sistema completo de autenticación con sesiones persistentes, gestión avanzada de perfiles con foto y CV builder, sistema de notificaciones en tiempo real para cambios de estado, sistema de favoritos y alertas, postulación rápida con un clic, formularios dinámicos configurables por empresa, y navegación multi-categoría en todas las industrias.

## Essential Features

### Sistema de Postulación Inteligente con Preguntas Dinámicas
- **Functionality**: Formulario de aplicación que combina campos base estándar con preguntas personalizadas definidas por cada empresa desde el panel administrativo
- **Purpose**: Permitir a las empresas recopilar información específica de candidatos mientras se mantiene una experiencia fluida de postulación
- **Trigger**: Usuario hace clic en "Postularme ahora" en detalle de empleo
- **Progression**: Click aplicar → Modal/página formulario → Campos base (nombre, email, teléfono, CV) → Preguntas dinámicas específicas del puesto → Validación en tiempo real → Auto-guardado de progreso → Enviar → Confirmación con animación
- **Success criteria**: Formularios se generan dinámicamente según configuración de empresa, validación funciona correctamente, progreso se guarda automáticamente, postulaciones se registran con todas las respuestas

### Postulación Rápida (Quick Apply)
- **Functionality**: Usuarios con perfil completo pueden aplicar a empleos con un solo clic usando su información y CV guardados
- **Purpose**: Reducir fricción y aumentar conversión permitiendo aplicaciones instantáneas para usuarios registrados
- **Trigger**: Usuario autenticado con CV cargado hace clic en botón "Postulación Rápida"
- **Progression**: Click botón → Confirmación rápida → Aplicación enviada → Toast de éxito → Estado actualizado en perfil
- **Success criteria**: Aplicación se completa en menos de 2 segundos, usuario ve confirmación inmediata, aplicación aparece en "Mis Postulaciones"

### Gestión de Fotos de Perfil
- **Functionality**: Subida, recorte y gestión de foto de perfil del usuario (máx. 3 MB, jpg/png)
- **Purpose**: Personalizar la experiencia y hacer el perfil más profesional y humano
- **Trigger**: Usuario accede a "Mi Curriculum" y hace clic en avatar o botón "Cambiar foto"
- **Progression**: Click cambiar foto → Dialog selector de archivos → Previsualización → Recorte opcional → Confirmar → Subida → Avatar actualizado en navbar y perfil
- **Success criteria**: Foto se sube correctamente, aparece en avatar de navbar, se mantiene en sesiones futuras, validación de tamaño funciona

### Publicaciones de Empleo con Imágenes
- **Functionality**: Las empresas pueden subir imágenes o banners representativos para sus ofertas de empleo (máx. 5 MB, jpg/png)
- **Purpose**: Hacer las ofertas más atractivas visualmente y aumentar engagement
- **Trigger**: Empresa crea o edita oferta en panel administrativo
- **Progression**: Crear oferta → Formulario campos → Sección "Imagen del puesto" → Subir archivo → Preview → Guardar → Imagen aparece en card y detalle
- **Success criteria**: Imágenes se muestran en cards de listado y banner superior en detalle, skeleton loader durante carga, fallback elegante si no hay imagen

### Sistema de Notificaciones en Tiempo Real
- **Functionality**: Notificaciones automáticas cuando cambia el estado de una postulación, con dropdown en navbar y panel dedicado
- **Purpose**: Mantener a usuarios informados sobre su proceso sin necesidad de revisar constantemente
- **Trigger**: Cambio de estado de aplicación (postulado → cv-visto → en-proceso → finalista → proceso-finalizado)
- **Progression**: Cambio de estado → Notificación creada → Toast aparece → Badge en campana navbar → Ver en dropdown o panel → Marcar como leída
- **Success criteria**: Notificaciones instantáneas, contador de no leídas funciona, historial accesible, animaciones suaves

### Skeleton Loaders Integrales
- **Functionality**: Indicadores visuales de carga en listas de empleos, formularios, perfil y todas las secciones con datos asíncronos
- **Purpose**: Mejorar percepción de velocidad y reducir frustración durante cargas
- **Trigger**: Cualquier operación que requiera cargar datos
- **Progression**: Inicio de carga → Skeleton con forma similar al contenido → Animación shimmer → Contenido real reemplaza skeleton
- **Success criteria**: Todos los estados de carga tienen skeleton apropiado, transición suave entre skeleton y contenido, forma del skeleton refleja estructura final

### Navegación y Gestión de Perfil Completo
- **Functionality**: Currículum completo con información personal, experiencias laborales, educación, habilidades, y descarga de CV
- **Purpose**: Centralizar información profesional del usuario para postulaciones rápidas y gestión de carrera
- **Trigger**: Usuario accede a "Mi Curriculum" desde navegación
- **Progression**: Click curriculum → Vista/edición → Agregar secciones (experiencia, educación, skills) → Guardar → Preview/descargar
- **Success criteria**: Perfil editable por secciones, barra de progreso de completitud, descarga de CV funcional, datos persisten

### Sistema de Favoritos y Alertas
- **Functionality**: Guardar empleos favoritos y crear alertas personalizadas por categoría, ubicación y keywords
- **Purpose**: Permitir a usuarios trackear oportunidades de interés y recibir notificaciones proactivas
- **Trigger**: Click en corazón en card de empleo, o acceso a sección "Mis Alertas"
- **Progression**: Guardar favorito → Confirmación → Ver en sección favoritos → Crear alerta → Definir criterios → Guardar → Recibir notificaciones de matches
- **Success criteria**: Favoritos se sincronizan en toda la app, alertas generan notificaciones cuando hay matches, gestión fácil de alertas guardadas

## Edge Case Handling

- **Acciones Sin Autenticación**: Usuarios no logueados ven modal de login al intentar aplicar, guardar favoritos o ver notificaciones
- **Sin Notificaciones**: Estado vacío amigable con mensaje motivacional cuando usuario no tiene notificaciones aún
- **Datos de Perfil Inválidos**: Validación de formularios previene envío de campos incompletos con mensajes de error claros y constructivos
- **Errores de Red**: Manejo elegante con opciones de reintentar y mensajes user-friendly sin jerga técnica
- **Cambios Concurrentes de Estado**: Sistema de notificaciones maneja múltiples cambios correctamente con orden apropiado
- **Imágenes No Cargadas**: Fallback con placeholder elegante y opción de reintentar carga
- **Formularios Dinámicos Vacíos**: Si empresa no define preguntas, muestra solo campos base sin errores
- **Postulación Rápida Sin CV**: Botón deshabilitado con tooltip explicativo si usuario no ha subido CV

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

## Animations

Las animaciones deben ser sutiles pero presentes - reforzando acciones sin ralentizar al usuario. El lenguaje de movimiento es ágil y responsivo con transiciones rápidas que dan feedback sin exigir atención. Piensa: eficiencia profesional con momentos calculados de deleite.

- **Purposeful Meaning**: 
  - Elevación de cards en hover sugiere interactividad
  - Transiciones de estado en aplicaciones muestran progreso
  - Entradas/salidas de modales mantienen contexto espacial
  - Estados de carga (skeleton) previenen delays percibidos
  - Confirmaciones con checkmark animado refuerzan éxito
  - Pulso sutil en notificaciones nuevas atrae atención
  
- **Hierarchy of Movement**:
  - Primary: Envío de aplicaciones, transiciones login/logout, confirmaciones (300ms ease-out)
  - Secondary: Actualizaciones de filtros, cambios de tabs, abrir detalles (200ms ease-in-out)
  - Tertiary: Hover states, tooltips, badges (150ms ease-in)
  - Skeleton Shimmer: Animación continua de carga (2000ms linear loop)

## Component Selection

- **Components**:
  - **Dialog**: Modal de login/registro, confirmación de aplicación, editor de foto de perfil
  - **Card**: Listado de empleos, cards de aplicaciones, secciones de perfil - con hover:shadow-xl y transition
  - **Tabs**: Cambio entre estados en "Mis Postulaciones" (Todas, Postulado, CV Visto, En Proceso, Finalista)
  - **Input, Textarea, Select**: Formularios de perfil, búsqueda de empleos, controles de filtros, campos dinámicos - con focus:ring-2 ring-primary
  - **Button**: Primary (Aplicar, Guardar, Enviar), Secondary (Editar, Cancelar), Ghost (Favoritos, Navegación) - con pesos visuales distintos y animaciones hover
  - **Badge**: Categorías de empleo, estado de aplicación, contador de notificaciones, tags "nuevo" - usando colores variant apropiados
  - **Avatar**: Foto de perfil en navbar y perfil, con fallback de iniciales
  - **Separator**: Divisiones visuales entre secciones
  - **ScrollArea**: Descripciones largas de empleos, listas de aplicaciones
  - **Accordion**: Secciones colapsables en perfil (Experiencia, Educación, Habilidades)
  - **Skeleton**: Placeholders animados para todos los estados de carga
  - **Progress**: Barra de completitud de perfil, progreso en formulario de postulación
  - **Popover**: Dropdown de notificaciones en navbar
  - **Tooltip**: Información adicional en íconos y estados
  
- **Customizations**:
  - JobCard component con botón de favorito integrado, badge de estado, imagen/logo empresa
  - ApplicationTimeline component mostrando progresión de estados con línea conectora
  - ProfilePhotoUpload component con crop, preview y validación
  - DynamicQuestionForm component que renderiza campos según configuración
  - QuickApplyButton component con confirmación one-click
  - CurriculumPreview y CurriculumDownload components
  - CategoryFilterGrid con iconos + labels
  - NotificationBell con contador animado
  - SkeletonJobCard, SkeletonProfile, SkeletonForm para todos los estados de carga
  
- **States**:
  - Buttons: Background shift sutil en hover, pressed con scale(0.98), disabled con opacity-50 y cursor-not-allowed
  - Inputs: Border color change en focus con ring-2 ring-primary, error con border-destructive y shake animation, success con border-secondary y check icon
  - Job cards: Elevación shadow-lg en hover, borde sutil highlight, transition-all duration-200
  - Favorite icon: Filled heart cuando activo con scale animation y color transition
  - Notification bell: Pulso en badge cuando hay nuevas, fill cuando activas
  - Avatar: Ring border en hover, placeholder con gradient cuando no hay foto
  
- **Icon Selection** (usando @phosphor-icons/react con weight="duotone" mayormente):
  - Briefcase: Listado de empleos, ícono de app
  - User/UserCircle: Perfil, avatar
  - Heart: Favoritos (regular/fill states)
  - Bell: Alertas/notificaciones
  - PaperPlaneRight: Aplicaciones/postulaciones
  - MagnifyingGlass: Búsqueda
  - Funnel: Filtros
  - Download/DownloadSimple: Descarga de CV
  - Plus/PlusCircle: Agregar entradas
  - Pencil/PencilSimple: Editar
  - Check/CheckCircle: Confirmaciones, éxito
  - Camera: Cambiar foto de perfil
  - Buildings: Empresa
  - MapPin: Ubicación
  - CalendarBlank: Fechas
  - ArrowLeft/ArrowRight: Navegación
  - SignOut: Cerrar sesión
  - List: Menú/listados
  
- **Spacing**:
  - Container max-width: 1280px (max-w-7xl)
  - Section padding: py-8 px-4 md:py-12 md:px-6
  - Card padding: p-6
  - Grid gaps: gap-6 para cards de empleos, gap-4 para forms
  - Button padding: px-6 py-2.5 (default), px-4 py-2 (sm)
  - Stack spacing: space-y-4 para forms, space-y-6 para secciones
  
- **Mobile**:
  - Navigation tabs se apilan verticalmente con botones full-width
  - Job cards cambian de grid a columna única
  - Panel de filtros se convierte en Sheet/Drawer desde bottom
  - Reducción de font sizes: H1 a 24px, H2 a 20px, H3 a 16px, Body a 14px
  - Touch targets mínimo 44px para todos los controles
  - Navbar colapsa a hamburger menu con avatar visible
  - Formularios de postulación en scroll vertical completo
  - Skeleton loaders adaptan a layout móvil
  - Imágenes de empleos con aspect ratio optimizado para móvil
