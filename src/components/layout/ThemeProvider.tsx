import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'

type Theme = 'light' | 'dark' | 'system'

interface ThemeProviderProps {
  actualTheme: 'light


  const [currentTheme, setThem
  const getAct
      return window.matchMedia('(p
  actualTheme: 'light' | 'dark'


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

