import { useEffect } from 'react'

const BASE_URL = 'https://www.oportunidadescoosanjer.com.gt'

interface SEOData {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
}

export function useSEO(data: SEOData) {
  useEffect(() => {
    const {
      title = 'Oportunidades Coosanjer - Portal de Empleos | Encuentra tu Próximo Trabajo',
      description = 'Portal de empleos de Coosanjer. Encuentra las mejores oportunidades laborales en Guatemala. Postula fácilmente y únete a nuestro equipo.',
      image = `${BASE_URL}/og-image.jpg`,
      url = BASE_URL,
      type = 'website'
    } = data

    // Actualizar title
    document.title = title

    // Función helper para actualizar o crear meta tag
    const updateMetaTag = (property: string, content: string, isProperty = true) => {
      const attr = isProperty ? 'property' : 'name'
      let meta = document.querySelector(`meta[${attr}="${property}"]`)
      
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attr, property)
        document.head.appendChild(meta)
      }
      
      meta.setAttribute('content', content)
    }

    // Meta tags básicos
    updateMetaTag('description', description, false)
    updateMetaTag('og:title', title)
    updateMetaTag('og:description', description)
    updateMetaTag('og:image', image)
    updateMetaTag('og:url', url)
    updateMetaTag('og:type', type)
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)
    updateMetaTag('twitter:url', url)

    // Cleanup: restaurar valores por defecto al desmontar
    return () => {
      document.title = 'Oportunidades Coosanjer - Portal de Empleos | Encuentra tu Próximo Trabajo'
      updateMetaTag('description', 'Portal de empleos de Coosanjer. Encuentra las mejores oportunidades laborales en Guatemala. Postula fácilmente y únete a nuestro equipo.', false)
      updateMetaTag('og:title', 'Oportunidades Coosanjer - Portal de Empleos')
      updateMetaTag('og:description', 'Encuentra las mejores oportunidades laborales en Guatemala. Postula fácilmente y únete a nuestro equipo.')
      updateMetaTag('og:url', BASE_URL)
      updateMetaTag('og:type', 'website')
    }
  }, [data])
}


