"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent any flash by ensuring we're mounted before rendering with theme support
  // The server-side default class handles initial render
  return (
    <NextThemesProvider
      {...props}
      // Force the theme to be applied immediately
      forcedTheme={mounted ? undefined : props.defaultTheme}
    >
      {children}
    </NextThemesProvider>
  )
}
