import { createContext, useContext, useEffect } from 'react'


  children: React.ReactNode

  theme: Theme
  children: React.ReactNode
}

  const [currentTheme, setT
  const getAct
  actualTheme: 'light' | 'dark'
    return currentTheme


const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setTheme] = useKV<Theme>('theme', 'system')

  const getActualTheme = (): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return currentTheme
  

  const actualTheme = getActualTheme()











  }

  return (



  )



  const context = useContext(ThemeProviderContext)
  




  return context

