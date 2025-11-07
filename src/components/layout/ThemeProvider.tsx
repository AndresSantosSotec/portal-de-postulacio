import { createContext, useContext, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

type Theme = 'light' | 'dark' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light' | 'dark'
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

function getSystemTheme(): 'light' | 'dark' {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useKV<Theme>('theme', 'system')
  
  const currentTheme = theme || 'system'
  const actualTheme = currentTheme === 'system' ? getSystemTheme() : currentTheme

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(actualTheme)
  }, [actualTheme])

  useEffect(() => {
    if (currentTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(getSystemTheme())
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [currentTheme])

  return (
    <ThemeProviderContext.Provider value={{ theme: currentTheme, setTheme, actualTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
