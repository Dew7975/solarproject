"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function SmallThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  // label shows the TARGET mode
  const label = isDark ? "LIGHTMODE" : "NIGHTMODE"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={[
        "relative h-8.5 w-[160px] rounded-full border overflow-hidden",
        "transition-all duration-100 ease-out",
        "shadow-sm hover:shadow-md active:scale-[0.98]",
        isDark
          ? "bg-white text-zinc-900 border-zinc-200" // black button
          : "bg-zinc-950 text-white border-zinc-800", // white button
        // make room for icon bubble (left when light, right when dark)
        isDark ? "pl-4 pr-11" : "pl-11 pr-4",
      ].join(" ")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* text */}
      <span className="block w-full text-center font-extrabold tracking-[0.16em] text-[12px]">
        {label}
      </span>

      {/* icon bubble */}
      <span
        className={[
          "absolute top-1/2 -translate-y-1/2",
          "grid place-items-center",
          "h-7 w-7 rounded-full",
          "transition-all duration-300 ease-out",
          isDark
            ? "right-1.5 bg-zinc-900 border border-zinc-700" // for LIGHTMODE show Sun
            : "left-1.5 bg-zinc-50 border border-zinc-200",  // for NIGHTMODE show Moon
        ].join(" ")}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-white" />
        ) : (
          <Moon className="h-4 w-4 text-zinc-900" />
        )}
      </span>
    </button>
  )
}