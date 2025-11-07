import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'

  theme: Theme


  children: Re
  actualTheme: 'light' | 'dark'

 

      return window.matchMedia
    return currentThe


const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setTheme] = useKV<Theme>('theme', 'system')

  const getActualTheme = (): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return currentTheme
  }









  return (



  )



  const context = useContext(ThemeProviderContext)



  return context

