import type { Job, CustomQuestion } from './types'

const sampleQuestions: Record<string, CustomQuestion[]> = {
  developer: [
    {
      id: 'q1',
      question: '¿Cuántos años de experiencia tienes con las tecnologías mencionadas?',
      type: 'select',
      options: ['Menos de 1 año', '1-3 años', '3-5 años', 'Más de 5 años'],
      required: true
    },
    {
      id: 'q2',
      question: 'Describe brevemente un proyecto relevante en el que hayas trabajado',
      type: 'textarea',
      required: true
    },
    {
      id: 'q3',
      question: '¿Cuál es tu pretensión salarial mensual? (en quetzales)',
      type: 'number',
      required: false
    }
  ],
  marketing: [
    {
      id: 'q1',
      question: '¿Tienes experiencia gestionando campañas en redes sociales?',
      type: 'select',
      options: ['Sí, amplia experiencia', 'Algo de experiencia', 'Sin experiencia pero con interés'],
      required: true
    },
    {
      id: 'q2',
      question: 'Menciona alguna campaña exitosa que hayas liderado o en la que hayas participado',
      type: 'textarea',
      required: false
    }
  ],
  sales: [
    {
      id: 'q1',
      question: '¿Cuál ha sido tu logro más importante en ventas?',
      type: 'textarea',
      required: true
    },
    {
      id: 'q2',
      question: '¿Tienes experiencia con CRM? ¿Cuál?',
      type: 'text',
      required: false
    }
  ]
}

