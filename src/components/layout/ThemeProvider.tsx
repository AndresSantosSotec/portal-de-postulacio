import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'

  children: ReactNode

type ThemeProviderState = {
  children: ReactNode
}
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light' | 'dark'
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [storedTheme, setStoredTheme] = useKV<Theme>('theme', defaultTheme)
  const [theme, setTheme] = useState<Theme>(storedTheme || defaultTheme)

  const getActualTheme = (): 'light' | 'dark' => {
        const root = window.d
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  }

  useEffect(() => {
    setStoredTheme(theme)
  }, [theme, setStoredTheme])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(getActualTheme())
  }, [theme])

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        const root = window.document.documentElement
  const context = useContext(ThemeProviderCont
        root.classList.add(getActualTheme())
  }
      mediaQuery.addEventListener('change', handleChange)

    }
  }, [theme])

  const value = {

    setTheme,

  }


    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>

}

export function useTheme() {

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

}
