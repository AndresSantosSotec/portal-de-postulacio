import { createContext, useContext, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

type ThemeProviderProps = {

type ThemeProviderState = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
export function ThemeProvider({


    }

  const currentTheme = theme || 'system'


    root.classList.add(actualTheme)

    if (theme === 'system') {
     
    return 'light'
  }

  const actualTheme = theme === 'system' ? getSystemTheme() : theme

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(actualTheme)
  }, [actualTheme])

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(getSystemTheme())
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, actualTheme }}>
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
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(getSystemTheme())
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

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
