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
    }
  ]
}
