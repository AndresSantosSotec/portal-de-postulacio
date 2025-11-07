import { createContext, useContext, useEffect } from 'react'


type Theme = 'light' | 'dark' | 'system'

  theme: Theme
  actualTheme: 'light' | 'd


  if (window.matchMedia('(p
  }
}
  actualTheme: 'light' | 'dark'
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

function getSystemTheme(): 'light' | 'dark' {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'

  return 'light'
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useKV<Theme>('theme', 'system')
  
  const currentTheme = theme || 'system'
  const actualTheme = currentTheme === 'system' ? getSystemTheme() : currentTheme

  }
}











      }





  return (



  )



  const context = useContext(ThemeProviderContext)



  return context

