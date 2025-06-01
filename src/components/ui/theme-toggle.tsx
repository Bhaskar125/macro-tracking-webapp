"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-50 h-10 w-10 rounded-full shadow-lg border-2"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    )
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getTooltip = () => {
    switch (theme) {
      case "light":
        return "Switch to dark mode"
      case "dark":
        return "Switch to system mode"
      default:
        return "Switch to light mode"
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      title={getTooltip()}
      className="fixed bottom-4 left-4 z-50 h-10 w-10 rounded-full shadow-lg border-2 bg-background hover:bg-accent transition-colors"
    >
      {getIcon()}
    </Button>
  )
} 