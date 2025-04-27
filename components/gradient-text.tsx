import type React from "react"
import { cn } from "@/lib/utils"

interface GradientTextProps {
  children: React.ReactNode
  colors?: string
}

export default function GradientText({
  children,
  colors = "from-purple-600 via-blue-500 to-green-400",
}: GradientTextProps) {
  return (
    <span className={cn("bg-clip-text text-transparent bg-gradient-to-r animate-gradient", colors)}>{children}</span>
  )
}