export function generateSampleJobs(): Job[] {
  const now = new Date()
  
  return [
    {
      id: 'job_1',
      title: 'Desarrollador Full Stack',
      company: 'Cooperativa Tecnológica Coosajer',
      location: 'Guatemala, Guatemala',
      category: 'desarrollo-software',
      description: 'Buscamos un desarrollador full stack con experiencia en React y Node.js para unirse a nuestro equipo de innovación tecnológica. Trabajarás en proyectos que impactan directamente a miles de usuarios en la red cooperativa.\n\nOfrecemos un ambiente de trabajo colaborativo, oportunidades de crecimiento profesional y beneficios competitivos.',
      requirements: [
        '3+ años de experiencia con React y TypeScript',
        'Experiencia con Node.js y bases de datos SQL/NoSQL',
        'Conocimiento de arquitecturas de microservicios',
        'Experiencia con Git y metodologías ágiles',
        'Habilidades de comunicación y trabajo en equipo'
      ],
      salary: 'Q15,000 - Q25,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 24,
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
      customQuestions: sampleQuestions.developer
    },
    {
      id: 'job_2',
      title: 'Especialista en Marketing Digital',
      company: 'Coosajer Marketing',
      location: 'Antigua Guatemala, Sacatepéquez',
      category: 'marketing',
      description: 'Únete a nuestro equipo de marketing para crear y ejecutar estrategias digitales innovadoras que promuevan los servicios de nuestra red cooperativa.\n\nResponsabilidades:\n- Gestión de campañas en redes sociales\n- Creación de contenido digital\n- Análisis de métricas y ROI\n- Coordinación con equipo creativo',
      requirements: [
        'Licenciatura en Marketing, Comunicación o afines',
        '2+ años en marketing digital',
        'Dominio de herramientas de analítica web',
        'Experiencia con Facebook Ads, Google Ads',
        'Creatividad y pensamiento estratégico'
      ],
      salary: 'Q8,000 - Q12,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 18,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      customQuestions: sampleQuestions.marketing
    },
    {
      id: 'job_3',
      title: 'Ejecutivo de Ventas',
      company: 'Coosajer Servicios Financieros',
      location: 'Quetzaltenango, Quetzaltenango',
      category: 'ventas',
      description: 'Buscamos ejecutivos comerciales apasionados por las ventas y el servicio al cliente para promover nuestros productos financieros cooperativos.\n\nOfrecemos:\n- Salario base + comisiones atractivas\n- Capacitación continua\n- Plan de carrera claro\n- Ambiente de trabajo positivo',
      requirements: [
        'Experiencia mínima de 1 año en ventas',
        'Excelentes habilidades de comunicación',
        'Orientación a resultados',
        'Licencia de conducir (deseable)',
        'Disponibilidad para viajar en la región'
      ],
      salary: 'Q6,000 + Comisiones',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 32,
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
      customQuestions: sampleQuestions.sales
    },
    {
      id: 'job_4',
      title: 'Diseñador UX/UI',
      company: 'Coosajer Digital',
      location: 'Guatemala, Guatemala',
      category: 'diseno',
      description: 'Estamos buscando un diseñador UX/UI talentoso para ayudarnos a crear experiencias digitales excepcionales para los miembros de nuestra cooperativa.\n\nTrabajarás en la evolución de nuestras plataformas web y móviles, desde la investigación de usuarios hasta la implementación del diseño.',
      requirements: [
        '2+ años de experiencia en diseño UX/UI',
        'Dominio de Figma, Adobe XD o similar',
        'Experiencia en diseño responsive y accesibilidad',
        'Conocimiento de principios de usabilidad',
        'Portfolio con casos de estudio demostrable'
      ],
      salary: 'Q10,000 - Q18,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 15,
      imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_5',
      title: 'Contador General',
      company: 'Cooperativa Coosajer Central',
      location: 'Escuintla, Escuintla',
      category: 'contabilidad',
      description: 'Buscamos un contador con sólida experiencia para gestionar la contabilidad general de nuestra cooperativa, asegurando el cumplimiento de las normativas fiscales y financieras.\n\nResponsabilidades principales:\n- Registro y control de operaciones contables\n- Preparación de estados financieros\n- Cumplimiento fiscal\n- Gestión de auditorías',
      requirements: [
        'Contador Público Autorizado (CPA)',
        '3+ años de experiencia en contabilidad',
        'Conocimiento de normativas NIIF',
        'Experiencia con software contable',
        'Atención al detalle y organización'
      ],
      salary: 'Q12,000 - Q16,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 21,
      imageUrl: 'https://images.unsplash.com/photo-1554224311-beee4ece0ca5?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_6',
      title: 'Atención al Cliente - Call Center',
      company: 'Coosajer Atención',
      location: 'Guatemala, Guatemala',
      category: 'atencion-cliente',
      description: 'Únete a nuestro equipo de atención al cliente y ayuda a brindar un servicio excepcional a los miembros de nuestra cooperativa.\n\nTurnos rotativos disponibles. Capacitación completa incluida.',
      requirements: [
        'Bachillerato completo mínimo',
        'Excelente comunicación verbal',
        'Paciencia y empatía',
        'Capacidad de resolver problemas',
        'Disponibilidad de turnos rotativos'
      ],
      salary: 'Q4,500 - Q6,000',
      type: 'full-time',
      postedDate: now.toISOString(),
      applicants: 45,
      customQuestions: []
    },
    {
      id: 'job_7',
      title: 'Desarrollador Frontend React',
      company: 'Tech Solutions Guatemala',
      location: 'Guatemala, Guatemala',
      category: 'desarrollo-software',
      description: 'Buscamos un desarrollador frontend especializado en React para construir interfaces modernas y responsivas. Trabajarás con un equipo multidisciplinario en proyectos innovadores para clientes nacionales e internacionales.',
      requirements: [
        '2+ años de experiencia con React',
        'Conocimiento sólido de HTML5, CSS3, JavaScript ES6+',
        'Experiencia con TypeScript',
        'Familiaridad con herramientas de estado (Redux, Context API)',
        'Conocimiento de diseño responsive y mobile-first'
      ],
      salary: 'Q12,000 - Q18,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 31,
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
      customQuestions: sampleQuestions.developer
    },
    {
      id: 'job_8',
      title: 'Ingeniero DevOps',
      company: 'CloudTech Guatemala',
      location: 'Guatemala, Guatemala',
      category: 'ingenieria',
      description: 'Únete a nuestro equipo de infraestructura para automatizar, optimizar y mantener nuestros sistemas en la nube. Trabajarás con tecnologías de vanguardia en AWS y Kubernetes.',
      requirements: [
        'Experiencia con AWS, Azure o Google Cloud',
        'Conocimiento de Docker y Kubernetes',
        'Scripting en Bash, Python o similar',
        'CI/CD pipelines (Jenkins, GitLab CI, GitHub Actions)',
        'Conocimiento de Infrastructure as Code (Terraform, CloudFormation)'
      ],
      salary: 'Q18,000 - Q28,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 12,
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_9',
      title: 'Diseñador Gráfico',
      company: 'Creativa Studio',
      location: 'Antigua Guatemala, Sacatepéquez',
      category: 'diseno',
      description: 'Buscamos un diseñador gráfico creativo para unirse a nuestra agencia. Trabajarás en proyectos variados incluyendo branding, diseño editorial, packaging y contenido digital.',
      requirements: [
        'Portfolio demostrable',
        'Dominio de Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
        'Conocimientos de diseño web básico',
        'Capacidad para trabajar con múltiples proyectos simultáneamente',
        'Excelente sentido estético y atención al detalle'
      ],
      salary: 'Q6,000 - Q10,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 27,
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_10',
      title: 'Gerente de Recursos Humanos',
      company: 'Coosajer Capital Humano',
      location: 'Guatemala, Guatemala',
      category: 'recursos-humanos',
      description: 'Buscamos un profesional experimentado para liderar nuestro departamento de recursos humanos. Serás responsable de la estrategia de talento, cultura organizacional y desarrollo del equipo.',
      requirements: [
        'Licenciatura en Recursos Humanos, Psicología o afín',
        '5+ años de experiencia en gestión de RRHH',
        'Experiencia en reclutamiento y selección',
        'Conocimiento de legislación laboral guatemalteca',
        'Habilidades de liderazgo y comunicación'
      ],
      salary: 'Q15,000 - Q22,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 19,
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_11',
      title: 'Coordinador de Marketing de Contenidos',
      company: 'Digital Marketing GT',
      location: 'Guatemala, Guatemala',
      category: 'marketing',
      description: 'Únete a nuestro equipo para crear y gestionar contenido que inspire y convierta. Trabajarás en estrategias de content marketing para diversas marcas.',
      requirements: [
        'Experiencia en creación de contenido digital',
        'Excelente redacción y ortografía',
        'Conocimiento de SEO y SEM',
        'Experiencia con herramientas de gestión de redes sociales',
        'Capacidad analítica para medir resultados'
      ],
      salary: 'Q7,000 - Q11,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 23,
      imageUrl: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800&h=400&fit=crop',
      customQuestions: sampleQuestions.marketing
    },
    {
      id: 'job_12',
      title: 'Ejecutivo de Cuentas B2B',
      company: 'Soluciones Empresariales GT',
      location: 'Guatemala, Guatemala',
      category: 'ventas',
      description: 'Buscamos un ejecutivo de ventas enfocado en clientes corporativos. Gestionarás cuentas clave y desarrollarás nuevas oportunidades de negocio en el sector B2B.',
      requirements: [
        '3+ años de experiencia en ventas B2B',
        'Habilidades de negociación comprobadas',
        'Capacidad para construir relaciones a largo plazo',
        'Conocimiento del mercado empresarial guatemalteco',
        'Vehículo propio'
      ],
      salary: 'Q8,000 + Comisiones',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 16,
      imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=400&fit=crop',
      customQuestions: sampleQuestions.sales
    },
    {
      id: 'job_13',
      title: 'Asistente Contable',
      company: 'Servicios Contables Profesionales',
      location: 'Mixco, Guatemala',
      category: 'contabilidad',
      description: 'Se busca asistente contable para apoyar en las operaciones diarias del departamento de contabilidad. Excelente oportunidad para desarrollo profesional.',
      requirements: [
        'Estudiante de último año o recién graduado en Contaduría',
        'Conocimientos básicos de contabilidad',
        'Manejo de Excel intermedio',
        'Responsabilidad y puntualidad',
        'Disponibilidad inmediata'
      ],
      salary: 'Q4,000 - Q6,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 38,
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_14',
      title: 'Asistente Administrativo',
      company: 'Corporación Maya',
      location: 'Guatemala, Guatemala',
      category: 'administracion',
      description: 'Buscamos un asistente administrativo organizado y proactivo para apoyar las operaciones diarias de nuestra oficina corporativa.',
      requirements: [
        'Bachillerato o Secretariado',
        'Experiencia mínima de 1 año en puesto similar',
        'Dominio de Microsoft Office',
        'Excelentes habilidades organizacionales',
        'Buena presentación y comunicación'
      ],
      salary: 'Q4,500 - Q6,500',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 42,
      imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_15',
      title: 'Supervisor de Atención al Cliente',
      company: 'Coosajer Service Center',
      location: 'Villa Nueva, Guatemala',
      category: 'atencion-cliente',
      description: 'Se requiere supervisor para liderar nuestro equipo de atención al cliente. Serás responsable de garantizar la calidad del servicio y el desarrollo del equipo.',
      requirements: [
        'Experiencia de 2+ años en atención al cliente',
        'Experiencia previa en supervisión o liderazgo',
        'Excelentes habilidades de comunicación',
        'Capacidad para manejar situaciones difíciles',
        'Orientación al servicio y resultados'
      ],
      salary: 'Q7,000 - Q9,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 20,
      imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_16',
      title: 'Ingeniero Civil',
      company: 'Constructora del Valle',
      location: 'Quetzaltenango, Quetzaltenango',
      category: 'construccion',
      description: 'Buscamos ingeniero civil para supervisar proyectos de construcción residencial y comercial. Trabajarás en proyectos de gran escala en la región occidental.',
      requirements: [
        'Título de Ingeniero Civil',
        'Colegiado activo',
        '3+ años de experiencia en construcción',
        'Conocimiento de AutoCAD y software de diseño',
        'Disponibilidad para trabajar en campo'
      ],
      salary: 'Q12,000 - Q18,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 14,
      imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_17',
      title: 'Maestro de Primaria',
      company: 'Colegio Bilingüe Excellence',
      location: 'Antigua Guatemala, Sacatepéquez',
      category: 'educacion',
      description: 'Se busca maestro de primaria apasionado por la educación para unirse a nuestro equipo pedagógico. Colegio bilingüe con metodología innovadora.',
      requirements: [
        'Profesorado o Licenciatura en Pedagogía',
        'Experiencia mínima de 2 años',
        'Nivel intermedio-avanzado de inglés',
        'Conocimiento de metodologías activas',
        'Vocación de servicio y paciencia'
      ],
      salary: 'Q6,000 - Q9,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 25,
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_18',
      title: 'Enfermera Registrada',
      company: 'Hospital San Rafael',
      location: 'Guatemala, Guatemala',
      category: 'salud',
      description: 'Se necesita enfermera profesional para el área de hospitalización. Turnos rotativos en un ambiente profesional y de constante aprendizaje.',
      requirements: [
        'Título universitario en Enfermería',
        'Colegiado activo',
        'Experiencia mínima de 1 año (deseable)',
        'Disponibilidad de turnos rotativos',
        'Habilidades de trabajo en equipo'
      ],
      salary: 'Q7,000 - Q10,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 18,
      imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_19',
      title: 'Analista de Datos',
      company: 'Business Intelligence GT',
      location: 'Guatemala, Guatemala',
      category: 'desarrollo-software',
      description: 'Únete a nuestro equipo de data analytics para transformar datos en insights accionables. Trabajarás con grandes volúmenes de datos y herramientas de BI.',
      requirements: [
        'Experiencia con SQL y bases de datos',
        'Conocimiento de Python o R para análisis',
        'Experiencia con herramientas de visualización (Tableau, Power BI)',
        'Conocimientos estadísticos',
        'Capacidad analítica y atención al detalle'
      ],
      salary: 'Q10,000 - Q16,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 22,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      customQuestions: sampleQuestions.developer
    },
    {
      id: 'job_20',
      title: 'Community Manager',
      company: 'Social Media Agency GT',
      location: 'Guatemala, Guatemala',
      category: 'marketing',
      description: 'Buscamos community manager creativo para gestionar redes sociales de múltiples clientes. Crearás contenido, responderás comentarios y analizarás métricas.',
      requirements: [
        'Experiencia mínima de 1 año como community manager',
        'Excelente redacción y ortografía',
        'Conocimiento de todas las plataformas sociales',
        'Capacidad para trabajar bajo presión',
        'Portfolio de cuentas gestionadas'
      ],
      salary: 'Q5,000 - Q8,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 35,
      imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
      customQuestions: sampleQuestions.marketing
    },
    {
      id: 'job_21',
      title: 'Desarrollador Mobile (iOS/Android)',
      company: 'AppDev Guatemala',
      location: 'Guatemala, Guatemala',
      category: 'desarrollo-software',
      description: 'Únete a nuestro equipo para desarrollar aplicaciones móviles nativas para iOS y Android. Trabajarás en apps con miles de usuarios activos.',
      requirements: [
        'Experiencia con Swift/Objective-C o Kotlin/Java',
        'Conocimiento de React Native o Flutter (plus)',
        'Familiaridad con APIs RESTful',
        'Experiencia publicando apps en stores',
        'Portfolio de aplicaciones desarrolladas'
      ],
      salary: 'Q14,000 - Q22,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 17,
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
      customQuestions: sampleQuestions.developer
    },
    {
      id: 'job_22',
      title: 'Arquitecto',
      company: 'Estudio de Arquitectura Moderna',
      location: 'Antigua Guatemala, Sacatepéquez',
      category: 'ingenieria',
      description: 'Buscamos arquitecto creativo para diseñar proyectos residenciales y comerciales. Trabajarás en proyectos únicos con libertad creativa.',
      requirements: [
        'Título universitario en Arquitectura',
        'Colegiado activo',
        'Dominio de AutoCAD, SketchUp, Revit',
        'Portfolio de proyectos realizados',
        'Excelente sentido del diseño'
      ],
      salary: 'Q10,000 - Q16,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 11,
      imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_23',
      title: 'Consultor de Ventas Retail',
      company: 'Tiendas El Portal',
      location: 'Mixco, Guatemala',
      category: 'ventas',
      description: 'Se buscan consultores de ventas para nuestras tiendas retail. Atenderás clientes, realizarás ventas y mantendrás el orden del punto de venta.',
      requirements: [
        'Experiencia en ventas retail (deseable)',
        'Excelente presentación personal',
        'Habilidades de comunicación',
        'Orientación al cliente',
        'Disponibilidad de horarios'
      ],
      salary: 'Q3,500 + Comisiones',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 52,
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_24',
      title: 'Analista de Recursos Humanos',
      company: 'HR Solutions Guatemala',
      location: 'Guatemala, Guatemala',
      category: 'recursos-humanos',
      description: 'Buscamos analista de RRHH para apoyar en procesos de reclutamiento, onboarding y administración de personal.',
      requirements: [
        'Estudiante de últimos años o graduado en RRHH/Psicología',
        'Conocimiento de procesos de reclutamiento',
        'Manejo de Microsoft Office avanzado',
        'Excelentes habilidades interpersonales',
        'Proactividad y organización'
      ],
      salary: 'Q5,500 - Q8,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 29,
      imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_25',
      title: 'QA Tester / Analista de Calidad',
      company: 'Quality Tech GT',
      location: 'Guatemala, Guatemala',
      category: 'desarrollo-software',
      description: 'Únete a nuestro equipo de QA para garantizar la calidad de software. Diseñarás y ejecutarás planes de prueba, identificarás bugs y trabajarás estrechamente con desarrolladores.',
      requirements: [
        'Experiencia en testing manual y/o automatizado',
        'Conocimiento de metodologías de testing',
        'Familiaridad con herramientas de gestión de bugs (Jira, Bugzilla)',
        'Atención al detalle y pensamiento analítico',
        'Conocimiento de Selenium o Cypress (plus)'
      ],
      salary: 'Q7,000 - Q12,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 19,
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
      customQuestions: sampleQuestions.developer
    },
    {
      id: 'job_26',
      title: 'Coordinador de Logística',
      company: 'Distribuidora Nacional',
      location: 'Villa Nueva, Guatemala',
      category: 'administracion',
      description: 'Buscamos coordinador de logística para gestionar la cadena de suministro, inventarios y distribución. Coordinarás con proveedores y transportistas para garantizar entregas eficientes.',
      requirements: [
        'Experiencia de 2+ años en logística o supply chain',
        'Conocimiento de sistemas ERP',
        'Capacidad de planificación y organización',
        'Licencia de conducir (deseable)',
        'Disponibilidad para horarios flexibles'
      ],
      salary: 'Q8,000 - Q11,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 16,
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_27',
      title: 'Barista / Encargado de Cafetería',
      company: 'Café Cultura',
      location: 'Antigua Guatemala, Sacatepéquez',
      category: 'otros',
      description: 'Cafetería boutique busca barista apasionado por el café de especialidad. Prepararás bebidas de alta calidad y brindarás servicio excepcional a nuestros clientes.',
      requirements: [
        'Experiencia como barista (mínimo 1 año)',
        'Conocimiento de métodos de extracción',
        'Excelente atención al cliente',
        'Capacidad para trabajar bajo presión',
        'Disponibilidad de horarios rotativos'
      ],
      salary: 'Q3,500 - Q5,000 + propinas',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 28,
      imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_28',
      title: 'Técnico en Redes y Soporte IT',
      company: 'Soporte Tecnológico GT',
      location: 'Mixco, Guatemala',
      category: 'ingenieria',
      description: 'Empresa de servicios IT busca técnico para mantenimiento de redes, soporte a usuarios y resolución de incidencias técnicas.',
      requirements: [
        'Conocimientos de redes (TCP/IP, LAN, WAN)',
        'Experiencia en soporte técnico',
        'Conocimiento de Windows Server y Active Directory',
        'Habilidades de troubleshooting',
        'Certificaciones (A+, Network+, CCNA) deseable'
      ],
      salary: 'Q6,000 - Q9,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 22,
      imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_29',
      title: 'Copywriter Creativo',
      company: 'Agencia Creativa Palabras',
      location: 'Guatemala, Guatemala',
      category: 'marketing',
      description: 'Agencia busca copywriter para crear contenido persuasivo y creativo para campañas de publicidad, redes sociales y sitios web.',
      requirements: [
        'Portfolio de trabajos escritos',
        'Excelente redacción y creatividad',
        'Experiencia en copywriting publicitario',
        'Conocimiento de SEO (plus)',
        'Capacidad para trabajar con múltiples proyectos'
      ],
      salary: 'Q6,000 - Q10,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 31,
      imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop',
      customQuestions: sampleQuestions.marketing
    },
    {
      id: 'job_30',
      title: 'Psicólogo Clínico',
      company: 'Centro de Salud Mental Integral',
      location: 'Guatemala, Guatemala',
      category: 'salud',
      description: 'Centro de salud mental busca psicólogo clínico para atención de pacientes adolescentes y adultos. Ambiente profesional y de crecimiento continuo.',
      requirements: [
        'Licenciatura en Psicología Clínica',
        'Colegiado activo',
        'Experiencia mínima de 2 años',
        'Conocimiento de enfoques terapéuticos diversos',
        'Empatía y habilidades de escucha activa'
      ],
      salary: 'Q8,000 - Q12,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 14,
      imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_31',
      title: 'Editor de Video',
      company: 'Productora Audiovisual Dreams',
      location: 'Guatemala, Guatemala',
      category: 'diseno',
      description: 'Productora audiovisual busca editor de video para trabajar en proyectos comerciales, corporativos y contenido para redes sociales.',
      requirements: [
        'Dominio de Adobe Premiere Pro y After Effects',
        'Portfolio con trabajos realizados',
        'Conocimiento de color grading',
        'Creatividad y atención al detalle',
        'Conocimiento de DaVinci Resolve (plus)'
      ],
      salary: 'Q7,000 - Q12,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 26,
      imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_32',
      title: 'Gerente de Tienda Retail',
      company: 'Cadena de Tiendas Guatemala',
      location: 'Quetzaltenango, Quetzaltenango',
      category: 'ventas',
      description: 'Cadena retail busca gerente para administrar operaciones de tienda, supervisar equipo de ventas y garantizar excelencia en servicio al cliente.',
      requirements: [
        'Experiencia de 3+ años en retail',
        'Experiencia en gestión de equipos',
        'Conocimiento de operaciones de tienda',
        'Orientación a resultados y ventas',
        'Disponibilidad de horarios'
      ],
      salary: 'Q9,000 - Q14,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 18,
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
      customQuestions: sampleQuestions.sales
    },
    {
      id: 'job_33',
      title: 'Maestro de Inglés',
      company: 'Instituto de Idiomas Excellence',
      location: 'Guatemala, Guatemala',
      category: 'educacion',
      description: 'Instituto de idiomas busca maestro de inglés para impartir clases a niños, adolescentes y adultos. Grupos reducidos y ambiente dinámico.',
      requirements: [
        'Nivel avanzado/nativo de inglés (C1/C2)',
        'Certificación TEFL, TESOL o similar',
        'Experiencia en enseñanza de idiomas',
        'Metodologías comunicativas',
        'Paciencia y vocación de enseñanza'
      ],
      salary: 'Q6,000 - Q9,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 33,
      imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_34',
      title: 'Nutricionista Clínico',
      company: 'Clínica de Nutrición Vital',
      location: 'Antigua Guatemala, Sacatepéquez',
      category: 'salud',
      description: 'Clínica de nutrición busca nutricionista para consultas personalizadas, planes alimenticios y seguimiento de pacientes.',
      requirements: [
        'Licenciatura en Nutrición',
        'Colegiado activo',
        'Experiencia en consulta nutricional',
        'Conocimiento de software de planes alimenticios',
        'Empatía y habilidades de comunicación'
      ],
      salary: 'Q7,000 - Q11,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 15,
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_35',
      title: 'Scrum Master',
      company: 'Agile Software Company',
      location: 'Guatemala, Guatemala',
      category: 'desarrollo-software',
      description: 'Empresa de tecnología busca Scrum Master para facilitar procesos ágiles, coordinar equipos de desarrollo y garantizar entrega continua de valor.',
      requirements: [
        'Certificación Scrum Master (CSM o PSM)',
        'Experiencia de 2+ años como Scrum Master',
        'Conocimiento profundo de metodologías ágiles',
        'Habilidades de facilitación y liderazgo',
        'Experiencia con herramientas ágiles (Jira, Trello)'
      ],
      salary: 'Q14,000 - Q20,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 11,
      imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=400&fit=crop',
      customQuestions: []
    },
    {
      id: 'job_36',
      title: 'Chef de Cocina',
      company: 'Restaurante Gourmet La Estancia',
      location: 'Antigua Guatemala, Sacatepéquez',
      category: 'otros',
      description: 'Restaurante gourmet busca chef para liderar cocina, crear menús innovadores y supervisar equipo culinario.',
      requirements: [
        'Experiencia de 5+ años en cocina profesional',
        'Conocimiento de cocina internacional',
        'Experiencia en gestión de equipos',
        'Creatividad e innovación',
        'Disponibilidad de horarios'
      ],
      salary: 'Q10,000 - Q16,000',
      type: 'full-time',
      postedDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 13,
      imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=400&fit=crop',
      customQuestions: []
    }
  ]
}
