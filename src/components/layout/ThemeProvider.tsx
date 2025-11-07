import { createContext, useContext, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

type Theme = 'light' | 'dark' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode


type ThemeProviderState = {
  theme: Theme
    return 'dark'
  setTheme: (theme: Theme) => void
}

  

  useEffect(() => {
    root.classList.remove('light', 'dark')
  }, [actualTheme
  }
    actualTheme,
 

      {children}
  )

  const context = useContext(ThemeProvid
    throw new Error('useTheme must be used within a ThemeProvider')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(actualTheme)
  }, [actualTheme])

  const value = {
    theme: currentTheme,
    actualTheme,
    setTheme,



    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>

}

export function useTheme() {

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

}
