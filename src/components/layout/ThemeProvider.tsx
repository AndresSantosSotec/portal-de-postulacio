import { createContext, useContext, useEffect, ReactNode } from 'react'


  children: ReactNode

  theme: Theme
  children: ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light' | 'dark'
}

    root.classList.add(getActualTheme())

    theme: currentTheme,
    actualTheme: getActualTheme()

    <ThemeProviderContext.Provider value={value}>
    </ThemeProviderContext.Provider>
}
expor
  if (context === undef
  }













  return (



  )



  const context = useContext(ThemeProviderContext)



  return context

