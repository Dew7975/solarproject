"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"     // ✅ default white mode
      enableSystem={false}     // ✅ ignore OS dark mode
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}